if (process.env.REACT_APP_API_KEY === undefined) {
    throw new Error("Required environment variable `REACT_APP_API_KEY` not set during build time.");
}
const API_KEY = process.env.REACT_APP_API_KEY;
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

/**
 * Wrapper functions around Google's calendar API.  This is a Singleton class because Google's API is in global scope.
 *
 * @author Silas Hsu
 */
export class CalendarApi {
    static _instance: CalendarApi;

    /**
     * Initializes Google's API.  Required before using any other function.
     *
     * @returns a promise that resolves when initialization is complete
     */
    static initGapi(): Promise<void> {
        return gapi.client.init({
            apiKey: API_KEY,
            // discoveryDocs will augment gapi.client with additional calendar-related methods.
            discoveryDocs: DISCOVERY_DOCS,
        });
    }

    static getInstance(): CalendarApi {
        if (!CalendarApi._instance) {
            CalendarApi._instance = new CalendarApi();
        }
        return CalendarApi._instance;
    }

    private constructor() { }

    /**
     * @returns a Promise for a list of the user's *editable* calendars
     */
    listWritableCalendars(): Promise<gapi.client.calendar.CalendarListEntry[]> {
        return gapi.client.calendar.calendarList
            .list({ minAccessRole: "writer" })
            .then(response => response.result.items)
            .catch(CalendarApi.convertToErrorObjAndThrow);
    }

    /**
     * Posts an event to the specified calendar.  Returns a Promise that resolves with a URL to the created event.
     *
     * @param calendarId - the calendar to which to add the event
     * @param event - the event data
     * @returns a Promise for the URL to the created event
     */
    createEvent(calendarId: string, event: gapi.client.calendar.EventInput): Promise<string> {
        return gapi.client.calendar.events
            .insert({ calendarId, resource: event })
            .then(response => response.result.htmlLink)
            .catch(CalendarApi.convertToErrorObjAndThrow);
    }

    /**
     * Tries to convert an error to an instance of an ApiHttpError.  Also logs.
     *
     * @param error - any error thrown during an API call
     */
    static convertToErrorObjAndThrow(error: unknown): never {
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
