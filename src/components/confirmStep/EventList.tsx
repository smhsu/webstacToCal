import React from "react";
import { EventEditor } from "src/components/confirmStep/eventEditor/EventEditor";
import { getPlural } from "src/describeCount";
import { DESCRIPTION_FOR_TYPE, WebstacEventType } from "src/eventLogic/IEventInputs";
import { IValidationError } from "src/eventLogic/IValidationError";
import { ActionType, IUpdateStateAction } from "src/state/editorStatesActions";
import { EventEditorId, IEventEditorState } from "src/state/IEventEditorState";

interface IEventListProps {
    eventType: WebstacEventType;
    editorStates: IEventEditorState[];
    validationErrors: Record<EventEditorId, IValidationError[]>;
    dispatch: React.Dispatch<IUpdateStateAction>;
    onExportClicked: (toExport: IEventEditorState) => void;
}

export function EventList(props: IEventListProps) {
    const { eventType, editorStates, validationErrors, dispatch, onExportClicked } = props;

    const eventsToRender = editorStates.filter(event => event.inputs.type === eventType);
    if (eventsToRender.length <= 0) {
        return null;
    }

    const handleBatchSelectionChange = (newSelectionState: boolean) => {
        dispatch({
            type: ActionType.SetSelectionForExport,
            ids: eventsToRender.map(event => event.id),
            newSelectionState
        });
    };

    return <div className="mb-4">
        <div className="d-flex gap-md-1 gap-2 align-items-center">
            <h3 className="fs-4 mb-1 me-4">{getPlural(DESCRIPTION_FOR_TYPE[eventType])}</h3>
            <button
                className="btn btn-link btn-small-link"
                onClick={() => handleBatchSelectionChange(true)}
            >
                Select all
            </button>
            <span aria-hidden={true} style={{ fontSize: "smaller" }}>|</span>
            <button
                className="btn btn-link btn-small-link"
                onClick={() => handleBatchSelectionChange(false)}
            >
                Deselect all
            </button>
        </div>

        {
            eventsToRender.map((event, index) => {
                return <EventEditor
                    key={event.id}
                    editorState={event}
                    validationErrors={validationErrors[event.id]}
                    index={index}
                    dispatch={dispatch}
                    onExportClicked={onExportClicked}
                />;
            })
        }
    </div>;
}
