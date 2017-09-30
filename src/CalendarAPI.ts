const API_SCOPE = "https://www.googleapis.com/auth/calendar";
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
// https://developers.google.com/api-client-library/javascript/reference/referencedocs
// https://developers.google.com/google-apps/calendar/

// Alias some names so we don't have to type so much ;)
interface RequestFulfilled<T> extends gapi.client.HttpRequestFulfilled<T> {}
interface CalendarList extends gapi.client.calendar.CalendarList {}
interface CalendarListEntry extends gapi.client.calendar.CalendarListEntry {}

/**
 * A singleton wrapper around Google's calendar API.  This class is singleton because Google's API is in global scope,
 * and is wrapped because Google's promises are not exactly ES6-confomant.
 * 
 * @author Silas Hsu
 */
export class CalendarApi {
    private static instancePromise: Promise<CalendarApi> | null = null;

    private constructor() {}

    /**
     * Returns a promise for the global instance of CalendarApi.  This function will also initialize the calendar API
     * the first time it is called.
     * 
     * @return {Promise<CalendarApi>} a promise for the instance
     */
    static getInstance(): Promise<CalendarApi> {
        if (CalendarApi.instancePromise === null) {
            // Init in this function because it is async, and constructors cannot be async.
            if (process.env.REACT_APP_API_KEY === undefined || process.env.REACT_APP_OAUTH_CLIENT_ID === undefined) {
                throw new Error("Required environment variables not set during build time.  Refer to README.md for " +
                  "more details.");
            }
            if (!gapi.client.init) { // Should be loaded in a <script> in the HTML
                throw new Error("Google client library is required in global scope.  Be sure it has loaded and " +
                    "executed completely.");
            }

            CalendarApi.instancePromise = new Promise<CalendarApi>((resolve, reject) => {
                gapi.client.init({
                    apiKey: process.env.REACT_APP_API_KEY,
                    clientId: process.env.REACT_APP_OAUTH_CLIENT_ID,
                    scope: API_SCOPE,
                    // discoveryDocs will augment gapi with additional calendar-related methods.
                    discoveryDocs: DISCOVERY_DOCS,
                }).then(
                    () => resolve(new CalendarApi()),
                    error => reject(ApiHttpError.tryToConvert(error) || error)
                );
            });
        }
        return CalendarApi.instancePromise;
    }

    /**
     * @return {boolean} whether the current user is signed in
     */
    getIsSignedIn(): boolean {
        return gapi.auth2.getAuthInstance()
            .currentUser.get()
            .isSignedIn();
    }

    /**
     * Requests permission from the user to access their Google calendar.  Returns a promise that resolves when the user
     * grants permission, and rejects if the user denies permission or some other error happens.
     * 
     * @return {Promise<void>} a Promise that resolves when the user is signed in
     */
    signIn(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            gapi.auth2.getAuthInstance().signIn().then(
                resolve,
                (error: any) => reject(ApiHttpError.tryToConvert(error) || error) // tslint:disable-line:no-any
            );
        });
    }

    /**
     * Ends the user's Google Calendar session, allowing another user to sign in.
     * 
     * @return {Promise<void>} a Promise that resolves when the user is signed out
     */
    signOut(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            gapi.auth2.getAuthInstance().signOut().then(
                resolve,
                (error: any) => reject(ApiHttpError.tryToConvert(error) || error) // tslint:disable-line:no-any
            );
        });
    }

    getCalendarList(): Promise<CalendarListEntry[]> {
        return new Promise<RequestFulfilled<CalendarList>>((resolve, reject) => {
            gapi.client.calendar.calendarList.list({minAccessRole: "writer"}).then(
                resolve,
                error => reject(ApiHttpError.tryToConvert(error) || error)
            );
        }).then(response => response.result.items);
    }

    makeNewEvent(calendarId: string, mymodel: Object): Promise<void> {
        return Promise.resolve();
    }

}

export default CalendarApi;

////////////////
// API errors //
////////////////

/**
 * Google API throws these objects.  This is a more specific version of {@link gapi.client.HttpRequestRejected}.
 */
interface GoogleError {
    result: {
        error: {
            code: number;
            errors: object[] | undefined;
            message: string;
        }
    };
    body: string; // HTTP response body
    headers: {}; // Key-value pairs representing HTTP headers
    status: number | null; // HTTP status
    statusText: string | null;
}

/**
 * Gets, loosely, whether an object implements the {@link GoogleError} interface
 * 
 * @param obj - the object to check
 * @return true if the object loosely implements {@link GoogleError}
 */
function isGoogleErrorObject(obj: any): obj is GoogleError { // tslint:disable-line:no-any
    if (typeof obj === "object" && "result" in obj) {
        let result = obj.result || {};
        if ("error" in result) {
            let error = result.error;
            return (typeof error.code === "number" && typeof error.message === "string");
        }
    }
    return false;
}

/**
 * An error thrown by {@link CalendarApi} when encountering errors.  Aims to provide a friendlier interface than
 * Google's error objects.
 * 
 * @author Silas Hsu
 */
export class ApiHttpError extends Error {
    constructor(reason: string, statusCode: number | null | undefined) {
        let preface = (statusCode != null) ? "HTTP " + statusCode : "No response -- check connection";
        super(`${preface}: ${reason}`);
    }

    /**
     * Checks if an object is similar enough to a Google error object, and if so, uses the contained data to make a new
     * ApiError.  Otherwise, returns null.
     * 
     * @param obj - object from which to make a ApiHttpError
     * @return {ApiHttpError | null} a new ApiError if the object was suitable, and null otherwise
     */
    static tryToConvert(obj: any): ApiHttpError | null { // tslint:disable-line:no-any
        if (obj instanceof ApiHttpError) {
            return obj;
        }
        if (isGoogleErrorObject(obj)) {
            return new ApiHttpError(obj.result.error.message, obj.status);
        }

        return null;
    }
}
