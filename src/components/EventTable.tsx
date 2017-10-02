import { CalendarApi } from "../CalendarAPI";
import EventTableRow from "./EventTableRow";
import ParsedEventModel from "../ParsedEventModel";
import * as React from "react";

interface EventTableProps {
    courses: ParsedEventModel[];
    exams: ParsedEventModel[];
    calendarApi?: CalendarApi;
    rawInput?: string;
}

interface EventTableState {
    courses: ParsedEventModel[];
    exams: ParsedEventModel[];
}

class EventTable extends React.Component<EventTableProps, EventTableState> {
    constructor(props: EventTableProps) {
        super(props);
        this.state = {
            courses: props.courses,
            exams: props.exams
        };
    }

    componentWillReceiveProps(nextProps: EventTableProps) {
        if (this.props.courses !== nextProps.courses || this.props.exams !== nextProps.exams) {
            this.setState({
                courses: nextProps.courses,
                exams: nextProps.exams
            });
        }
    }

    render(): JSX.Element {
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
                {this.state.courses.map((course, index) => <EventTableRow key={index} model={course} />)}
                {this.state.exams.map((course, index) => <EventTableRow key={index} model={course} isExam={true} />)}
            </tbody>
        </table>
        );
    }
}

export default EventTable;
