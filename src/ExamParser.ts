import EventInputModel from "./EventInputModel";

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
    NAME: 5,
    LOCATION: 6,
};

/**
 * Parses final exams.
 * 
 * @author Silas Hsu
 */
class ExamParser {
    /**
     * Parses exams from WebSTAC, returning them in an array of EventInputModel.  Optionally takes an array of parsed
     * courses which will be used to get locations for exams that are in the same location as the class. Returns an
     * empty array if no exams could be parsed.
     * 
     * @param {string} rawInput - class schedule copy-pasted from WebSTAC
     * @param {EventInputModel[]} [parsedCourses] - clues for determining exam locations
     * @return {EventInputModel[]} array of parsed exams
     */
    parseExams(rawInput: string, parsedCourses: EventInputModel[] = []): EventInputModel[] {
        let courseToLocationMap = parsedCourses.reduce((map, course) => {
            map[course.name] = course.location;
            return map;
        }, {} as {[courseName: string]: string});

        let eventModels = [];
        let examMatch = EXAM_REGEX.exec(rawInput);
        while (examMatch !== null) {
            let eventModel = new EventInputModel();
            eventModel.isCourse = false;

            let courseName = examMatch[captureGroups.NAME];
            eventModel.name = courseName + " Final";

            let rawLocation = examMatch[captureGroups.LOCATION];
            if (rawLocation === "Same / Same") {
                eventModel.location = courseToLocationMap[courseName] || rawLocation;
            } else {
                eventModel.location = rawLocation;
            }
            
            eventModel.date = examMatch[captureGroups.DATE];
            eventModel.startTime = examMatch[captureGroups.START_TIME];
            eventModel.endTime = examMatch[captureGroups.END_TIME];
            
            eventModels.push(eventModel);
            examMatch = EXAM_REGEX.exec(rawInput);
        }

        return eventModels;
    }
}

export default ExamParser;
