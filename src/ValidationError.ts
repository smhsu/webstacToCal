export enum ValidationErrorReason {
    PERMISSION_DENIED = "Scroll up to step 1 and grant permission first.",
    NO_CALENDAR_SELECTED = "Select a calendar first.",
    DATE = "Enter a date in a supported format, like YYYY-MM-DD.",
    TIME = "Enter a valid time (HH:MM[am/pm]).",
    END_BEFORE_START = "End time must be AFTER start time.",
    REPEAT_REQUIRED = "Select at least one day of the week.",
}

/**
 * 
 * @author Silas Hsu
 */
export class ValidationError extends Error {
    constructor(reason: ValidationErrorReason) {
        super(reason);
        // tslint:disable-next-line:max-line-length
        // See https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
        // for why we have to do this setPrototypeOf()
        Object.setPrototypeOf(this, ValidationError.prototype);
        this.name = "ValidationError";
    }
}

export default ValidationError;
