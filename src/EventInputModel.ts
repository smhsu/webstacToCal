import * as moment from "moment";
import { semester } from "./Semester";
import { ValidationError, ValidationErrorReason } from "./ValidationError";

// All of these used directly or indirectly in generateEventObject()
const DATE_FORMATS = ["MMM D YYYY", "YYYY-MM-DD"];
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
const ISO_TIME_CHARS_TO_KEEP = 8; // Should keep everything except the "Z"

export enum EventInputButtonState {
    normal,
    loading,
    success,
    error,
}

/**
 * Stores all the information needed to render a event's information.  Also, contains methods for generating event
 * objects that CalendarApi understands and can post to a user's calendar.
 * 
 * @author Silas Hsu
 */
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

    /**
     * @return {boolean} whether this event is repeating, i.e. if at least one repeating day is selected
     */
    getIsRepeating(): boolean {
        return this.repeatingDays.some(day => day); // Identity function
    }

    /**
     * @return {boolean} whether it is appropriate to upload this event to the user's calendar
     */
    getIsReadyToAdd(): boolean {
        return this.buttonState === EventInputButtonState.normal || this.buttonState === EventInputButtonState.error;
    }

    /**
     * Gets this event's date as a parsed Moment object.  If this event is a student's course, statically uses the
     * semester's start date as this event's day, no matter the value of `this.date`.
     * 
     * This method takes into consideration repeating days, moving the event forward to the nearest day selected for
     * repeat.  For example, if the event's date is on a Monday, but it is also set to repeat on Wednesdays and Fridays,
     * the returned data will express that the event's date is Wednesday.
     * 
     * Note that the returned date may be invalid; use moment.js's isValid() method to check.
     * 
     * @return {moment.Moment} this event's date
     */
    getDate(): moment.Moment {
        let date = this.isCourse ? semester.startDate : moment(this.date, DATE_FORMATS, true);
        let firstRepeatingDay = this.repeatingDays.findIndex(day => day);
        if (firstRepeatingDay > -1) { // i.e. if the event is repeating
            // Do this modulo thing, because moment.js represents Monday with 1 (and Sunday with 0), but we represent
            // Monday with 0.
            firstRepeatingDay = (firstRepeatingDay + 1) % EventInputModel.DAYS_PER_WEEK;
            date.day(firstRepeatingDay);
        }
        return date;
    }

    /**
     * Generates a data blob that Google understands and can be posted to a user's calendar.  Dates and times require
     * parsing, and other restrictions exist, so this method potentially throws ValidationError.
     * 
     * @return {gapi.client.calendar.EventInput} object suitable for addition to Google calendar
     * @throws {ValidationError}
     */
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

    /**
     * Converts this event's date, start time, and end time into a format that Google understands.  If parsing fails or
     * end time is before start time, throws ValidationError.
     * 
     * @return {object} startEndTimes - parsed data
     * @return {string} startDateTime - start date and time of the event
     * @return {string} endDateTime - end date and time of the event
     * @throws {ValidationError}
     */
    protected generateStartEndTimes() {
        const date = this.getDate();
        if (!date.isValid()) {
            throw new ValidationError(ValidationErrorReason.DATE);
        }
        const startTime = moment.utc(this.startTime, TIME_FORMAT, true);
        const endTime = moment.utc(this.endTime, TIME_FORMAT, true);
        if (!startTime.isValid() || !endTime.isValid()) {
            throw new ValidationError(ValidationErrorReason.TIME);
        }
        if (endTime.isBefore(startTime)) {
            throw new ValidationError(ValidationErrorReason.END_BEFORE_START);
        }

        const dateISOString = date.toISOString().substring(0, ISO_TIME_START_INDEX);
        const startTimeISOString = startTime.toISOString().substr(ISO_TIME_START_INDEX, ISO_TIME_CHARS_TO_KEEP);
        const endTimeISOString = endTime.toISOString().substr(ISO_TIME_START_INDEX, ISO_TIME_CHARS_TO_KEEP); 
        return {
            startDateTime: dateISOString + startTimeISOString,
            endDateTime: dateISOString + endTimeISOString,
        };
    }

    /**
     * Converts this event's repeating days into a format Google understands.  Statically uses the semester's end date
     * as the end of the repeat.  Throws ValidationError if this event is a course but not repeating.
     * 
     * @return {string[]} an array of string containing the event's repeating days.
     * @throws {ValidationError} if this event is a course but not repeating.
     */
    protected generateRecurrence(): string[] {
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
