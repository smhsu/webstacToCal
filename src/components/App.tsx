import {PropsWithChildren, useCallback, useState} from "react";
import { Intro } from "./Intro";
import { NavSidebar } from "./NavSidebar";
import { EventExportStep, PROPS_FOR_STEP } from "../EventExportStep";
import "./App.css";
import {AuthPanel} from "./AuthPanel";
import {CalendarApi} from "../CalendarApi";

export function App() {
    const [isApiLoaded, setIsApiLoaded] = useState(false);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [apiLoadError, setApiLoadError] = useState<Error | null>(null);
    const [pastedSchedule, setPastedSchedule] = useState("");

    let permissionStepContent;
    if (isApiLoaded) {
        permissionStepContent = <AuthPanel
            isSignedIn={isSignedIn}
            onAuthStateChange={setIsSignedIn}
        />;
    } else if (apiLoadError !== null) {
        permissionStepContent = "Could not load Google API";
    } else {
        permissionStepContent  = "Loading Google API...";
    }

    return <div className="container">
        <div className="row">
            <div className="col-2"><NavSidebar /></div>
            <div className="col">
                <Intro />
                <StepContainer step={EventExportStep.PERMISSION}>
                    {permissionStepContent}
                </StepContainer>
                <StepContainer step={EventExportStep.CONFIGURE}>
                    step2
                </StepContainer>
                <StepContainer step={EventExportStep.COPYPASTE}>
                    step3
                </StepContainer>
                <StepContainer step={EventExportStep.CONFIRM}>
                    step4
                </StepContainer>
            </div>
        </div>
    </div>;
}

function StepContainer(props: PropsWithChildren<{step: EventExportStep}>) {
    const { id, title } = PROPS_FOR_STEP[props.step];
    return <div id={id} className="border-bottom mt-2 pb-2">
        <h2 className="fs-3">{title}</h2>
        {props.children}
    </div>;
}
