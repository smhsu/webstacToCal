export enum ValidationErrorType {
    BadDate,
    BadStartTime,
    BadEndTime,
    EndBeforeStart,
    BadRecurrence
}

export interface IValidationError {
    type: ValidationErrorType;

    /**
     * A user-understandable description of the error.
     */
    details: string;
}
