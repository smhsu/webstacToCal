import * as moment from "moment";
import { semester } from "./Semester";
import { ValidationError, ValidationErrorReason } from "./ValidationError";

// All of these used directly or indirectly in generateEventObject()
const TIME_FORMAT = "h:mmA";
const RECURRANCE_DAY_STRINGS = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
const RECURRANCE_END_FORMAT = "YYYYMMDD";
const TIME_ZONE = "America/Chicago";
const DESCRIPTION = "Created by WebSTAC to Calendar";
const REMINDERS = {
    overrides: [],
    useDefault: false
};

// Example of an ISO 8601 date: 2017-10-09T02:33:50Z
const ISO_TIME_START_INDEX = 11;
const ISO_TIME_CHARS_TO_KEEP = 8; // Should be everything except the Z

export enum EventInputButtonState {
    normal,
    loading,
    success,
    error,
}

export class EventInputModel {
    static readonly DAYS_PER_WEEK = 7;

    name: string = "";
    location: string = "";
    
    /**
     * The date for this event.  This model currently only supports events that start and end on the same date.
     */
    date: string = "";
    startTime: string = "";
    endTime: string = "";

    /**
     * Whether this event is a course.  If true, imposes extra validation of repeating days and uses semester.ts's dates
     * when generating event objects.
     */
    isCourse: boolean = true;
    /**
     * An array of boolean, one for each day of the week.  Monday is index 0 and Sunday is index 6.
     */
    repeatingDays: boolean[] = Array(EventInputModel.DAYS_PER_WEEK).fill(false);

    buttonState: EventInputButtonState = EventInputButtonState.normal;
    successUrl: string | null = null;
    error: Error | null = null;

    /**
     * A flag used by EventTable.
     */
    isCustom: boolean = false;

    getIsRepeating() {
        return this.repeatingDays.some(day => day); // Identity function
    }

    getIsReadyToAdd() {
        return this.buttonState === EventInputButtonState.normal || this.buttonState === EventInputButtonState.error;
    }

    generateEventObject(): gapi.client.calendar.EventInput {
        let {startDateTime, endDateTime} = this.generateStartEndTimes();
        return {
            summary: this.name,
            location: this.location,
            start: {
                dateTime: startDateTime,
                timeZone: TIME_ZONE
            },
            end: {
                dateTime: endDateTime,
                timeZone: TIME_ZONE
            },
            recurrence: this.generateRecurrence(),
            description: DESCRIPTION,
            reminders: REMINDERS,
        };
    }

    parseDateAndTimes() {
        let date = this.isCourse ? semester.startDate : moment(this.date, ["MMM D YYYY", "YYYY-MM-DD"], true);
        if (!date.isValid()) {
            throw new ValidationError(ValidationErrorReason.DATE);
        }
        let startTime = moment.utc(this.startTime, TIME_FORMAT, true);
        let endTime = moment.utc(this.endTime, TIME_FORMAT, true);
        if (!startTime.isValid() || !endTime.isValid()) {
            throw new ValidationError(ValidationErrorReason.TIME);
        }
        if (endTime.isBefore(startTime)) {
            throw new ValidationError(ValidationErrorReason.END_BEFORE_START);
        }
        return {
            date: date,
            startTime: startTime,
            endTime: endTime
        };
    }

    generateStartEndTimes() {
        let { date, startTime, endTime } = this.parseDateAndTimes();
        let firstRepeatingDay = this.repeatingDays.findIndex(day => day);
        if (firstRepeatingDay > -1) {
            // If the event is repeating, we need to set the date so it corresponds to the first repeating day.
            // Do this modulo thing, because moment.js represents Monday with 1 (and Sunday with 0), but we represent
            // Monday with 0.
            firstRepeatingDay = (firstRepeatingDay + 1) % EventInputModel.DAYS_PER_WEEK;
            startTime.day(firstRepeatingDay);
            endTime.day(firstRepeatingDay);
        }

        let dateISOString = date.toISOString().substring(0, ISO_TIME_START_INDEX);
        // Cut off the "Z"s for the time strings
        let startTimeISOString = startTime.toISOString().substr(ISO_TIME_START_INDEX, ISO_TIME_CHARS_TO_KEEP);
        let endTimeISOString = endTime.toISOString().substr(ISO_TIME_START_INDEX, ISO_TIME_CHARS_TO_KEEP); 
        return {
            startDateTime: dateISOString + startTimeISOString,
            endDateTime: dateISOString + endTimeISOString,
        };
    }

    generateRecurrence(): string[] {
        if (this.isCourse && !this.getIsRepeating()) { // Courses need a repeat set!
            throw new ValidationError(ValidationErrorReason.REPEAT_REQUIRED);
        }

        let stringDays = [];
        for (let i = 0; i < this.repeatingDays.length; i++) {
            if (this.repeatingDays[i]) {
                stringDays.push(RECURRANCE_DAY_STRINGS[i]);
            }
        }

        if (stringDays.length > 0) {
            const endRepeat = semester.endDate.format(RECURRANCE_END_FORMAT);
            return [`RRULE:FREQ=WEEKLY;UNTIL=${endRepeat};BYDAY=${stringDays.join(",")}`];
        } else {
            return [];
        }
    }
}

export default EventInputModel;
