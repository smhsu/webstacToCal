import { DateTime } from "luxon";

export interface ICalendarEvent {
    name: string;
    location: string;
    startDateTime: DateTime;
    endDateTime: DateTime;
    repeatingDays: boolean[];
    recurrenceEnd?: DateTime;
}
