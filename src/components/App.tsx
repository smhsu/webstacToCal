import { PropsWithChildren, useCallback, useId, useState } from "react";

import { AppWorkflowStep, PROPS_FOR_STEP } from "src/AppWorkflowStep";
import { EventExportMethod } from "src/eventLogic/EventExportMethod";
import { IEventEditorState } from "src/eventLogic/IEventEditorState";
import { ISemester } from "src/eventLogic/ISemester";
import { IWebstacEventData } from "src/eventLogic/IWebstacEvent";
import { useAuth } from "src/google/useAuthState";
import { useGlobalGoogleApis } from "src/google/useGlobalGoogleApis";

import { CalendarSelector } from "./configStep/CalendarSelector";
import { ExportMethodSelector } from "./configStep/ExportMethodSelector";
import { SemesterSelector } from "./configStep/SemesterSelector";
import { ExportConfirmArea } from "./confirmStep/ExportConfirmArea";
import { ScheduleInputArea } from "./copyPasteStep/ScheduleInputArea";
import { Intro } from "./Intro";
import { NavSidebar } from "./NavSidebar";

import "./App.css";

export function App() {
    const apiLoadState = useGlobalGoogleApis();
    const auth = useAuth(apiLoadState.isLoaded);
    const [exportMethod, setExportMethod] = useState(EventExportMethod.None);
    const [selectedCalendarId, setSelectedCalendarId] = useState("primary");
    const [selectedSemester, setSelectedSemester] = useState<ISemester | null>(null);
    const [editorStates, setEditorStates] = useState<IEventEditorState[]>([]);

    const exportMethodLabelId = useId();

    const handleExportMethodChanged = useCallback((newMethod: EventExportMethod) => {
        setExportMethod(newMethod);
    }, []);

    const handleEventsParsed = useCallback((newEvents: IWebstacEventData[]) => {
        setEditorStates(newEvents.map((event, i) => {
            return {
                id: i.toString(),
                data: event,
                isSelected: true,
                exportState: {
                    isExporting: false,
                    successUrl: "",
                    errorMessage: ""
                }
            };
        }));
    }, []);

    return <div className="container-lg">
        <div className="row">
            <div className="col-md-2"><NavSidebar /></div>
            <div className="col">
                <Intro />

                <StepContainer step={AppWorkflowStep.Config}>
                    <h3 id={exportMethodLabelId} className="fs-6">• Choose an export method:</h3>
                    <IndentedDiv className="mb-4">
                        <ExportMethodSelector
                            method={exportMethod}
                            apiLoadState={apiLoadState}
                            auth={auth}
                            ariaLabelledby={exportMethodLabelId}
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
                    <ScheduleInputArea onEventsParsed={handleEventsParsed} />
                </StepContainer>

                <StepContainer step={AppWorkflowStep.Confirm}>
                    <IndentedDiv>
                        <ExportConfirmArea
                            exportMethod={exportMethod}
                            calendarId={selectedCalendarId}
                            semester={selectedSemester}
                            editorStates={editorStates}
                            onEditorStatesChanged={setEditorStates} />
                    </IndentedDiv>
                </StepContainer>
            </div>
        </div>
    </div>;
}

function StepContainer(props: PropsWithChildren<{step: AppWorkflowStep}>) {
    const { id, heading } = PROPS_FOR_STEP[props.step];
    return <div id={id} className="pt-2 mt-3 pb-4 border-bottom">
        <h2 className="fs-3">{heading}</h2>
        {props.children}
    </div>;
}


export function IndentedDiv(props: React.HTMLAttributes<HTMLDivElement>) {
    const extendedClasses = "ms-4 me-2 " + (props.className || "");
    return <div {...props} className={extendedClasses} />;
}
