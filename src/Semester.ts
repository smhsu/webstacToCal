import moment from "moment";

export interface Semester {
    name: string;

    /**
     * Start date of the semester; i.e. the first day of classes
     */
    startDate: moment.Moment;

    /**
     * This will be used in the calendar request's recurrance field.  It should be set to the day AFTER classes end.
     */
    endDate: moment.Moment; 
}

export const semester: Semester = {
    name: "SP21",
    startDate: moment("2021-01-25", "YYYY-MM-DD", true),
    endDate: moment("2021-05-05", "YYYY-MM-DD", true),
};

if (!semester.startDate.isValid() || !semester.endDate.isValid() || semester.endDate.isBefore(semester.startDate)) {
    throw new Error("Semester dates are invalid");
}

export default semester;
