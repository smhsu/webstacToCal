import { WebstacEvent } from "./eventModel/WebstacEvent";

/*
An exam looks like this; it takes up two lines:

May 5 2017 6:00PM - 8:00PM	E81 CSE 431S 01	Translation of Computer Languages
Exam Building / Room:	Same / Same
*/

// I'm only putting months in which I expect finals
const DATE_TIME_REGEX = /((Apr|May|Jun|Jul|Aug|Dec) \d\d? \d\d\d\d) (\d\d?:\d\d[AP]M) - (\d\d?:\d\d[AP]M)\t/;
const NAME_REGEX = /.+\t(.+)/; // Strings separated by a tab
const NEWLINE_REGEX = /\n(?:\t\n)?/; // Special since Firefox pastes things differently
const LOCATION_REGEX = /Exam Building \/ Room:\t(.+)/;
const EXAM_REGEX = new RegExp(
    DATE_TIME_REGEX.source + NAME_REGEX.source + NEWLINE_REGEX.source + LOCATION_REGEX.source,
    "g"
);

const captureGroups = {
    DATE: 1,
    START_TIME: 3,
    END_TIME: 4,
    COURSE_NAME: 5,
    LOCATION: 6,
};

/**
 * Parses final exams.
 *
 * @author Silas Hsu
 */
export class ExamParser {
    /**
     * Parses exams from WebSTAC, returning them in an array of EventInputModel.  Optionally takes an array of parsed
     * courses which will be used to get locations for exams that are in the same location as the class. Returns an
     * empty array if no exams could be parsed.
     *
     * @param rawInput - class schedule copy-pasted from WebSTAC
     * @param courses - list of courses to match to exams for determining exam locations
     * @return array of parsed exams
     */
    static parseExams(rawInput: string, courses: WebstacEvent[] = []): WebstacEvent[] {
        const locationForCourseName: Record<string, string> = {};
        for (const course of courses) {
            locationForCourseName[course.name] = course.location;
        }

        let events = [];
        let examMatch = EXAM_REGEX.exec(rawInput);
        while (examMatch !== null) {
            const courseName = examMatch[captureGroups.COURSE_NAME];
            let location = examMatch[captureGroups.LOCATION];
            if (location === "Same / Same") { // Attempt to find the matching course's location
                location = locationForCourseName[courseName] || location;
            }

            events.push(new WebstacEvent({
                isCourse: false,
                name: courseName + " Final",
                location,
                date: examMatch[captureGroups.DATE],
                startTime: examMatch[captureGroups.START_TIME],
                endTime: examMatch[captureGroups.END_TIME],
                repeatingDays: []
            }));
            examMatch = EXAM_REGEX.exec(rawInput);
        }

        return events;
    }
}
