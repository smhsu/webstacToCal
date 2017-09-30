import ParsedEventModel from "./ParsedEventModel";

const columnIndices = {
    MIN_REQUIRED: 5,
    NAME: 1,
    DAYS_AND_TIME: 4,
    LOCATION: 5
};

const COURSE_REGEX = /[A-Z]\d\d.+/g;
const DAYS_PER_WEEK = ParsedEventModel.DAYS_PER_WEEK;

class CourseParser {
    parseCourses(rawInput: string): ParsedEventModel[] {
        // Match things that look like a course ID, along with the rest of the line.
        let fuzzyCourseMatches = rawInput.match(COURSE_REGEX);
        if (!fuzzyCourseMatches) {
            return [];
        }

        let eventModels = [];
        for (let fuzzyCourseMatch of fuzzyCourseMatches) {
            let columns = fuzzyCourseMatch.split("\t");
            if (columns.length < columnIndices.MIN_REQUIRED) {
                continue;
            }

            // Something that looks like "M-W---- 10:00a-11:30p"
            let daysAndTime = columns[columnIndices.DAYS_AND_TIME].split(" ");
            let days = daysAndTime[0] || ""; // "M-W----"
            let times = daysAndTime[1] || "-"; // "10:00a-11:30p"

            let splitTimes = times.split("-"); // In case there were no times, "-".split("-") will result in ["", ""].
            let startTime = splitTimes[0]; // "10:00a"
            let endTime = splitTimes[1] || ""; // "11:30p"

            let eventModel = new ParsedEventModel();
            eventModel.name = columns[columnIndices.NAME];
            // Unlike the other columns, location is not guaranteed to exist, which is why we "||" it.
            eventModel.location = columns[columnIndices.LOCATION] || "";
            eventModel.repeatingDays = this.parseCourseDays(days);
            eventModel.startTime = startTime;
            eventModel.endTime = endTime;
            
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
