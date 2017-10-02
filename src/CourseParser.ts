import ParsedEventModel from "./ParsedEventModel";

/*
A course looks like this:
E81 CSE 515T 01	Bayesian Methods in Machine Learning	3.0	C	-T-R--- 2:30p-4:00p	Whitaker / 218	Garnett
*/
const COURSE_REGEX = /[A-Z]\d\d.+/g; // Match something that looks like department letter and course number
// Something that looks like "M-W---- 10:00a-11:30p"
const DAYS_AND_TIME_REGEX = /([\w-]+) (\d\d?:\d\d[ap])-(\d\d?:\d\d[ap])/;
const DAYS_PER_WEEK = ParsedEventModel.DAYS_PER_WEEK;

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
class CourseParser {
    /**
     * Parses courses from WebSTAC, returning them in an array of ParsedEventModel.  Returns an empty array if no
     * courses could be parsed.
     * 
     * @param {string} rawInput - class schedule copy-pasted from WebSTAC
     * @return {ParsedEventModel[]} array of parsed courses
     */
    parseCourses(rawInput: string): ParsedEventModel[] {
        let fuzzyCourseMatches = rawInput.match(COURSE_REGEX);
        if (!fuzzyCourseMatches) {
            return [];
        }

        let eventModels = [];
        for (let fuzzyCourseMatch of fuzzyCourseMatches) {
            let columns = fuzzyCourseMatch.split("\t");
            if (columns.length < columnIndices.MIN_EXPECTED) {
                continue;
            }

            let daysAndTimeMatch = columns[columnIndices.DAYS_AND_TIME].match(DAYS_AND_TIME_REGEX) || [];

            let eventModel = new ParsedEventModel();
            eventModel.name = columns[columnIndices.NAME].trim() || "";
            eventModel.location = columns[columnIndices.LOCATION] || "";
            eventModel.repeatingDays = this.parseCourseDays(daysAndTimeMatch[daysAndTimeCaptureGroups.DAYS] || "");
            eventModel.startTime = daysAndTimeMatch[daysAndTimeCaptureGroups.START_TIME] || "";
            eventModel.endTime = daysAndTimeMatch[daysAndTimeCaptureGroups.END_TIME] || "";
            
            eventModels.push(eventModel);
        }
        return eventModels;
    }

    /**
     * Something that looks like "M-W----"
     * @param {string} rawInput a WebSTAC days-of-the-week string
     * @return {boolean[]}
     */
    private parseCourseDays(rawInput: string): boolean[] {
        let daysArray = Array(DAYS_PER_WEEK).fill(false);
        if (rawInput.length === DAYS_PER_WEEK) {
            for (let i = 0; i < DAYS_PER_WEEK; i++) {
                // I'm not going to check if the letter is the right one for the position, since I'm not sure what
                // WebSTAC uses for Saturday and Sunday.
                if (rawInput.charAt(i) !== "-") { 
                    daysArray[i] = true;
                }
            }
        }
        return daysArray;
    }
}

export default CourseParser;
