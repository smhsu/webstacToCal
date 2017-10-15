import * as React from "react";
import CalendarApi from "../CalendarApi";
import CourseParser from "../CourseParser";
import ExamParser from "../ExamParser";
import EventTable from "./EventTable";
import EventInputModel from "../EventInputModel";

import AuthPanel from "./AuthPanel";
import ScheduleInput from "./ScheduleInput";

import "./css/App.css";

interface AppState {
    calendarApi: CalendarApi | null;
    apiLoadError: string;
    rawInputSchedule: string;
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
            rawInputSchedule: "",
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
        this.setState({rawInputSchedule: event.target.value});
    }

    render() {
        const stepClassName = "App-step";
        const activeStepClassName = "App-step App-step-active";
        let activeStep;
        if (!this.state.calendarApi || !this.state.calendarApi.getIsSignedIn()) {
            activeStep = 1;
        } else if (this.parsedEvents.length === 0) {
            activeStep = 2;
        } else {
            activeStep = 3;
        }

        return (
        <div className="App">
            <div className={activeStep === 1 ? activeStepClassName : stepClassName}>
                <h3 className="App-heading">① Permission</h3>
                {
                this.state.calendarApi !== null ?
                    <AuthPanel
                        isSignedIn={this.state.calendarApi.getIsSignedIn()}
                        onSignInRequested={this.state.calendarApi.signIn}
                        onSignOutRequested={this.state.calendarApi.signOut}
                        onAuthChangeComplete={this.authStatusChanged}
                    />
                    : null
                }
            </div>
            <div className={activeStep === 2 ? activeStepClassName : stepClassName}>
                <h3 className="App-heading">② CopyPaste</h3>
                <ScheduleInput
                    value={this.state.rawInputSchedule}
                    onChange={this.inputScheduleChanged}
                    numEventsParsed={this.parsedEvents.length}
                />
            </div>
            <div className={activeStep === 3 ? activeStepClassName : stepClassName}>
                <h3 className="App-heading">③ Confirm</h3>
                <EventTable calendarApi={this.state.calendarApi || undefined} events={this.parsedEvents} />
            </div>
        </div>
        );
    }
}

export default App;
