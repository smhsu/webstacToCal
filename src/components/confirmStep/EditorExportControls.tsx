import { faCheck, faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { LabeledInput } from "components/confirmStep/LabeledInput";
import { IEventExportState } from "eventLogic/IEventExportState";

interface IEditorExportControlsProps {
    exportState: IEventExportState;
    isSelectedForExport: boolean;
    disabled?: boolean;
    className?: string;
    onExportClicked: () => void;
    onSelectionToggle: () => void
}

export function EditorExportControls(props: IEditorExportControlsProps) {
    const { exportState, isSelectedForExport, className, disabled, onExportClicked, onSelectionToggle } = props;
    if (exportState.successUrl) {
        return <div className={className + " d-flex align-items-center"}>
            <div className="alert alert-success p-2">
                <FontAwesomeIcon className="me-1" icon={faCheck} />
                <span className="me-1">Added!</span>
                <a href={exportState.successUrl} target="_blank" rel="noopener noreferrer">
                    Edit...
                </a>
            </div>
        </div>;
    }

    return <div className={className + " d-flex flex-column gap-2 align-items-md-center justify-content-evenly"}>
        <div>
            <button
                className="btn btn-primary"
                disabled={disabled || exportState.isExporting}
                onClick={onExportClicked}
            >
                <FontAwesomeIcon icon={faCloudArrowUp} className="me-2" />
                {exportState.isExporting ?
                    <span className="spinner-border spinner-border-sm">
                        <span className="visually-hidden">Working...</span>
                    </span>
                    :
                    "Add"
                }
            </button>
        </div>

        <LabeledInput
            className="d-flex gap-2 align-items-center justify-content-md-center"
            renderLabel={inputId => <label htmlFor={inputId} className="order-1 EventEditor-checkbox-label">
                Include when adding all
            </label>}
            renderInput={id => <input
                id={id}
                type="checkbox"
                className="form-check-input flex-shrink-0"
                checked={isSelectedForExport}
                onChange={onSelectionToggle}
            />}
        />
    </div>;
}
