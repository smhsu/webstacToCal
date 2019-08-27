import * as React from "react";

import AuthPanel from "./AuthPanel";
import ScheduleInput from "./ScheduleInput";

import Analytics from "../Analytics";
import CalendarApi from "../CalendarApi";
import CourseParser from "../CourseParser";
import ExamParser from "../ExamParser";
import EventTable from "./EventTable";
import EventInputModel from "../EventInputModel";

import "./css/App.css";

interface AppState {
    calendarApi: CalendarApi | null;
    isApiLoadError: boolean;
    rawInputSchedule: string;
}

/**
 * The root component of everything dynamic in WebSTAC to Calendar.  Loads calendar API, parses user input, and keeps
 * track of what step the user is on. 
 * 
 * @author Silas Hsu
 */
class App extends React.Component<{}, AppState> {
    analytics: Analytics;
    courseParser: CourseParser;
    examParser: ExamParser;
    parsedEvents: EventInputModel[];

    /**
     * Not only initializes state and binds methods, but also initializes the calendar API.
     * 
     * @param {object} props - empty
     */
    constructor(props: {}) {
        super(props);
        this.state = {
            calendarApi: null,
            isApiLoadError: false,
            rawInputSchedule: "",
        };
        this.analytics = new Analytics();
        this.courseParser = new CourseParser();
        this.examParser = new ExamParser();
        this.parsedEvents = [];

        CalendarApi.getInstance()
            .then(api => this.setState({calendarApi: api}))
            .catch(error => {
                window.console.error(error);
                this.setState({isApiLoadError: true});
            });

        this.authStatusChanged = this.authStatusChanged.bind(this);
        this.inputScheduleChanged = this.inputScheduleChanged.bind(this);
    }

    /**
     * Sends a page view event to Analytics.
     */
    componentDidMount(): void {
        this.analytics.sendPageView("/");
    }

    /**
     * Triggers a rerender.
     */
    authStatusChanged(): void {
        this.setState({});
    }

    /**
     * Parses the new schedule and sets state.
     * 
     * @param {React.ChangeEvent<HTMLTextAreaElement>} event - the event trigged by the user input changing
     */
    inputScheduleChanged(event: React.ChangeEvent<HTMLTextAreaElement>): void {
        let parsedCourses = this.courseParser.parseCourses(event.target.value);
        let parsedExams = this.examParser.parseExams(event.target.value, parsedCourses);
        this.parsedEvents = parsedCourses.concat(parsedExams);
        if (this.parsedEvents.length > 0) {
            this.analytics.sendEvent({
                category: "Schedule Parse",
                action: "Success",
            });
            this.analytics.sendEvent({
                category: "Schedule Parse",
                action: "Courses parsed",
                value: parsedCourses.length
            });
            this.analytics.sendEvent({
                category: "Schedule Parse",
                action: "Exams parsed",
                value: parsedExams.length
            });
        } else {
            this.analytics.sendEvent({
                category: "Schedule Parse",
                action: "Failure",
            });
        }
        this.setState({rawInputSchedule: event.target.value});
    }

    /**
     * @return {JSX.Element} the component to render
     */
    render(): JSX.Element {
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

        let authPanel = null;
        if (this.state.isApiLoadError) {
            authPanel = (
            <div className="alert alert-danger App-api-load-failed">
                <h4>Failed to load Calendar API.</h4>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                Try <a href="">reloading the page</a>.  If that doesn't work, either Google is down (very bad), or there
                is a serious bug within this app (also very bad).
            </div>
            );
        } else if (this.state.calendarApi) {
            authPanel = (
            <AuthPanel
                isSignedIn={this.state.calendarApi.getIsSignedIn()}
                onSignInRequested={this.state.calendarApi.signIn}
                onSignOutRequested={this.state.calendarApi.signOut}
                onAuthChangeComplete={this.authStatusChanged}
            />
            );
        } else {
            authPanel = <p>Loading...</p>;
        }

        return (
        <div className="App">
            <div className={activeStep === 1 ? activeStepClassName : stepClassName}>
                <h3 className="App-heading">① Permission</h3>
                {authPanel}
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
