import * as moment from "moment";

export interface Semester {
    name: string;

    /**
     * Format as YYYYMMDD.
     */
    startDate: moment.Moment;

    /**
     * Format as YYYYMMDD.  This will be used in the calendar request's recurrance field.  No user enters this, so we
     * can use a Moment object directly.  It should be set to the day AFTER classes end.
     */
    endDate: moment.Moment; 
}

export const semester: Semester = {
    name: "FL17",
    startDate: moment("2017-08-28", "YYYY-MM-DD", true),
    endDate: moment("2017-12-09", "YYYY-MM-DD", true),
};

if (!semester.startDate.isValid() || !semester.endDate.isValid() || semester.endDate.isBefore(semester.startDate)) {
    throw new Error("Semester dates are invalid");
}

export default semester;
