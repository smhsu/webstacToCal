import React from "react";
import { AppWorkflowStep } from "src/AppWorkflowStep";
import { AppStepLink } from "src/components/AppStepLink";
import { EventExportMethod } from "src/eventLogic/EventExportMethod";
import { IEventEditorState } from "src/eventLogic/IEventEditorState";
import { ISemester } from "src/eventLogic/ISemester";
import { WebstacEventType } from "src/eventLogic/IEventInputs";

import { ExportAllPanel } from "./ExportAllPanel";
import { EventList } from "./EventList";
import { useEventInputValidation } from "./useEventInputValidation";
import { useManageExportState } from "./useManageExportState";

const IS_CHECKING_READY_STATE = false;

interface IExportConfirmAreaProps {
    exportMethod: EventExportMethod;
    calendarId: string;
    semester: ISemester | null;
    editorStates: IEventEditorState[];
    onEditorStatesChanged: (newEvents: IEventEditorState[]) => void;
}

export function ExportConfirmArea(props: IExportConfirmAreaProps) {
    const { exportMethod, calendarId, semester, editorStates, onEditorStatesChanged } = props;
    const validationErrors = useEventInputValidation(editorStates);
    const { exportOne, exportMany } = useManageExportState(editorStates, calendarId, semester, onEditorStatesChanged);

    const handleOneEditorChanged = (updatedState: IEventEditorState) => {
        const index = editorStates.findIndex(state => state.id === updatedState.id);
        if (index < 0) {
            return;
        }
        const newStates = editorStates.slice();
        newStates[index] = updatedState;
        onEditorStatesChanged(newStates);
    };

    const notReadyNotifications = [];
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
    if (editorStates.length <= 0) {
        notReadyNotifications.push(<li key="2">You must copy-paste something valid from WebSTAC.</li>);
    }
    if (notReadyNotifications.length > 0 && IS_CHECKING_READY_STATE) {
        return <div>
            Hold your horses!  To eventExport events:
            <ul className="mt-1">{notReadyNotifications}</ul>
        </div>;
    }

    const tableProps = {
        editorStates,
        validationErrors,
        onChange: handleOneEditorChanged,
        onExportClicked: exportOne
    };

    return <div className="mt-3">
        <ExportAllPanel editorStates={editorStates} validationErrors={validationErrors} exporter={exportMany} />
        <div>
            <EventList eventType={WebstacEventType.Course} {...tableProps} />
            <EventList eventType={WebstacEventType.Final} {...tableProps} />
        </div>
    </div>;
}
