import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useId } from "react";

import { EventDateInput } from "src/eventLogic/EventDateInput";
import { IEventInputs, WebstacEventType } from "src/eventLogic/IEventInputs";
import { IValidationError, ValidationErrorType } from "src/eventLogic/IValidationError";
import { ActionType, IUpdateStateAction } from "src/state/editorStatesActions";
import { IEventEditorState } from "src/state/IEventEditorState";

import { EditorExportControls } from "./EditorExportControls";
import { EditorLayout } from "./EditorLayout";
import { EditorLegend } from "./EditorLegend";
import { LabeledInput } from "./LabeledInput";
import { RepeatingDaysSelector } from "./RepeatingDaysSelector";
import { StartEndTimeInputs } from "./StartEndTimeInputs";
import { ValidationErrorDisplay } from "./ValidationErrorDisplay";
import "./EventEditor.css";

const DATE_INPUT_SIZE = 12;

interface IEventEditorProps {
    editorState: IEventEditorState;
    validationErrors: IValidationError[];
    index: number;
    dispatch: React.Dispatch<IUpdateStateAction>;
    onExportClicked: (toExport: IEventEditorState) => void;
}

/**
 * After giving this a lot of thought, I have arrived at the conclusion that <input type="text" /> is best for date
 * and time inputs, i.e. no date or time pickers.  Pickers are best for the situation where the user makes a choice and
 * can peruse alternatives, but in our case, the date and times are already known.
 *
 * @param props
 */
export const EventEditor = React.memo(function EventEditor(props: IEventEditorProps) {
    const { editorState, validationErrors, index, dispatch, onExportClicked } = props;
    const { inputs, exportState } = editorState;

    const checkboxId = useId();
    const toggleSelection = function() {
        dispatch({
            type: ActionType.SetSelectionForExport,
            ids: [editorState.id],
            newSelectionState: !editorState.exportState.isSelected
        });
    };
    const dispatchChange = function<T extends IEventInputs>(updates: Partial<T>) {
        dispatch({
            type: ActionType.UpdateInputs,
            id: editorState.id,
            updates
        });
    };

    // Some helpers and properties
    const isReadOnly = exportState.isExporting || exportState.successUrl.length > 0;
    const isExportDisabled = isReadOnly || validationErrors.length > 0;
    const validationErrorTypes = new Set(validationErrors.map(err => err.type));
    function getBorderCss(activatingErrors: ValidationErrorType[]) {
        return activatingErrors.some(errType => validationErrorTypes.has(errType)) ? " border-warning-darker" : "";
    }

    let className = "EventEditor";
    if (exportState.successUrl.length > 0) {
        className += " EventEditor-bg-success";
    } else if (exportState.isInBatchExport(validationErrors.length > 0)) {
        className += " EventEditor-bg-highlighted";
    } else {
        className += " bg-light";
    }

    return <EditorLayout
        className={className}

        renderLegend={cssClasses => <EditorLegend className={cssClasses} eventType={inputs.type} index={index} />}

        renderCol0={cssClasses => <div className={cssClasses + " d-flex align-items-center"}>
            <input
                id={checkboxId}
                aria-label="Select event"
                className="form-check-input m-0 fs-5"
                type="checkbox"
                checked={editorState.exportState.isSelected}
                onChange={toggleSelection}
            />
        </div>}

        renderCol1={cssClasses => <div className={cssClasses}>
            <LabeledInput
                className="input-group"
                renderLabel={inputId => <label htmlFor={inputId} className="input-group-text" >
                    Name
                </label>}
                renderInput={id => <input
                    id={id}
                    type="text"
                    className={"form-control flex-grow-1" + getBorderCss([ValidationErrorType.BadName])}
                    value={inputs.name}
                    placeholder="Event name"
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                    onChange={e => dispatchChange({ name: e.currentTarget.value })}
                />}
            />
            <LabeledInput
                className="input-group mt-1"
                renderLabel={inputId => <label htmlFor={inputId} className="input-group-text" >
                    Location
                </label>}
                renderInput={id => <input
                    id={id}
                    type="text"
                    className="form-control flex-grow-1"
                    value={inputs.location}
                    placeholder="Location"
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                    onChange={e => dispatchChange({ location: e.currentTarget.value })}
                />}
            />
        </div>}

        renderCol2={cssClasses => <div className={cssClasses}>
            {inputs.type === WebstacEventType.Course ?
                <RepeatingDaysSelector
                    selectedDays={inputs.repeatingDays}
                    disabled={isReadOnly}
                    onChange={newSelection => dispatchChange({ repeatingDays: newSelection })}
                />
                :
                <input
                    type="text"
                    aria-label="Date"
                    className={"form-control" + getBorderCss([ValidationErrorType.BadDate])}
                    size={DATE_INPUT_SIZE}
                    maxLength={DATE_INPUT_SIZE + 2}
                    value={inputs.date.raw}
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                    onChange={e => dispatchChange({ date: new EventDateInput(e.currentTarget.value) })}
                />
            }
            <StartEndTimeInputs
                values={inputs}
                isReadOnly={isReadOnly}
                startClassName={getBorderCss([ValidationErrorType.BadStartTime, ValidationErrorType.EndBeforeStart])}
                endClassName={getBorderCss([ValidationErrorType.BadEndTime, ValidationErrorType.EndBeforeStart])}
                onChange={dispatchChange}
            />
        </div>}

        renderCol3={cssClasses => <EditorExportControls
            exportState={exportState}
            className={cssClasses}
            disabled={isExportDisabled}
            onExportClicked={() => onExportClicked(editorState)}
        />}

        renderValidationErrors={cssClasses => {
            if (validationErrors.length <= 0) {
                return null;
            }

            return <ValidationErrorDisplay
                errors={validationErrors}
                containerClassName={cssClasses + " text-warning-darker"}
            />;
        }}

        renderExportErrors={cssClasses => {
            if (!exportState.errorMessage) {
                return null;
            }

            return <div className={cssClasses}>
                <div className="alert alert-danger float-end d-inline-block py-2 px-3 mb-0" role="status">
                    <FontAwesomeIcon className="me-1" icon={faTriangleExclamation} /> Error while
                    adding: {exportState.errorMessage}
                </div>
            </div>;
        }}
    />;
});
