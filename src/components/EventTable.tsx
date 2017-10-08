import { CalendarApi } from "../CalendarApi";
import EventTableOptions from "./EventTableOptions";
import EventTableRow from "./EventTableRow";
import ParsedEventModel from "../ParsedEventModel";
import { Semester } from "../semesters";
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
    selectedSemester: Semester | null;
    selectedCalendar: gapi.client.calendar.CalendarListEntry | null;
}

class EventTable extends React.Component<EventTableProps, EventTableState> {
    constructor(props: EventTableProps) {
        super(props);
        this.state = {
            courses: props.courses,
            exams: props.exams,
            selectedSemester: null,
            selectedCalendar: null
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
        <div>
            <EventTableOptions
                calendarApi={this.props.calendarApi}
                selectedSemester={this.state.selectedSemester}
                selectedCalendar={this.state.selectedCalendar}
                onCalendarSelected={calendar => this.setState({selectedCalendar: calendar})}
                onSemesterSelected={semester => this.setState({selectedSemester: semester})}
            />
            <p>
            {
                this.state.courses.length + this.state.exams.length > 0 ? 
                    <button className="btn btn-primary" onClick={undefined}>Add all to calendar</button> :
                    <button className="btn btn-primary" disabled={true}>Nothing detected</button>
            }
            </p>
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
                    {
                    this.state.exams.map((course, index) =>
                        <EventTableRow key={index} model={course} isExam={true} />
                    )
                    }
                </tbody>
            </table>
        </div>
        );
    }
}

export default EventTable;
