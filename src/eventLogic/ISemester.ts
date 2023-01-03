import { DateTime } from "luxon";

export interface ISemester {
    name: string;
    firstDayOfClasses: DateTime;
    lastDayOfClasses: DateTime;
}
