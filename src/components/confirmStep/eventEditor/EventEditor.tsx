import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import { IEventEditorState } from "src/eventLogic/IEventEditorState";
import { IValidationError, ValidationErrorType } from "src/eventLogic/IValidationError";
import { IEventInputs, WebstacEventType } from "src/eventLogic/IEventInputs";
import { EventDateInput } from "src/eventLogic/EventDateInput";

import { EditorLegend } from "./EditorLegend";
import { LabeledInput } from "./LabeledInput";
import { RepeatingDaysSelector } from "./RepeatingDaysSelector";
import { ValidationErrorDisplay } from "./ValidationErrorDisplay";
import { EditorLayout } from "src/components/confirmStep/eventEditor/EditorLayout";
import { StartEndTimeInputs } from "./StartEndTimeInputs";
import { EditorExportControls } from "./EditorExportControls";
import "./EventEditor.css";

const DATE_INPUT_SIZE = 12;

interface IEventEditorProps {
    editorState: IEventEditorState;
    validationErrors: IValidationError[];
    index: number;
    onChange: (updated: IEventEditorState) => void;
    onExportClicked: (toExport: IEventEditorState) => void;
}

/**
 * After giving this a lot of thought, I have arrived at the conclusion that <input type="text" /> is best for date
 * and time inputs, i.e. no date or time pickers.  Pickers are best for the situation where the user makes a choice and
 * can peruse alternatives, but in our case, the date and times are already known.
 *
 * @param props
 */
export const EventEditor = function EventEditor(props: IEventEditorProps) {
    const { editorState, validationErrors, index, onChange, onExportClicked } = props;
    const { inputs, isSelected, exportState } = editorState;
    const dispatchChange = function<T extends IEventInputs>(updatedInputs: Partial<T>) {
        onChange({
            ...editorState,
            inputs: {
                ...inputs,
                ...updatedInputs
            }
        });
    };

    // Some helpers and properties
    const isReadOnly = exportState.isExporting || exportState.successUrl.length > 0;
    const isExportDisabled = isReadOnly || validationErrors.length > 0;
    const validationErrorTypes = new Set(validationErrors.map(err => err.type));
    function getBorderCss(activatingErrors: ValidationErrorType[]) {
        return activatingErrors.some(errType => validationErrorTypes.has(errType)) ? " border-warning-darker" : "";
    }

    return <EditorLayout
        className={isSelected && validationErrors.length === 0 ? "EventEditor-bg-highlighted" : "bg-light"}

        renderLegend={cssClasses => <EditorLegend className={cssClasses} eventType={inputs.type} index={index} />}

        renderCol1={cssClasses => <div className={cssClasses}>
            <LabeledInput
                renderLabel="Name"
                renderInput={id => <input
                    id={id}
                    type="text"
                    className={"form-control" + getBorderCss([ValidationErrorType.BadName])}
                    value={inputs.name}
                    placeholder="Enter a name"
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                    onChange={e => dispatchChange({ name: e.currentTarget.value })}
                />}
            />
            <LabeledInput
                renderLabel="Location"
                renderInput={id => <input
                    id={id}
                    type="text"
                    className="form-control"
                    value={inputs.location}
                    placeholder="Enter a location"
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
                    legendClassName="EventEditor-repeating-days-legend"
                    disabled={isReadOnly}
                    onChange={newSelection => dispatchChange({ repeatingDays: newSelection })}
                />
                :
                <LabeledInput
                    renderLabel="Date"
                    renderInput={id => <input
                        id={id}
                        type="text"
                        className={"form-control w-auto" + getBorderCss([ValidationErrorType.BadDate])}
                        size={DATE_INPUT_SIZE}
                        maxLength={DATE_INPUT_SIZE + 2}
                        value={inputs.date.raw}
                        readOnly={isReadOnly}
                        onChange={e => dispatchChange({ date: new EventDateInput(e.currentTarget.value) })}
                    />}
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
            isSelectedForExport={isSelected}
            className={cssClasses}
            disabled={isExportDisabled}
            onExportClicked={() => onExportClicked(editorState)}
            onSelectionToggle={() => onChange( { ...editorState, isSelected: !editorState.isSelected })}
        />}

        renderValidationErrors={cssClasses => <ValidationErrorDisplay
            errors={validationErrors}
            containerClassName={cssClasses + " text-warning-darker"}
        />}

        renderExportErrors={cssClasses => <div className={cssClasses}>
            {exportState.errorMessage &&
                <div className="alert alert-danger float-end d-inline-block py-2 px-3 mb-0" role="status">
                    <FontAwesomeIcon className="me-1" icon={faTriangleExclamation} /> Error while
                    adding: {exportState.errorMessage}
                </div>
            }
        </div>}
    />;
};