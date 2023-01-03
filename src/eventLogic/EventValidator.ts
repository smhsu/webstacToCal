import { DATE_TIME_PARSER as PARSER } from "./DateTimeParser";
import { IValidationError, ValidationErrorType } from "./IValidationError";
import { IWebstacEvent, WebstacEventType } from "./IWebstacEvent";

export class EventValidator {
    validate(event: IWebstacEvent): IValidationError[] {
        const errors: IValidationError[] = [];

        if (!event.name) {
            errors.push({ type: ValidationErrorType.BadName, details: "Enter a name" });
        }

        if (event.type === WebstacEventType.Exam && !PARSER.parseDate(event.date).isValid) {
            errors.push({
                type: ValidationErrorType.BadDate,
                details: "Enter a valid date: " + PARSER.dateInputInstructions
            });
        }

        if (event.type === WebstacEventType.Course && event.repeatingDays.size === 0) {
            errors.push({ type: ValidationErrorType.BadRecurrence, details: "Select at least one day of the week" });
        }

        const startTime = PARSER.parseTime(event.startTime);
        const endTime = PARSER.parseTime(event.endTime);
        if (!startTime.isValid) {
            errors.push({
                type: ValidationErrorType.BadStartTime,
                details: "Enter a valid start time: " + PARSER.timeInputInstructions
            });
        }
        if (!endTime.isValid) {
            errors.push({
                type: ValidationErrorType.BadEndTime,
                details: "Enter a valid end time: " + PARSER.timeInputInstructions
            });
        }

        if (startTime.isValid && endTime.isValid && startTime > endTime) {
            errors.push({ type: ValidationErrorType.EndBeforeStart, details: "Start time is after end time" });
        }

        return errors;
    }
}
