import React, { PropsWithChildren, useCallback, useId, useReducer, useState } from "react";

import { AppWorkflowStep, PROPS_FOR_STEP } from "src/AppWorkflowStep";
import { ActionType } from "src/state/editorStatesActions";
import { editorStatesReducer } from "src/state/editorStatesReducer";
import { EventExportMethod } from "src/eventLogic/EventExportMethod";
import { ISemester } from "src/eventLogic/ISemester";
import { IEventInputs } from "src/eventLogic/IEventInputs";
import { PRIMARY_CALENDAR } from "src/google/IGoogleCalendarMetadata";
import { useAuth } from "src/google/useAuthState";
import { useGlobalGoogleApis } from "src/google/useGlobalGoogleApis";

import { CalendarSelector } from "./configStep/CalendarSelector";
import { ExportMethodSelector } from "./configStep/ExportMethodSelector";
import { SemesterSelector } from "./configStep/SemesterSelector";
import { ExportConfirmArea } from "./confirmStep/ExportConfirmArea";
import { ScheduleInputArea } from "./copyPasteStep/ScheduleInputArea";
import { Intro } from "src/components/Intro";
import { Navigation } from "src/components/Navigation";

import "./App.css";

export function App() {
    const apiLoadState = useGlobalGoogleApis();
    const auth = useAuth(apiLoadState.isLoaded);
    const [exportMethod, setExportMethod] = useState(EventExportMethod.None);
    const [selectedCalendar, setSelectedCalendar] = useState(PRIMARY_CALENDAR);
    const [selectedSemester, setSelectedSemester] = useState<ISemester | null>(null);
    const [editorStates, dispatch] = useReducer(editorStatesReducer, []);

    const exportMethodLabelId = useId();

    const handleExportMethodChanged = useCallback((newMethod: EventExportMethod) => {
        setExportMethod(newMethod);
    }, []);

    const handleEventsParsed = useCallback((inputs: IEventInputs[]) => {
        dispatch({ type: ActionType.Replace, replacementInputs: inputs });
    }, []);

    return <div className="container-lg mt-md-3">
        <div className="row">
            <Navigation/>
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
                                    value={selectedCalendar}
                                    auth={auth}
                                    onChange={setSelectedCalendar}
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
                            calendar={selectedCalendar}
                            semester={selectedSemester}
                            editorStates={editorStates}
                            dispatch={dispatch} />
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
