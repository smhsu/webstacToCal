import { WebstacEvent } from "./eventModel/WebstacEvent";

/*
A course looks like this.  Major fields are separated by tabs:
E81 CSE 515T 01	Bayesian Methods in Machine Learning	3.0	C	-T-R--- 2:30p-4:00p	Whitaker / 218	Garnett
*/
const COURSE_REGEX = /[A-Z]\d\d.+/g; // Match something that looks like department letter and course number
// Something that looks like "M-W---- 10:00a-11:30p"
const DAYS_AND_TIME_REGEX = /([\w-]+) (\d\d?:\d\d[ap])-(\d\d?:\d\d[ap])/;

const columnIndices = {
    MIN_EXPECTED: 5,
    NAME: 1,
    DAYS_AND_TIME: 4,
    LOCATION: 5
};

const daysAndTimeCaptureGroups = {
    DAYS: 1,
    START_TIME: 2,
    END_TIME: 3,
};

/**
 * Parses courses from WebSTAC.
 *
 * @author Silas Hsu
 */
export class CourseParser {
    /**
     * Parses courses from WebSTAC, returning them in an array of EventInputModel.  Returns an empty array if no courses
     * could be parsed.
     *
     * @param rawInput - class schedule copy-pasted from WebSTAC
     * @return array of parsed courses
     */
    static parseCourses(rawInput: string): WebstacEvent[] {
        const fuzzyCourseMatches = rawInput.match(COURSE_REGEX);
        if (!fuzzyCourseMatches) {
            return [];
        }

        const events = [];
        for (const fuzzyCourseMatch of fuzzyCourseMatches) {
            const columns = fuzzyCourseMatch.split("\t");
            if (columns.length < columnIndices.MIN_EXPECTED) {
                continue;
            }

            const daysAndTimeMatch = columns[columnIndices.DAYS_AND_TIME].match(DAYS_AND_TIME_REGEX) || [];
            events.push(new WebstacEvent({
                isCourse: true,
                name: columns[columnIndices.NAME].trim() || "",
                location: columns[columnIndices.LOCATION] || "",
                // Courses don't have dates on their own; their start and end dates are determined by the semester.
                date: "",
                startTime: daysAndTimeMatch[daysAndTimeCaptureGroups.START_TIME] || "",
                endTime: daysAndTimeMatch[daysAndTimeCaptureGroups.END_TIME] || "",
                repeatingDays: CourseParser.parseCourseDays(daysAndTimeMatch[daysAndTimeCaptureGroups.DAYS] || ""),
            }));
        }
        return events;
    }

    /**
     * Something that looks like "M-W----"
     * @param {string} rawInput a WebSTAC days-of-the-week string
     * @return {boolean[]}
     */
    private static parseCourseDays(rawInput: string): boolean[] {
        const daysArray = Array(WebstacEvent.NUM_DAYS_PER_WEEK).fill(false);
        if (rawInput.length === WebstacEvent.NUM_DAYS_PER_WEEK) {
            for (let i = 0; i < WebstacEvent.NUM_DAYS_PER_WEEK; i++) {
                // I'm not going to check if the letter is the right one for the position
                if (rawInput.charAt(i) !== "-") {
                    daysArray[i] = true;
                }
            }
        }
        return daysArray;
    }
}
