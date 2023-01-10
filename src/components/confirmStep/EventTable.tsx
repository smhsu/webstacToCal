import React from "react";
import { EventEditor } from "src/components/confirmStep/eventEditor/EventEditor";
import { getPlural } from "src/describeCount";
import { EventId, IEventEditorState } from "src/eventLogic/IEventEditorState";
import { IValidationError } from "src/eventLogic/IValidationError";
import { DESCRIPTION_FOR_TYPE, WebstacEventType } from "src/eventLogic/IWebstacEvent";

interface IEventTableProps {
    eventType: WebstacEventType;
    editorStates: IEventEditorState[];
    validationErrors: Record<EventId, IValidationError[]>
    onChange: (updated: IEventEditorState) => void;
    onExportClicked: (toExport: IEventEditorState) => void;
}

export function EventTable(props: IEventTableProps) {
    const { eventType, editorStates, validationErrors, onChange, onExportClicked } = props;

    const statesToRender = editorStates.filter(state => state.data.type === eventType);
    if (statesToRender.length <= 0) {
        return null;
    }

    return <div className="mb-4">
        <div className="d-flex gap-md-1 gap-2 align-items-center">
            <h3 className="fs-4 mb-1 me-4">{getPlural(DESCRIPTION_FOR_TYPE[eventType])}</h3>
            <button className="btn btn-link btn-small-link">Select all</button>
            <span className="" style={{ fontSize: "smaller" }}>|</span> {/* TODO make this invisible to screen readers */}
            <button className="btn btn-link btn-small-link">Deselect all</button>
        </div>

        {
            statesToRender.map((event, index) => {
                return <EventEditor
                    key={event.id}
                    editorState={event}
                    validationErrors={validationErrors[event.id]}
                    index={index}
                    onChange={onChange}
                    onExportClicked={onExportClicked}
                />;
            })
        }
    </div>;
}
