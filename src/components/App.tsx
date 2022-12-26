import React, { PropsWithChildren, useState } from "react";
import { Intro } from "./Intro";
import { NavSidebar } from "./NavSidebar";
import { AppWorkflowStep, PROPS_FOR_STEP } from "../AppWorkflowStep";
import { FancyRadioButton } from "./FancyRadioButton";

import "./App.css";

export function App() {
    const [pastedSchedule, setPastedSchedule] = useState("");

    return <div className="container">
        <div className="row">
            <div className="col-2"><NavSidebar /></div>
            <div className="col">
                <Intro />

                <StepContainer step={AppWorkflowStep.CONFIGURE}>

                    <h3 className="fs-6">Choose an export method:</h3>
                    <IndentedDiv className="mb-4">
                        <div className="d-flex flex-column">
                            <FancyRadioButton
                                majorText="Direct to Google Calendar"
                                minorText="This will open a pop-up to grant access to your Google calendar."
                                checked={true}
                            />
                            <FancyRadioButton
                                majorText=".ical file"
                                minorText="Not available yet -- coming soon"
                                disabled={true}
                            />
                        </div>
                    </IndentedDiv>


                    <h3 className="fs-6">Choose a Google Calendar to export to:</h3>
                    <IndentedDiv className="mb-4">
                        <select className="form-select">
                            <option>Calendar 1</option>
                            <option>Calendar 2</option>
                            <option>Calendar 3</option>
                        </select>
                        <button className="btn btn-link p-0" style={{ fontSize: "smaller", textDecoration: "none" }}>
                            Refresh calendar list
                        </button>
                    </IndentedDiv>


                    <h3 className="fs-6">Choose a semester:</h3>
                    <IndentedDiv className="mb-2">
                        <div className="d-flex flex-column">
                            <FancyRadioButton
                                majorText="SP23"
                                minorText="Starts in 5 days"
                            />
                        </div>
                    </IndentedDiv>

                </StepContainer>

                <StepContainer step={AppWorkflowStep.COPYPASTE}>
                    step3
                </StepContainer>

                <StepContainer step={AppWorkflowStep.CONFIRM}>
                    step4
                </StepContainer>
            </div>
        </div>
    </div>;
}

function StepContainer(props: PropsWithChildren<{step: AppWorkflowStep}>) {
    const { id, title } = PROPS_FOR_STEP[props.step];
    return <div id={id} className="border-bottom mt-2 pb-2">
        <h2 className="fs-4">{title}</h2>
        {props.children}
    </div>;
}


export function IndentedDiv(props: React.HTMLAttributes<HTMLDivElement>) {
    const extendedClasses = "ms-4 me-2 " + (props.className || "");
    return <div {...props} className={extendedClasses} />;
}
