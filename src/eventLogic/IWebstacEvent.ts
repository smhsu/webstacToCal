import { DayOfWeek } from "./DayOfWeek";

/**
 * The type of event -- courses are recurring events, and exams are one-time events.
 *
 * I don't expect any more types of events to exist in the future, and thus if-then statements that check course or
 * exam are scattered throughout the codebase.  If more event types do come into existence (e.g. LegacyCourse,
 * NewCourse), then we might have to refactor to add some polymorphism to event objects to make sure the if-then logic
 * stays manageable.
 */
export enum WebstacEventType {
    Course,
    Exam
}

interface IWebstacBasicData {
    type: WebstacEventType;
    name: string;
    location: string;
    startTime: string;
    endTime: string;
}

export interface IWebstacCourseData extends IWebstacBasicData {
    type: WebstacEventType.Course;
    repeatingDays: Set<DayOfWeek>;
}

export interface IWebstacExamData extends IWebstacBasicData {
    type: WebstacEventType.Exam;
    date: string;
}

export type IWebstacEvent = IWebstacCourseData | IWebstacExamData;
