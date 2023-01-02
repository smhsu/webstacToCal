import { DateTime } from "luxon";

export class WebstacDateTimeParser {
    /**
     * Parses a date string from WebSTAC.  Example: "Dec 9 2023".  Note that parsing might fail, which returns an
     * invalid time object.
     *
     * @param webstacDate date string from WebSTAC.
     * @return parsed date
     */
    static parseDate(webstacDate: string): DateTime {
        return DateTime.fromFormat(webstacDate, "LLL d y");
    }

    /**
     * Parses a time string from WebSTAC.  Examples include "10:30a" and "5:00PM".  Note that parsing might fail, which
     * returns an invalid time object.
     *
     * @param webstacTime time string from WebSTAC.
     * @return parsed time
     */
    static parseTime(webstacTime: string): DateTime {
        webstacTime = webstacTime.toUpperCase();
        if (webstacTime.endsWith("A") || webstacTime.endsWith("P")) {
            webstacTime += "M";
        }

        return DateTime.fromFormat(webstacTime, "h:mma");
    }
}
