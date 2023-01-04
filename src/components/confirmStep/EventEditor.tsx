import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import { IEventEditorState } from "src/eventLogic/IEventEditorState";
import { IValidationError, ValidationErrorType } from "src/eventLogic/IValidationError";
import { IWebstacEvent, WebstacEventType } from "src/eventLogic/IWebstacEvent";

import { LabeledInput } from "./LabeledInput";
import { RepeatingDaysSelector } from "./RepeatingDaysSelector";
import { ValidationErrorDisplay } from "./ValidationErrorDisplay";
import { EventEditorLayout } from "./EventEditorLayout";
import { StartEndTimeInputs } from "./StartEndTimeInputs";
import { EditorExportControls } from "./EditorExportControls";
import "./EventEditor.css";

const DATE_INPUT_SIZE = 12;

interface IEventEditorProps {
    editorState: IEventEditorState;
    validationErrors: IValidationError[];
    index: number;
    onChange: (updatedState: IEventEditorState) => void;
    onExportClicked: () => void;
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
    const { data, isSelected, exportState } = editorState;
    const dispatchChange = function<T extends IWebstacEvent>(updatedData: Partial<T>) {
        onChange({
            ...props.editorState,
            data: {
                ...data,
                ...updatedData
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

    return <EventEditorLayout
        renderLegend={cssClasses => <legend
            className={cssClasses + " d-flex flex-column justify-content-center align-items-center m-0"}
        >
            <span style={{ fontSize: "small" }}>{"Event"}</span>
            <span className="fs-5">{index + 1}</span>
        </legend>}

        renderCol1={cssClasses => <div className={cssClasses}>
            <LabeledInput
                renderLabel="Event name"
                renderInput={id => <input
                    id={id}
                    type="text"
                    className={"form-control" + getBorderCss([ValidationErrorType.BadName])}
                    value={data.name}
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
                    value={data.location}
                    placeholder="Enter a location"
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                    onChange={e => dispatchChange({ location: e.currentTarget.value })}
                />}
            />
        </div>}

        renderCol2={cssClasses => <div className={cssClasses}>
            {data.type === WebstacEventType.Course ?
                <RepeatingDaysSelector
                    selectedDays={data.repeatingDays}
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
                        value={data.date}
                        readOnly={isReadOnly}
                        onChange={e => dispatchChange({ date: e.currentTarget.value })}
                    />}
                />
            }
            <StartEndTimeInputs
                data={data}
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
            onExportClicked={onExportClicked}
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
