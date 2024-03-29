import { EventTimeInput } from "src/eventLogic/EventTimeInput";
import { ALL_DAYS, DayOfWeek } from "./DayOfWeek";
import { ICourseEventInputs, WebstacEventType } from "./IEventInputs";

/*
A course looks like this.  Major fields are separated by tabs:
E81 CSE 515T 01	Bayesian Methods in Machine Learning	3.0	C	-T-R--- 2:30p-4:00p	Whitaker / 218	Garnett
*/
const COURSE_REGEX = /[A-Z]\d\d.+/g; // Match something that looks like department letter and course number
// Something that looks like "M-W---- 10:00a-11:30p"
const DAYS_AND_TIME_REGEX = /([\w-]+) (\d\d?:\d\d[ap])-(\d\d?:\d\d[ap])/;

const ColumnIndex = {
    MinExpected: 5,
    Name: 1,
    DaysAndTime: 4,
    Location: 5
};

const DaysAndTimeCaptureGroups = {
    Days: 1,
    StartTime: 2,
    EndTime: 3,
};

/**
 * Parses courses from WebSTAC.
 *
 * @author Silas Hsu
 */
export class WebstacCourseParser {
    /**
     * Parses courses from WebSTAC, returning them in an array of EventInputModel.  Returns an empty array if no courses
     * could be parsed.
     *
     * @param rawInput - class schedule copy-pasted from WebSTAC
     * @return array of parsed courses
     */
    static parseCourses(rawInput: string): ICourseEventInputs[] {
        const fuzzyCourseMatches = rawInput.match(COURSE_REGEX);
        if (!fuzzyCourseMatches) {
            return [];
        }

        const events: ICourseEventInputs[] = [];
        for (const fuzzyCourseMatch of fuzzyCourseMatches) {
            const columns = fuzzyCourseMatch.split("\t");
            if (columns.length < ColumnIndex.MinExpected) {
                continue;
            }

            const daysAndTimeMatch = columns[ColumnIndex.DaysAndTime].match(DAYS_AND_TIME_REGEX) || [];
            events.push({
                type: WebstacEventType.Course,
                name: columns[ColumnIndex.Name].trim() || "",
                location: columns[ColumnIndex.Location] || "",
                startTime: new EventTimeInput(daysAndTimeMatch[DaysAndTimeCaptureGroups.StartTime] || ""),
                endTime: new EventTimeInput(daysAndTimeMatch[DaysAndTimeCaptureGroups.EndTime] || ""),
                repeatingDays: WebstacCourseParser.parseCourseDays(
                    daysAndTimeMatch[DaysAndTimeCaptureGroups.Days] || ""
                )
            });
        }
        return events;
    }

    /**
     * Parse something that looks like "M-W----"
     *
     * @param rawInput a days-of-the-week string
     * @return list of days that the string represents
     */
    private static parseCourseDays(rawInput: string): Set<DayOfWeek> {
        const days: Set<DayOfWeek> = new Set();
        if (rawInput.length === ALL_DAYS.length) {
            for (let i = 0; i < ALL_DAYS.length; i++) {
                // I'm not going to check if the letter is the right one for the position
                if (rawInput.charAt(i) !== "-") {
                    days.add(ALL_DAYS[i]);
                }
            }
        }
        return days;
    }
}
