import React, { PropsWithChildren, useCallback, useState } from "react";
import { Intro } from "./Intro";
import { NavSidebar } from "./NavSidebar";
import { AppWorkflowStep, PROPS_FOR_STEP } from "../AppWorkflowStep";
import { useGlobalGoogleApis } from "../google/useGlobalGoogleApis";
import { useAuth } from "../google/useAuthState";
import { ExportMethodSelector } from "./ExportMethodSelector";
import { EventExportMethod } from "../EventExportMethod";
import { CalendarSelector } from "./CalendarSelector";
import { ISemester } from "../eventModel/ISemester";
import { SemesterSelector } from "./SemesterSelector";

import "./App.css";

const INPUT_PLACEHOLDER = "Go to WebSTAC >> Courses & Registration >> Class Schedule.\n" +
    "Then, SELECT ALL the text, including finals schedule, and copy and paste it into this box.";

export function App() {
    const apiLoadState = useGlobalGoogleApis();
    const auth = useAuth(apiLoadState.isLoaded);
    const [exportMethod, setExportMethod] = useState(EventExportMethod.None);
    const [selectedSemester, setSelectedSemester] = useState<ISemester | null>(null);
    const [selectedCalendarId, setSelectedCalendarId] = useState("primary");
    const [pastedSchedule, setPastedSchedule] = useState("");

    const handleExportMethodChanged = useCallback((newMethod: EventExportMethod) => {
        setExportMethod(newMethod);
    }, []);

    return <div className="container">
        <div className="row">
            <div className="col-2"><NavSidebar /></div>
            <div className="col">
                <Intro />

                <StepContainer step={AppWorkflowStep.Config}>
                    <h3 className="fs-6">• Choose an export method:</h3>
                    <IndentedDiv className="mb-4">
                        <ExportMethodSelector
                            method={exportMethod}
                            apiLoadState={apiLoadState}
                            auth={auth}
                            onMethodChanged={handleExportMethodChanged}
                        />
                    </IndentedDiv>

                    {exportMethod === EventExportMethod.GoogleCalendar &&
                        <>
                            <h3 className="fs-6">• Choose a Google Calendar to export to:</h3>
                            <IndentedDiv className="mb-4">
                                <CalendarSelector
                                    value={selectedCalendarId}
                                    auth={auth}
                                    onChange={setSelectedCalendarId}
                                />
                            </IndentedDiv>
                        </>
                    }

                    <h3 className="fs-6">• Choose a semester:</h3>
                    <IndentedDiv className="mb-2">
                        <SemesterSelector value={selectedSemester} onChange={setSelectedSemester} />
                    </IndentedDiv>
                </StepContainer>

                <StepContainer step={AppWorkflowStep.CopyPaste}>
                    <textarea
                        placeholder={INPUT_PLACEHOLDER}
                        value={pastedSchedule}
                        onChange={e => setPastedSchedule(e.currentTarget.value)}
                    />
                </StepContainer>

                <StepContainer step={AppWorkflowStep.Confirm}>
                    Coming soon!
                </StepContainer>
            </div>
        </div>
    </div>;
}

function StepContainer(props: PropsWithChildren<{step: AppWorkflowStep}>) {
    const { id, heading } = PROPS_FOR_STEP[props.step];
    return <div id={id} className="border-bottom mt-2 pb-2">
        <h2 className="fs-4">{heading}</h2>
        {props.children}
    </div>;
}


export function IndentedDiv(props: React.HTMLAttributes<HTMLDivElement>) {
    const extendedClasses = "ms-4 me-2 " + (props.className || "");
    return <div {...props} className={extendedClasses} />;
}
