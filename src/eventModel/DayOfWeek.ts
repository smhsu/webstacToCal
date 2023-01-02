/**
 * One of the seven days of the week.  The enum values correspond to the values in
 * RFC 5545 (https://www.rfc-editor.org/rfc/rfc5545) -- search for "BYDAY" in the document.  This makes enum values
 * suitable for constructing recurrence rules that conform to Google Calendar API and the iCalendar file format.
 *
 * For the purposes of iterating through this enum, the first day of the week of this implementation shall be Monday.
 */
export enum DayOfWeek {
    Monday = "MO",
    Tuesday = "TU",
    Wednesday = "WE",
    Thursday = "TH",
    Friday = "FR",
    Saturday = "SA",
    Sunday = "SU"
}

export const FullNameForDay: Record<DayOfWeek, string> = {
    [DayOfWeek.Monday]: "Monday",
    [DayOfWeek.Tuesday]: "Tuesday",
    [DayOfWeek.Wednesday]: "Wednesday",
    [DayOfWeek.Thursday]: "Thursday",
    [DayOfWeek.Friday]: "Friday",
    [DayOfWeek.Saturday]: "Saturday",
    [DayOfWeek.Sunday]: "Sunday",
};
