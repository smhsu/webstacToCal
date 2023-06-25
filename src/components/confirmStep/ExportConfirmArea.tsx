import React from "react";
import { AppWorkflowStep } from "src/AppWorkflowStep";
import { AppStepLink } from "src/components/AppStepLink";
import { IUpdateStateAction } from "src/state/editorStatesActions";
import { EventExportMethod } from "src/eventLogic/EventExportMethod";
import { IEventEditorState } from "src/state/IEventEditorState";
import { ISemester } from "src/eventLogic/ISemester";
import { WebstacEventType } from "src/eventLogic/IEventInputs";
import { IGoogleCalendarMetadata } from "src/google/IGoogleCalendarMetadata";

import { ExportAllPanel } from "./ExportAllPanel";
import { EventList } from "./EventList";
import { useEventInputValidation } from "./useEventInputValidation";
import { useEventExporter } from "src/components/confirmStep/useEventExporter";
import googleLogo from "src/googleLogo.svg";

const IS_CHECKING_READY_STATE = true; // For debug purposes only.
let checkingReadyStateNotification: JSX.Element | null = null;
if (process.env.NODE_ENV === "development" && !IS_CHECKING_READY_STATE) {
    checkingReadyStateNotification = <p>
        [DEBUG] Currently not checking app state for readiness to add events.
    </p>;
}

interface IExportConfirmAreaProps {
    exportMethod: EventExportMethod;
    calendar: IGoogleCalendarMetadata;
    semester: ISemester | null;
    editorStates: IEventEditorState[];
    dispatch: React.Dispatch<IUpdateStateAction>;
}

export function ExportConfirmArea(props: IExportConfirmAreaProps) {
    const { exportMethod, calendar, semester, editorStates, dispatch } = props;
    const validationErrors = useEventInputValidation(editorStates);
    const { exportOne, exportMany } = useEventExporter(calendar.id, semester, dispatch);

    const notReadyNotifications = [];
    if (exportMethod === EventExportMethod.None) {
        notReadyNotifications.push(<li key="0">
            Please <AppStepLink step={AppWorkflowStep.Config}>choose an export method</AppStepLink>.
        </li>);
    }
    if (semester === null) {
        notReadyNotifications.push(<li key="1">
            Please <AppStepLink step={AppWorkflowStep.Config}>choose a semester</AppStepLink>.
        </li>);
    }
    if (editorStates.length <= 0) {
        notReadyNotifications.push(<li key="2">Please copy-paste something valid from WebSTAC.</li>);
    }
    if (notReadyNotifications.length > 0 && IS_CHECKING_READY_STATE) {
        return <div>
            Hold your horses!  To export events:
            <ul className="mt-1">{notReadyNotifications}</ul>
        </div>;
    }

    const tableProps = {
        editorStates,
        validationErrors,
        dispatch,
        onExportClicked: exportOne
    };

    return <div className="mt-3">
        {checkingReadyStateNotification}
        <div className="mb-2 gap-1">
            Configured:
            <span className="ms-1 badge bg-wustl text-white">{semester?.name}</span>
            <span className="ms-1 badge bg-wustl text-white">
                <img
                    src={googleLogo}
                    style={{ maxHeight: "11px", verticalAlign: "bottom" }}
                    alt="Google"
                /> {calendar.summary}
            </span>
        </div>
        <ExportAllPanel editorStates={editorStates} validationErrors={validationErrors} exporter={exportMany} />
        <div>
            <EventList eventType={WebstacEventType.Course} {...tableProps} />
            <EventList eventType={WebstacEventType.Final} {...tableProps} />
        </div>
    </div>;
}
