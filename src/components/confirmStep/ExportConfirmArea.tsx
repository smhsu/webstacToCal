import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import { describeCount } from "src/describeCount";
import { IEventEditorState } from "src/eventLogic/IEventEditorState";
import { EventExportMethod } from "src/eventLogic/EventExportMethod";
import { ISemester } from "src/eventLogic/ISemester";

import { EventEditor } from "./EventEditor";
import { useEventInputValidation } from "./useEventInputValidation";
import { useManageExportState } from "./useManageExportState";

interface IExportConfirmAreaProps {
    exportMethod: EventExportMethod;
    calendarId: string;
    semester: ISemester | null;
    editorStates: IEventEditorState[];
    onEditorStatesChanged: (newEvents: IEventEditorState[]) => void;
}

export function ExportConfirmArea(props: IExportConfirmAreaProps) {
    const { exportMethod, calendarId, semester, editorStates, onEditorStatesChanged } = props;
    const validationErrors = useEventInputValidation(editorStates.map(state => state.data));
    const { exportOne } = useManageExportState(editorStates, calendarId, semester, onEditorStatesChanged);

    const handleOneEditorChanged = (updatedState: IEventEditorState, index: number) => {
        const newStates = editorStates.slice();
        newStates[index] = updatedState;
        onEditorStatesChanged(newStates);
    };

    const notReadyNotifications = [];/*
    if (exportMethod === EventExportMethod.None) {
        notReadyNotifications.push(<li key="0">
            You must <AppStepLink step={AppWorkflowStep.Config} linkText={"choose an eventExport method"}/>.
        </li>);
    }
    if (semester === null) {
        notReadyNotifications.push(<li key="1">
            You must <AppStepLink step={AppWorkflowStep.Config} linkText={"choose a semester"} />.
        </li>);
    }
    if (webstacEvents.length <= 0) {
        notReadyNotifications.push(<li key="2">You must copy-paste something valid from WebSTAC.</li>);
    }
    if (notReadyNotifications.length > 0) {
        return <div>
            Hold your horses!  To eventExport events:
            <ul className="mt-1">{notReadyNotifications}</ul>
        </div>;
    }*/

    const numSelected = editorStates.filter(state => state.isSelected).length;
    return <div>
        <button
            className="btn btn-primary d-flex align-items-center gap-1 text-start"
            disabled={numSelected <= 0}
        >
            <FontAwesomeIcon icon={faCloudArrowUp} className="me-2" />
            <div>
                <div>Add all selected events to Google Calendar</div>
                <div style={{ fontSize: "smaller" }}>
                    {describeCount(numSelected, "event")} selected
                </div>
            </div>
        </button>
        <div>
            {
                editorStates.map((event, index) => {
                    return <EventEditor
                        key={index}
                        editorState={event}
                        validationErrors={validationErrors[index]}
                        index={index}
                        onChange={newState => handleOneEditorChanged(newState, index)}
                        onExportClicked={() => exportOne(index)}
                    />;
                })
            }
        </div>
    </div>;
}


/*
        <div>
            <div>3 events added.</div>
            <div>1 invalid event ignored.</div>
            <div>2 events failed to add.  See individual rows for error details.</div>
        </div>
        <div>
            Some events are not ready for export and need manual editing.
        </div>
*/
