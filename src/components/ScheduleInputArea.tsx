import React from "react";
import { debounce } from "lodash";
import { IWebstacEvent } from "../eventLogic/IWebstacEvent";
import { CourseParser } from "../eventLogic/CourseParser";
import { ExamParser } from "../eventLogic/ExamParser";
import { describeCount } from "../describeCount";

const CLASS_SCHEDULE_URL = "https://acadinfo.wustl.edu/apps/ClassSchedule/";
const PLACEHOLDER = "Go to WebSTAC >> Courses & Registration >> Class Schedule.\n" +
    "Then, highlight ALL the text, including finals schedule, and copy and paste it into this box.";
const MODAL_ID = "help-modal"; // The modal itself is specified in index.html.
const DEBOUNCE_DELAY_MS = 300;

interface IScheduleInputAreaProps {
    onEventsParsed?: (events: IWebstacEvent[]) => void;
}

interface IScheduleInputAreaState {
    textAreaValue: string;
    numCoursesParsed: number;
    numFinalsParsed: number;
    isParsingFailure: boolean;
}

export class ScheduleInputArea extends React.PureComponent<IScheduleInputAreaProps, IScheduleInputAreaState> {
    constructor(props: IScheduleInputAreaProps) {
        super(props);
        this.state = {
            textAreaValue: "",
            numCoursesParsed: 0,
            numFinalsParsed: 0,
            isParsingFailure: false
        };
        this.handleTextAreaChanged = this.handleTextAreaChanged.bind(this);
        this.parseEvents = debounce(this.parseEvents, DEBOUNCE_DELAY_MS);
    }

    handleTextAreaChanged(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const value = e.currentTarget.value;
        this.setState({ textAreaValue: value, isParsingFailure: false });
        this.parseEvents(value);
    }

    parseEvents(input: string): void {
        const courses = CourseParser.parseCourses(input);
        const finals = ExamParser.parseExams(input, courses);
        this.setState({
            numCoursesParsed: courses.length,
            numFinalsParsed: finals.length
        });
        const allEvents = (courses as IWebstacEvent[]).concat(finals);
        if (allEvents.length <= 0 && input.trim().length > 0) {
            this.setState({ isParsingFailure: true });
        }
        this.props.onEventsParsed?.(allEvents);
    }

    render() {
        return <div className="px-2">
            <Instructions />
            <div className="row">
                <div className="col-md-8">
                    <textarea
                        className="w-100"
                        style={{ minHeight: "170px" }}
                        placeholder={PLACEHOLDER}
                        aria-label="Paste your schedule here"
                        value={this.state.textAreaValue}
                        onChange={this.handleTextAreaChanged}
                    />
                </div>
                <div className="col-md-4">
                    <ParseStatus {...this.state} />
                </div>
            </div>
        </div>;
    }
}

function Instructions() {
    return <div>
        <div className="mt-2 mb-2">
            <b>Instructions: </b>
            <ol>
                <li>
                    Go to your <a href={CLASS_SCHEDULE_URL} target="_blank" rel="noreferrer">class schedule on
                    WebSTAC.</a>
                </li>
                <li>
                    While in <i>List View</i>, highlight ALL the text on the page, including finals.
                    (Shortcut: <SelectAllShortcut />)
                </li>
                <li>Copy-paste into the box below.</li>
                <li>Processing of your schedule will happen automatically.</li>
            </ol>
        </div>
        <div className="mb-4">
            <button className="btn btn-secondary" data-bs-toggle="modal" data-bs-target={"#" + MODAL_ID}>
                More help...
            </button>
        </div>
    </div>;
}

function ParseStatus(props: IScheduleInputAreaState) {
    const { numCoursesParsed, numFinalsParsed, isParsingFailure } = props;
    let additionalClassNames;
    let secondaryText = "";
    let isRoleStatus = false;
    if (numCoursesParsed > 0 || numFinalsParsed > 0) {
        additionalClassNames = "alert-success";
        secondaryText = "Almost done! Just scroll down to confirm additions to calendar.";
        isRoleStatus = true;
    } else if (isParsingFailure) {
        additionalClassNames = "alert-danger";
        secondaryText = "Couldn't find anything in this input.  Be sure you are copy-pasting from " +
            "a desktop or laptop computer.";
        isRoleStatus = true;
    } else {
        additionalClassNames = "alert-secondary";
    }

    return <div
        className={"alert alert-secondary rounded-0 " + additionalClassNames}
        role={isRoleStatus ? "status" : undefined}
    >
        <h3 className="fs-6 fw-bold">Auto-detection results:</h3>
        <ul className="mb-2">
            <li>{describeCount(numCoursesParsed, "class")} detected.</li>
            <li>{describeCount(numFinalsParsed, "final")} detected.</li>
        </ul>
        {secondaryText && <div>{secondaryText}</div>}
    </div>;
}

const SelectAllShortcut = React.memo(function SelectAllShortcut() {
    const isMac = navigator.userAgent.indexOf("Mac") !== -1;
    const modifierKey = isMac ? "command ⌘" : "Ctrl";
    return <>
        <span className="keyboard-key">{modifierKey}</span>+<span className="keyboard-key">A</span>
    </>;
});
