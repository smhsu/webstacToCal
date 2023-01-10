import { IValidationError, ValidationErrorType } from "./IValidationError";
import { IWebstacEventData, WebstacEventType } from "./IWebstacEvent";

export class EventValidator {
    validate(event: IWebstacEventData): IValidationError[] {
        const errors: IValidationError[] = [];

        if (!event.name) {
            errors.push({ type: ValidationErrorType.BadName, details: "Enter a name" });
        }

        if (event.type === WebstacEventType.Final && !event.date.parsed.isValid) {
            errors.push({
                type: ValidationErrorType.BadDate,
                details: "Enter a valid date. " + event.date.formatInstructions
            });
        }

        if (event.type === WebstacEventType.Course && event.repeatingDays.size === 0) {
            errors.push({ type: ValidationErrorType.BadRecurrence, details: "Select at least one day of the week" });
        }

        const startTime = event.startTime.parsed;
        const endTime = event.endTime.parsed;
        if (!startTime.isValid) {
            errors.push({
                type: ValidationErrorType.BadStartTime,
                details: "Enter a valid start time. " + event.startTime.formatInstructions
            });
        }
        if (!endTime.isValid) {
            errors.push({
                type: ValidationErrorType.BadEndTime,
                details: "Enter a valid end time. " + event.endTime.formatInstructions
            });
        }

        if (startTime.isValid && endTime.isValid && startTime > endTime) {
            errors.push({ type: ValidationErrorType.EndBeforeStart, details: "Start time is after end time" });
        }

        return errors;
    }
}
