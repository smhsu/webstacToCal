import * as React from "react";
import "./css/ScheduleInput.css";

const INPUT_PLACEHOLDER = "Go to WebSTAC >> Courses & Registration >> Class Schedule.\n" +
    "Then, SELECT ALL the text, including finals schedule, and copy and paste it into this box.";

interface ScheduleInputProps {
    /**
     * The current contents of the input box.
     */
    value?: string;

    /**
     * The number of events parsed from the input.
     */
    numEventsParsed?: number;

    /**
     * Callback for when the user modifies the input box.
     */
    onChange?(event: React.ChangeEvent<HTMLTextAreaElement>): void;
}

/**
 * Component that contains a box for pasting class and finals schedule, as well as instructions on how and feedback on
 * parse results.  The input box is completely controlled; the parent must pass the current contents via props.
 * 
 * @param {ScheduleInputProps} props
 */
function ScheduleInput(props: ScheduleInputProps): JSX.Element {
    let textareaClassName = "ScheduleInput-input-box";
    let parseNotice = null;
    if (props.value) {
        const numParsed = props.numEventsParsed || 0;
        if (numParsed > 0) {
            textareaClassName += " ScheduleInput-success-border";
            parseNotice = <ParseSuccessNotice numEvents={numParsed} />;
        } else {
            textareaClassName += " ScheduleInput-failed-border";
            parseNotice = parseFailedNotice;
        }
    }
    
    return (
        <div>
            <p>
                <a href="https://acadinfo.wustl.edu/apps/ClassSchedule/" target="_blank" rel="noreferrer">
                  Click here to go to your WebSTAC class schedule.
                </a> Then, SELECT ALL and copy and paste everything into this text box.
            </p>
            <p>
                <button className="btn btn-secondary" data-toggle="modal" data-target="#help-modal">More help</button>
            </p>
            <textarea
                className={textareaClassName}
                placeholder={INPUT_PLACEHOLDER}
                value={props.value}
                onChange={props.onChange}
            />
        {parseNotice}
        </div>
    );
}

/**
 * An alert for a successful parse of the user's schedule.
 * 
 * @param {object} props
 * @param {number} props.numEvents - the number of events that were parsed successfully.
 * @return {JSX.Element} the element to render
 */
function ParseSuccessNotice(props: {numEvents: number}): JSX.Element {
    return (
    <div className="alert alert-success ScheduleInput-notice" role="alert">
        {props.numEvents} events found!  Scroll down to confirm additions to calendar.
        <br/>
        <i className="fa fa-arrow-down ScheduleInput-arrow" aria-hidden="true" />
    </div>
    );
}

/**
 * An alert for a failed parse of the user's schedule.
 */
const parseFailedNotice = (
    <div className="alert alert-danger ScheduleInput-notice ScheduleInput-parse-failed" role="alert">
        <p>We weren't able to detect any of your classes or finals.</p>
        <ul>
            <li>Be sure you're pasting your entire class schedule, including Course IDs.</li>
            <li>You could be using an unsupported browser.  Try copying WebSTAC from the desktop version of Chrome,
              Firefox, Safari, Opera, or Edge.</li>
        </ul>
    </div>
);

export default ScheduleInput;
