import { DateTime } from "luxon";

export const DATE_TIME_PARSER = {
    dateInputInstructions: "use exactly three letters for the month, for example Dec 9 2023",

    /**
     * Parses a date string from WebSTAC.  Example: "Dec 9 2023".  Note that parsing might fail, which returns an
     * invalid time object.
     *
     * @param dateStr date string from WebSTAC.
     * @return parsed date
     */
    parseDate(dateStr: string): DateTime {
        return DateTime.fromFormat(dateStr, "LLL d yyyy");
    },

    timeInputInstructions: "for example 9:00a",

    /**
     * Parses a time string from WebSTAC.  Examples include "10:30a" and "5:00PM".  Note that parsing might fail, which
     * returns an invalid time object.
     *
     * @param timeStr time string from WebSTAC.
     * @return parsed time
     */
    parseTime(timeStr: string): DateTime {
        timeStr = timeStr.toUpperCase();
        if (timeStr.endsWith("A") || timeStr.endsWith("P")) {
            timeStr += "M";
        }

        return DateTime.fromFormat(timeStr, "h:mma");
    }
};
