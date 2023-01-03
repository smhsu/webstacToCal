import { DayOfWeek } from "./DayOfWeek";

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
    isSelected: boolean;
    uploadedUrl: string;
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
