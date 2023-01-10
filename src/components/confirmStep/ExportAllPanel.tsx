import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

import { describeCount } from "src/describeCount";
import { EventId, IEventEditorState } from "src/eventLogic/IEventEditorState";
import { IValidationError } from "src/eventLogic/IValidationError";
import { ExportAllResults } from "./ExportAllResults";

interface IExportAllPanelProps {
    editorStates: IEventEditorState[];
    validationErrors: Record<EventId, IValidationError[]>;
    exporter: (toExport: IEventEditorState[]) => Promise<boolean[]>
}

export function ExportAllPanel(props: IExportAllPanelProps) {
    const { editorStates, validationErrors, exporter } = props;
    const [numSuccessful, setNumSuccessful] = useState(0);
    const [numFailed, setNumFailed] = useState(0);
    const isAnyExporting = editorStates.some(state => state.exportState.isExporting);
    const willBeExported = editorStates.filter(state => state.isSelected && validationErrors[state.id].length === 0);

    const handleExportClicked = async () => {
        const results = await exporter(willBeExported);
        const numSuccessful = results.filter(result => result).length;
        setNumSuccessful(numSuccessful);
        setNumFailed(results.length - numSuccessful);
    };

    return <div className="mb-4">
        <div className="mb-2 d-flex gap-3 align-items-center">
            <button
                className="btn btn-primary d-flex align-items-center gap-1 text-start"
                disabled={willBeExported.length <= 0 || isAnyExporting}
                onClick={handleExportClicked}
            >
                <FontAwesomeIcon icon={faCloudArrowUp} className="me-2" />
                <div>
                    <div>Add all selected events to Google Calendar</div>
                    <div style={{ fontSize: "smaller" }}>
                        Create {describeCount(willBeExported.length, "event")}
                    </div>
                </div>
            </button>
            {isAnyExporting ?
                <div>Working... <span className="spinner-border spinner-border-sm" /></div>
                :
                <div>Events highlighted in <span style={{ color: "darkgoldenrod" }}>yellow</span> will be added.</div>
            }
        </div>
        <ExportAllResults numSuccessful={numSuccessful} numFailed={numFailed} />
    </div>;
}
