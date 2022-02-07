const API_SCOPE = "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events";
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
// https://developers.google.com/identity/protocols/googlescopes#calendarv3
// https://developers.google.com/api-client-library/javascript/reference/referencedocs
// https://developers.google.com/google-apps/calendar/



/**
 * Wrapper functions around Google's calendar API.  Functions are in a namespaced global scope because Google's API is
 * in global scope.
 *
 * Note: when any of the asynchronous functions throw, they are guaranteed to throw an instance of Error.
 *
 * @author Silas Hsu
 */
export namespace CalendarApi {
    let initPromise: Promise<void> | null = null;

    /**
     * Initializes Google's API.  Required before using any other function.
     *
     * @returns a promise that resolves when initialization is complete
     */
    export function init(): Promise<void> {
        if (initPromise) {
            return initPromise;
        }

        if (process.env.REACT_APP_API_KEY === undefined || process.env.REACT_APP_OAUTH_CLIENT_ID === undefined) {
            throw new Error("Required environment variables not set during build time.  Refer to README.md for " +
                "more details.");
        }
        if (!gapi.client) { // Should be loaded in a <script> in the HTML
            throw new Error("Google client library is required in global scope.  Be sure it has loaded and " +
                "executed completely.");
        }

        initPromise = gapi.client.init({
            apiKey: process.env.REACT_APP_API_KEY,
            clientId: process.env.REACT_APP_OAUTH_CLIENT_ID,
            scope: API_SCOPE,
            // discoveryDocs will augment gapi with additional calendar-related methods.
            discoveryDocs: DISCOVERY_DOCS,
        }).catch(convertToErrorObjAndThrow);

        return initPromise;
    }

    /**
     * Requests permission from the user to access their Google calendar.  Returns a promise that resolves when the user
     * grants permission, and rejects if the user denies permission or some other error happens.
     *
     * @returns a Promise that resolves when the user is signed in
     */
    export function signIn(): Promise<void> {
        return gapi.auth2.getAuthInstance()
            .signIn()
            .then(_user => undefined)
            .catch(convertToErrorObjAndThrow);
    }

    /**
     * @returns whether a user is signed in
     */
    export function getIsSignedIn(): boolean {
        return gapi.auth2.getAuthInstance()
            .currentUser.get()
            .isSignedIn();
    }

    /**
     * Ends the user's Google Calendar session, allowing another user to sign in.
     *
     * @returns a Promise that resolves when the user is signed out
     */
    export function signOut(): Promise<void> {
        // The type definitions say `signOut` returns any but it's actually does an HTTP request and returns a Promise.
        return gapi.auth2.getAuthInstance()
            .signOut()
            .catch(convertToErrorObjAndThrow);
    }

    /**
     * @returns a Promise for a list of the user's *editable* calendars
     */
    export function fetchWritableCalendars(): Promise<gapi.client.calendar.CalendarListEntry[]> {
        return gapi.client.calendar.calendarList
            .list({ minAccessRole: "writer" })
            .then(response => response.result.items)
            .catch(convertToErrorObjAndThrow);
    }

    /**
     * Posts an event to the specified calendar.  Returns a Promise that resolves with a URL to the created event.
     *
     * @param calendarId - the calendar to which to add the event
     * @param event - the event data
     * @returns a Promise for the URL to the created event
     */
    export function createEvent(calendarId: string, event: gapi.client.calendar.EventInput): Promise<string> {
        return gapi.client.calendar.events
            .insert({ calendarId, resource: event })
            .then(response => response.result.htmlLink)
            .catch(convertToErrorObjAndThrow);
    }

    /**
     * Tries to convert an error to an instance of an ApiHttpError.  Also logs.
     *
     * @param error - any error thrown during an API call
     */
    function convertToErrorObjAndThrow(error: unknown): never {
        console.error(error);

        const converted = ApiHttpError.tryToConvert(error);
        if (converted !== null) {
            throw converted;
        } else if (error instanceof Error) {
            throw error;
        }

        throw new ApiUnknownError(error);
    }
}

////////////////
// API errors //
////////////////

/**
 * An error thrown by functions in {@link CalendarApi} when a non-Error object is thrown.  Very unusual; most
 * bugs should throw ReferenceError or some other kind of object extending Error.
 *
 * @author Silas Hsu
 */
export class ApiUnknownError extends Error {
    public originalThrown: unknown;

    constructor(error: unknown) {
        if (typeof error === "string") {
            super(error);
        } else {
            super("Unknown error");
        }
        this.originalThrown = error;
    }
}

/**
 * An error thrown by functions in {@link CalendarApi} originating from HTTP requests.  400-level and 500-level
 * responses should be covered by this error, as well as situations where the server does not respond.
 *
 * @author Silas Hsu
 */
export class ApiHttpError extends Error {
    public statusCode: number | null | undefined;
    constructor(statusCode: number | null | undefined, details?: string) {
        let message = (statusCode !== null && statusCode !== undefined) ?
            `HTTP ${statusCode}` : "No response -- check internet connection";
        if (details) {
            message += ": " + details;
        }
        super(message);
        // eslint-disable-next-line max-len
        // See https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
        // for why we have to do this setPrototypeOf()
        // Object.setPrototypeOf(this, ApiHttpError.prototype);
        this.name = "ApiHttpError";
        this.statusCode = statusCode;
    }

    /**
     * Checks if an object is similar enough to a Google error object, and if so, uses the contained data to make a new
     * ApiError.  Otherwise, returns null.
     *
     * @param obj - object from which to make a ApiHttpError
     * @returns {ApiHttpError | null} a new ApiError if the object was suitable, and null otherwise
     */
    static tryToConvert(obj: unknown): ApiHttpError | null {
        if (obj instanceof ApiHttpError) {
            return obj;
        }
        if (isGoogleError(obj)) {
            return new ApiHttpError(obj.status, obj.result.error.message);
        }
        return null;
    }
}

/**
 * Google API throws these objects.  It is loosely based off of {@link gapi.client.HttpRequestRejected}.
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
    headers: Record<string, string>; // Key-value pairs representing HTTP headers
    status: number | null; // HTTP status
    statusText: string | null;
}

/**
 * Gets, loosely, whether an object implements the {@link GoogleError} interface
 *
 * @param obj - the object to check
 * @returns true if the object loosely implements {@link GoogleError}
 */
function isGoogleError(obj: unknown): obj is GoogleError {
    if (hasProperty(obj, "result") && hasProperty(obj.result, "error")) {
        const error = obj.result.error;
        return (
            isObject(error) &&
            typeof error.code === "number" &&
            typeof error.message === "string"
        );
    }
    return false;
}

function isObject(something: unknown): something is Record<PropertyKey, unknown> {
    return something !== null && typeof something === "object";
}
function hasProperty<P extends PropertyKey>(something: unknown, prop: P): something is Record<P, unknown> {
    return isObject(something) && prop in something;
}
