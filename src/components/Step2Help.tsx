import * as React from "react";

const htmlContent = `
<p>
  <a href="https://acadinfo.wustl.edu/apps/ClassSchedule/" target="_blank">
    Click here to go to your WebSTAC class schedule.
  </a> Then, SELECT ALL and copy and paste everything into this text box.
</p>
<div class="modal fade" id="help-modal" >
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">

      <div class="modal-header">
        <h3 class="modal-title" id="helpModalLabel">Step 2: CopyPaste</h3>
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
<button class="btn btn-secondary" data-toggle="modal" data-target="#help-modal">More help</button>
`;

function Step2Help(props: {}) {
    return <div dangerouslySetInnerHTML={{__html: htmlContent}} />;
}

export default Step2Help;
