import { PropsWithChildren, useCallback, useState } from "react";
import { Intro } from "./Intro";
import { NavSidebar } from "./NavSidebar";
import { SchedulePasteArea } from "./SchedulePasteArea";
import { ExportMethodSelector } from "./ExportMethodSelector";
import { CalendarSelector } from "./CalendarSelector";
import { SemesterSelector } from "./SemesterSelector";

import { EventExportMethod } from "../EventExportMethod";
import { AppWorkflowStep, PROPS_FOR_STEP } from "../AppWorkflowStep";
import { useGlobalGoogleApis } from "../google/useGlobalGoogleApis";
import { useAuth } from "../google/useAuthState";
import { ISemester } from "../eventModel/ISemester";
import { WebstacEvent } from "../eventModel/WebstacEvent";

import "./App.css";

export function App() {
    const apiLoadState = useGlobalGoogleApis();
    const auth = useAuth(apiLoadState.isLoaded);
    const [exportMethod, setExportMethod] = useState(EventExportMethod.None);
    const [selectedCalendarId, setSelectedCalendarId] = useState("primary");
    const [selectedSemester, setSelectedSemester] = useState<ISemester | null>(null);
    const [webstacEvents, setWebstacEvents] = useState<WebstacEvent[]>([]);

    const handleExportMethodChanged = useCallback((newMethod: EventExportMethod) => {
        setExportMethod(newMethod);
    }, []);

    return <div className="container">
        <div className="row">
            <div className="col-md-2"><NavSidebar /></div>
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
                    <SchedulePasteArea onEventsParsed={setWebstacEvents} />
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
    return <div id={id} className="border-bottom pt-3 pb-3">
        <h2 className="fs-4">{heading}</h2>
        {props.children}
    </div>;
}


export function IndentedDiv(props: React.HTMLAttributes<HTMLDivElement>) {
    const extendedClasses = "ms-4 me-2 " + (props.className || "");
    return <div {...props} className={extendedClasses} />;
}
