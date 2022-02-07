import { DateTime } from "luxon";
import { ICalendarEvent } from "./ICalendarEvent";
import { ISemester } from "./ISemester";

interface IWebstacEventData {
    isCourse: boolean;
    name: string;
    location: string;
    date: string;
    startTime: string;
    endTime: string;
    repeatingDays: boolean[];
}

export class WebstacEvent implements IWebstacEventData {
    static NUM_DAYS_PER_WEEK = 7;

    readonly isCourse: boolean;
    readonly name: string;
    readonly location: string;
    readonly date: string;
    readonly startTime: string;
    readonly endTime: string;
    readonly repeatingDays: boolean[];

    constructor(props: IWebstacEventData) {
        this.isCourse = props.isCourse;
        this.name = props.name;
        this.location = props.location;
        this.date = props.date;
        this.startTime = props.startTime;
        this.endTime = props.endTime;
        this.repeatingDays = props.repeatingDays;
    }

    clone(): WebstacEvent {
        return new WebstacEvent(this);
    }

    validate() {

    }

    toCalendarEvent(semester: ISemester): ICalendarEvent {
        return {
            location: "",
            name: "",
            startDateTime: DateTime.now(),
            endDateTime: DateTime.now(),
            repeatingDays: [],
            recurrenceEnd: undefined
        };
    }
}
