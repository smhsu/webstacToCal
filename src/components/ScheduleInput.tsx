import * as React from "react";
import "./css/ScheduleInput.css";

const INPUT_PLACEHOLDER = "Go to WebSTAC >> Courses & Registration >> Class Schedule.\n" +
    "Then, SELECT ALL the text, including finals schedule, and copy and paste it into this box.";

const INSTRUCTIONS_HTML = `
<p>
  <a href="https://acadinfo.wustl.edu/apps/ClassSchedule/" target="_blank">
    Click here to go to your WebSTAC class schedule.
  </a> Then, SELECT ALL and copy and paste everything into this text box.
</p>
<div class="modal fade" id="help-modal" >
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">

      <div class="modal-header">
        <h3 class="modal-title" id="helpModalLabel">② COPYPASTE</h3>
       <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        </div>

      <div class="modal-body">
        <div>
          <p>
            2a. Once you've logged into <a href="https://acadinfo.wustl.edu/" target="_blank">WebSTAC</a>, select
            Courses &amp; Registration >> Class Schedule.
          </p>
          <img src="img/help1.JPG" class="img-fluid" alt="Select Courses and Registration >> Class Schedule"/>
        </div>
        <div style="margin-top: 30px">
          <p>2b. <b>Easy way</b>: select all (CTRL+A), and copy.  Close this dialogue and paste into the text box.</p>
          <p><b>Important:</b> make sure you copied your schedule in LIST view, not grid view.</p>
          <img src="img/help2.gif" class="img-fluid" alt="Copy the entire table"/>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">OK</button>
      </div>
    </div>
  </div>
</div>
<p><button class="btn btn-secondary" data-toggle="modal" data-target="#help-modal">More help</button></p>
`;

interface ScheduleInputProps {
    value?: string;
    numEventsParsed?: number;
    onChange?(event: React.ChangeEvent<HTMLTextAreaElement>): void;
}

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
            <div dangerouslySetInnerHTML={{__html: INSTRUCTIONS_HTML}} />
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

function ParseSuccessNotice(props: {numEvents: number}) {
    return (
    <div className="alert alert-success ScheduleInput-notice" role="alert">
        {props.numEvents} events found!  Scroll down to confirm additions to calendar.
        <br/>
        <i className="fa fa-arrow-down ScheduleInput-arrow" aria-hidden="true" />
    </div>
    );
}

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
