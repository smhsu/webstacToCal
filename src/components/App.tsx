import "./App.css";
import CalendarApi from "../CalendarApi";
import EventTable from "./EventTable";
import AuthPanel from "./AuthPanel";
import ParsedEventModel from "../ParsedEventModel";
import CourseParser from "../CourseParser";
import ExamParser from "../ExamParser";
import * as React from "react";

const logo = require("../logo.svg");

const INPUT_BOX_PLACEHOLDER = "Go to WebSTAC >> Courses and Registration >> Class Schedule.\n" +
    "Then, SELECT ALL the text, including finals schedule, and copy and paste it into this box.";

interface AppState {
    calendarApi: CalendarApi | null;
    apiLoadError: string;
    isAuthError: boolean;
    authErrorMessage: string;

    inputSchedule: string;
    courses: ParsedEventModel[];
    exams: ParsedEventModel[];
}

class App extends React.Component<{}, AppState> {
    courseParser: CourseParser;
    examParser: ExamParser;

    constructor(props: {}) {
        super(props);
        this.state = {
            calendarApi: null,
            apiLoadError: "",
            isAuthError: false,
            authErrorMessage: "",

            inputSchedule: "",
            courses: [],
            exams: []
        };
        CalendarApi.getInstance()
            .then(api => this.setState({calendarApi: api}))
            .catch(error => this.setState({apiLoadError: error.toString()}));

        this.authStatusChanged = this.authStatusChanged.bind(this);
        this.parseSchedule = this.parseSchedule.bind(this);

        this.courseParser = new CourseParser();
        this.examParser = new ExamParser();
    }

    authStatusChanged(): void {
        this.setState({});
    }

    parseSchedule(event: React.ChangeEvent<HTMLTextAreaElement>) {
        let courses = this.courseParser.parseCourses(event.target.value);
        let exams = this.examParser.parseExams(event.target.value, courses);
        this.setState({
            courses: courses,
            exams: exams
        });
    }

    render() {
        let eventsParsedNotification = null;
        if (this.state.inputSchedule.length > 0) {
            let numEvents = this.state.courses.length + this.state.exams.length;
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
                <AuthPanel
                    calendarApi={this.state.calendarApi}
                    onAuthStatusChange={this.authStatusChanged}
                />
                : null
            }
            </div>
            <textarea
                placeholder={INPUT_BOX_PLACEHOLDER}
                onChange={this.parseSchedule}
            />
            {eventsParsedNotification}
            <EventTable
                calendarApi={this.state.calendarApi || undefined}
                courses={this.state.courses}
                exams={this.state.exams}
            />
        </div>
        );
    }
    
}

export default App;
