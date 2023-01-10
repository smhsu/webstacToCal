import { DayOfWeek } from "./DayOfWeek";
import { WebstacDate } from "./WebstacDate";
import { WebstacTime } from "./WebstacTime";

/**
 * The type of event -- courses are recurring events, and exams are one-time events.
 *
 * I don't expect any more types of events to exist in the future, and thus if-then statements that check course or
 * exam are scattered throughout the codebase.  If more event types do come into existence (e.g. LegacyCourse,
 * NewCourse), then we might have to refactor to add some polymorphism to event objects to make sure the if-then logic
 * stays manageable.
 */
export enum WebstacEventType {
    /**
     * Could be named Class but isn't to avoid confusion with JS classes.
     */
    Course,
    Final
}

export const DESCRIPTION_FOR_TYPE: Record<WebstacEventType, string> = {
    [WebstacEventType.Course]: "Class",
    [WebstacEventType.Final]: "Final"
};

interface IWebstacBasicData {
    type: WebstacEventType;
    name: string;
    location: string;
    startTime: WebstacTime;
    endTime: WebstacTime;
}

export interface IWebstacCourseData extends IWebstacBasicData {
    type: WebstacEventType.Course;
    repeatingDays: Set<DayOfWeek>;
}

export interface IWebstacFinalData extends IWebstacBasicData {
    type: WebstacEventType.Final;
    date: WebstacDate;
}

export type IWebstacEventData = IWebstacCourseData | IWebstacFinalData;
