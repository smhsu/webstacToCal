import { min } from "lodash";
import { DateTime } from "luxon";

import { CalendarApi } from "src/google/CalendarApi";
import { DayOfWeek } from "./DayOfWeek";
import { ISemester } from "./ISemester";
import { IWebstacEventData, WebstacEventType } from "./IWebstacEvent";

// Example of an ISO 8601 date: 2017-10-09T02:33:50Z
const ISO_TIME_START_INDEX = 11;
const ISO_TIME_CHARS_TO_KEEP = 8; // Should keep everything except the "Z"
const RECURRENCE_END_FORMAT = "yyyyMMdd";
/**
 * Mapping from day of week to values in RFC 5545 (https://www.rfc-editor.org/rfc/rfc5545) -- search for "BYDAY" in
 * the document.  Suitable for constructing recurrence rules that conform to Google Calendar API and the iCalendar file
 * format.
 */
const RECURRENCE_VALUE_FOR_DAY: Readonly<Record<DayOfWeek, string>> = {
    [DayOfWeek.Monday]: "MO",
    [DayOfWeek.Tuesday]: "TU",
    [DayOfWeek.Wednesday]: "WE",
    [DayOfWeek.Thursday]: "TH",
    [DayOfWeek.Friday]: "FR",
    [DayOfWeek.Saturday]: "SA",
    [DayOfWeek.Sunday]: "SU",
};
const TIME_ZONE = "America/Chicago";
const DESCRIPTION = "Created by WebSTAC to Calendar";
const REMINDERS = {
    overrides: [],
    useDefault: false
};

export class GoogleEventExporter {
    exportOne(event: IWebstacEventData, calendarId: string, semester: ISemester): Promise<string> {
        const { start, end } = this._generateStartEndAsISO(event, semester);
        return CalendarApi.getInstance().createEvent(calendarId, {
            summary: event.name,
            location: event.location,
            start: {
                dateTime: start,
                timeZone: TIME_ZONE
            },
            end: {
                dateTime: end,
                timeZone: TIME_ZONE
            },
            recurrence: this._generateRecurrence(event, semester),
            description: DESCRIPTION,
            reminders: REMINDERS
        });
    }

    private _generateStartEndAsISO(event: IWebstacEventData, semester: ISemester) {
        const startTime = event.startTime.parsed;
        const endTime = event.endTime.parsed;
        const startDate = this._getStartDate(event, semester);
        return {
            start: this._generateIsoString(startDate, startTime),
            end: this._generateIsoString(startDate, endTime)
        };
    }

    private _generateIsoString(date: DateTime, time: DateTime) {
        return date.toISO().substring(0, ISO_TIME_START_INDEX) +
            time.toISO().substring(ISO_TIME_START_INDEX, ISO_TIME_START_INDEX + ISO_TIME_CHARS_TO_KEEP);
    }

    /**
     * Gets the event's start date as a DateTime object.  For a course, returns the first day the course will happen
     * during the input semester.  Otherwise, parses and uses the event's innate date.
     *
     * @param event
     * @param semester
     * @private
     */
    private _getStartDate(event: IWebstacEventData, semester: ISemester): DateTime {
        if (event.type === WebstacEventType.Course) {
            return semester.firstDayOfClasses.plus({
                // The event might not happen on the first day of classes.  Advance time to find the first day.
                days: this._daysUntilNearestDayOfWeek(semester.firstDayOfClasses.weekday, event.repeatingDays)
            });
        } else {
            return event.date.parsed;
        }
    }

    /**
     * Given a day of the week stored in a DateTime object, finds the least number of days it takes to advance to any of
     * the days in the query set `weekdays`.  Returns 0 if the query set is empty.
     *
     * Examples:
     *    startDay = Monday, weekDays = { Monday, Wednesday } --> returns 0
     *    startDay = Tuesday, weekDays = { Wednesday, Friday } --> returns 1
     *    startDay = Friday, weekdays = { Monday, Wednesday } --> returns 3
     *    startDay = Sunday, weekdays = {} --> returns 0
     *
     * @param startDay day of the week from which to start counting forward
     * @param weekdays set of days on which to stop counting
     * @return the minimum number of days between `startDay` and any of the elements in `weekdays`
     */
    private _daysUntilNearestDayOfWeek(startDay: DayOfWeek, weekdays: Set<DayOfWeek>): number {
        const minDuration = min(Array.from(weekdays).map((day) => {
            let dayDiff = day - startDay;
            if (dayDiff < 0) { // Looks like the day happens before our target day.  Got to wait until next week!
                dayDiff += 7;
            }
            return dayDiff;
        }));
        return minDuration || 0;
    }

    /**
     * Converts the event's repeating days into a recurrence rule that Google understands.
     *
     * @param event
     * @param semester
     * @return list of recurrence rules
     */
    private _generateRecurrence(event: IWebstacEventData, semester: ISemester): string[] {
        if (event.type !== WebstacEventType.Course) {
            return [];
        }

        const stringDays = Array.from(event.repeatingDays).map(day => RECURRENCE_VALUE_FOR_DAY[day]);
        if (stringDays.length > 0) {
            const endRepeat = semester.lastDayOfClasses.plus({ days: 1 }).toFormat(RECURRENCE_END_FORMAT);
            return [`RRULE:FREQ=WEEKLY;UNTIL=${endRepeat};BYDAY=${stringDays.join(",")}`];
        } else {
            return [];
        }
    }
}
