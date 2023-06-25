import { faCheck, faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Analytics } from "src/google/Analytics";
import { EventExportState } from "src/state/EventExportState";

interface IEditorExportControlsProps {
    exportState: EventExportState;
    disabled?: boolean;
    className?: string;
    onExportClicked: () => void;
}

export function EditorExportControls(props: IEditorExportControlsProps) {
    const { exportState, className, disabled, onExportClicked } = props;
    const handleExportClicked = () => {
        Analytics.sendEvent("Export one clicked");
        onExportClicked();
    };

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
                onClick={handleExportClicked}
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
    </div>;
}
