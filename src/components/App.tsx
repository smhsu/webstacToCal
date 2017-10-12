import * as React from "react";
import CourseParser from "../CourseParser";
import ExamParser from "../ExamParser";
import EventTable from "./EventTable";
import EventInputModel from "../EventInputModel";

import AuthPanel from "./AuthPanel";
import CalendarApi from "../CalendarApi";

import "./App.css";

const logo = require("../logo.svg");

const INPUT_BOX_PLACEHOLDER = "Go to WebSTAC >> Courses and Registration >> Class Schedule.\n" +
    "Then, SELECT ALL the text, including finals schedule, and copy and paste it into this box.";

interface AppState {
    calendarApi: CalendarApi | null;
    apiLoadError: string;
    isAuthError: boolean;
    authErrorMessage: string;
    inputSchedule: string;
}

class App extends React.Component<{}, AppState> {
    courseParser: CourseParser;
    examParser: ExamParser;
    parsedEvents: EventInputModel[];

    constructor(props: {}) {
        super(props);
        this.state = {
            calendarApi: null,
            apiLoadError: "",
            isAuthError: false,
            authErrorMessage: "",
            inputSchedule: "",
        };
        this.courseParser = new CourseParser();
        this.examParser = new ExamParser();
        this.parsedEvents = [];

        CalendarApi.getInstance()
            .then(api => this.setState({calendarApi: api}))
            .catch(error => this.setState({apiLoadError: error.toString()}));

        this.authStatusChanged = this.authStatusChanged.bind(this);
        this.inputScheduleChanged = this.inputScheduleChanged.bind(this);
    }

    authStatusChanged(): void {
        this.setState({});
    }

    inputScheduleChanged(event: React.ChangeEvent<HTMLTextAreaElement>) {
        let parsedCourses = this.courseParser.parseCourses(event.target.value);
        let parsedExams = this.examParser.parseExams(event.target.value, parsedCourses);
        this.parsedEvents = parsedCourses.concat(parsedExams);
        this.setState({inputSchedule: event.target.value});
    }

    render() {
        let eventsParsedNotification = null;
        if (this.state.inputSchedule.length > 0) {
            let numEvents = this.parsedEvents.length;
            eventsParsedNotification = <p>{`${numEvents} events parsed.`}</p>;
        }

        return (
        <div className="App">
            <div className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h2>Welcome to React</h2>
            </div>
            <p className="App-intro">
                To get started, edit <code>src/App.tsx</code> and save to reload.
            </p>

            <div>
            {
                this.state.calendarApi !== null ?
                    <AuthPanel calendarApi={this.state.calendarApi} onAuthStatusChange={this.authStatusChanged} />
                    : null
            }
            </div>
            <textarea
                placeholder={INPUT_BOX_PLACEHOLDER}
                value={this.state.inputSchedule}
                onChange={this.inputScheduleChanged}
            />
            {eventsParsedNotification}
            <EventTable calendarApi={this.state.calendarApi || undefined} events={this.parsedEvents} />
        </div>
        );
    }
    
}

export default App;
