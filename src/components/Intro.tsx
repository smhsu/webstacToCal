import { AppWorkflowStep, PROPS_FOR_STEP } from "../AppWorkflowStep";

export function Intro() {
    return <div className="p-4 mb-4 rounded-3" style={{ backgroundColor: "gainsboro" }}>
        <p className="fs-4 fw-bold mb-1 font-heading">Export classes and finals from WebSTAC to Google Calendar.</p>
        <ul>
            <li>For students of Washington University in St. Louis.</li>
            <li>Free and no registration required.  Just copy and paste from WebSTAC.</li>
            <li>
                Schedule sent only to Google Calendar.  This app does not store or retain anybody's
                schedules <a href="privacy.html">(privacy policy)</a>.
            </li>
        </ul>
        <div className="d-flex align-items-center">
            <a className="btn btn-primary" href={"#" + PROPS_FOR_STEP[AppWorkflowStep.Config].id}>
                Scroll down to start
            </a>
            <span className="px-1">OR</span>
            <a className="btn btn-dark" href={"#" + PROPS_FOR_STEP[AppWorkflowStep.About].id}>About this site</a>
        </div>
    </div>;
}
