import { CalendarApi } from "../CalendarAPI";
import EventTableRow from "./EventTableRow";
import ParsedEventModel from "../ParsedEventModel";
import * as React from "react";

interface EventTableProps {
    calendarApi?: CalendarApi;
    rawInput: string;
}

class EventTable extends React.Component<EventTableProps, {}> {
    render(): JSX.Element {
        let dummyEvent = new ParsedEventModel();
        dummyEvent.name = "my class";
        dummyEvent.repeatingDays[2] = true;
        dummyEvent.startTime = "asdf";
        dummyEvent.endTime = "asd2f";
        dummyEvent.location = "my location";
        return (
        <table className="table table-hover table-sm table-responsive">
            <thead>
                <tr>
                    <td>Class or final name</td>
                    <td>Days (MTWTFSS)</td>
                    <td>Time (start - end)</td>
                    <td>Location</td>
                    <td>Add to calendar</td>
                </tr>
            </thead>
            <tbody>
                <EventTableRow model={dummyEvent}/>
            </tbody>
        </table>
        );
    }
}

export default EventTable;
