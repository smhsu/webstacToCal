import { EventDateInput } from "src/eventLogic/EventDateInput";
import { EventTimeInput } from "src/eventLogic/EventTimeInput";
import { DESCRIPTION_FOR_TYPE, ICourseEventInputs, IFinalEventInputs, WebstacEventType } from "./IEventInputs";

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

const CaptureGroups = {
    Date: 1,
    StartTime: 3,
    EndTime: 4,
    CourseName: 5,
    Location: 6,
};

/**
 * Parses final exams.
 *
 * @author Silas Hsu
 */
export class WebstacExamParser {
    /**
     * Parses exams from WebSTAC.  Optionally takes an array of parsed courses which will be used to get locations for
     * exams that are in the same location as the class. Returns an empty array if no exams could be parsed.
     *
     * @param rawInput - class schedule copy-pasted from WebSTAC
     * @param courses - list of courses to match to exams for determining exam locations
     * @return array of parsed exams
     */
    static parseExams(rawInput: string, courses: ICourseEventInputs[]): IFinalEventInputs[] {
        const locationForCourseName: Record<string, string> = {};
        for (const course of courses) { // Initialize the mapping
            locationForCourseName[course.name] = course.location;
        }

        const events: IFinalEventInputs[] = [];
        let examMatch = EXAM_REGEX.exec(rawInput);
        while (examMatch !== null) {
            const courseName = examMatch[CaptureGroups.CourseName];
            let location = examMatch[CaptureGroups.Location];
            if (location === "Same / Same") { // Attempt to find the matching course's location
                location = locationForCourseName[courseName] || location;
            }

            events.push({
                type: WebstacEventType.Final,
                name: `${courseName} ${DESCRIPTION_FOR_TYPE[WebstacEventType.Final]}`,
                location,
                date: new EventDateInput(examMatch[CaptureGroups.Date]),
                startTime: new EventTimeInput(examMatch[CaptureGroups.StartTime]),
                endTime: new EventTimeInput(examMatch[CaptureGroups.EndTime])
            });
            examMatch = EXAM_REGEX.exec(rawInput);
        }

        return events;
    }
}
