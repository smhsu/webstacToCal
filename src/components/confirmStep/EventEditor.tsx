import React, { useId } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";

import { RepeatingDaysSelector } from "./RepeatingDaysSelector";
import { LabeledInput } from "./LabeledInput";
import { ValidationErrorDisplay } from "./ValidationErrorDisplay";

import { IWebstacEvent, WebstacEventType } from "../../eventModel/IWebstacEvent";
import { EventValidator } from "../../eventExport/EventValidator";
import { ValidationErrorType } from "../../eventExport/IValidationError";

import "./EventEditor.css";

const DATE_INPUT_SIZE = 12;
const TIME_INPUT_SIZE = 8;

interface IEventEditorProps {
    calendarEvent: IWebstacEvent;
    onChange: (updatedCalendarEvent: IWebstacEvent) => void;
}

/**
 * After giving this a lot of thought, I have arrived at the conclusion that <input type="text" /> is best for date
 * and time inputs, i.e. no date or time pickers.  The reason is
 * @param props
 * @constructor
 */
export function EventEditor(props: IEventEditorProps) {
    const { calendarEvent, onChange } = props;
    const checkboxId = useId();
    const validationErrors = new EventValidator().validate(calendarEvent);
    const dispatchChange = (changes: Partial<IWebstacEvent>) => {
        onChange(Object.assign({}, calendarEvent, changes));
    };
    const errorTypes = new Set(validationErrors.map(error => error.type));

    const cursorNotAllowedCss = validationErrors.length > 0 ? " cursor-not-allowed " : "";
    function getBorderCss(activatingErrors: ValidationErrorType[]) {
        return activatingErrors.some(type => errorTypes.has(type)) ? " border-warning-darker" : "";
    }


    let userReadableEventType;
    let dateField;
    if (calendarEvent.type === WebstacEventType.Exam) {
        userReadableEventType = "Final";
        dateField = <LabeledInput
            labelText="Date"
            type="text"
            className={"form-control w-auto" + getBorderCss([ValidationErrorType.BadDate])}
            size={DATE_INPUT_SIZE}
            maxLength={DATE_INPUT_SIZE + 2}
            value={calendarEvent.date}
            onChange={e => dispatchChange({ date: e.currentTarget.value })}
        />;
    } else {
        userReadableEventType = "Class";
        dateField = <RepeatingDaysSelector
            selectedDays={calendarEvent.repeatingDays}
            onChange={newSelection => dispatchChange({ repeatingDays: newSelection })}
        />;
    }

    return <fieldset className="EventEditor border border-secondary p-3 pb-4 bg-light">
        <legend className="visually-hidden">
            Edit {calendarEvent.name || "Untitled " + userReadableEventType}
        </legend>

        <div className="row">
            {/* Name and Location */}
            <div className="col-md col-12">
                <LabeledInput // "col-xxl-7 col-xl-6 col-lg-5 col-md-5 col-10"
                    labelText={userReadableEventType + " name"}
                    type="text"
                    className={"form-control" + getBorderCss([ValidationErrorType.BadName])}
                    value={calendarEvent.name}
                    placeholder="Enter a name"
                    onChange={e => dispatchChange({ name: e.currentTarget.value })}
                />
                <LabeledInput
                    labelText="Location"
                    type="text"
                    className="form-control"
                    value={calendarEvent.location}
                    placeholder="Enter a location"
                    onChange={e => dispatchChange({ location: e.currentTarget.value })}
                />
            </div>

            <SmallScreenColBreak />

            {/* Time inputs */}
            <div className="col-auto mt-2 mt-md-auto">
                {dateField}

                <div className="d-flex gap-2">
                    <div>
                        <LabeledInput
                            labelText="Start time"
                            type="text"
                            className={"form-control" +
                                getBorderCss([ValidationErrorType.BadStartTime, ValidationErrorType.EndBeforeStart])
                            }
                            size={TIME_INPUT_SIZE}
                            maxLength={TIME_INPUT_SIZE + 2}
                            value={calendarEvent.startTime}
                            onChange={e => dispatchChange({ startTime: e.currentTarget.value })}
                        />
                    </div>
                    <div>
                        <LabeledInput
                            labelText="End time"
                            type="text"
                            className={"form-control" +
                                getBorderCss([ValidationErrorType.BadEndTime, ValidationErrorType.EndBeforeStart])
                            }
                            size={TIME_INPUT_SIZE}
                            maxLength={TIME_INPUT_SIZE + 2}
                            value={calendarEvent.endTime}
                            onChange={e => dispatchChange({ endTime: e.currentTarget.value })}
                        />
                    </div>
                </div>
            </div>

            <ValidationErrorDisplay
                errors={validationErrors}
                containerClassName="d-md-none col mt-3 text-warning-darker" // Only visible at small screen sizes
            />

            <SmallScreenColBreak />

            <div className="col-xl-2 col-md-3 col d-flex flex-column gap-2 align-items-md-center pt-3">
                <div>
                    <button
                        className={"btn btn-primary" + cursorNotAllowedCss}
                        disabled={validationErrors.length > 0}
                    >
                        <FontAwesomeIcon icon={faCloudArrowUp} className="me-2" />
                        {validationErrors.length > 0 ?
                            <span className="spinner-border spinner-border-sm">
                                <span className="visually-hidden">Working...</span>
                            </span>
                            :
                            "Add"
                        }
                    </button>
                </div>

                <div className="d-flex gap-2 align-items-center justify-content-md-center">
                    <div><input
                        id={checkboxId}
                        type="checkbox"
                        className={"form-check-input" + cursorNotAllowedCss}
                        checked={calendarEvent.isSelected}
                        disabled={validationErrors.length > 0}
                        onChange={() => dispatchChange({ isSelected: !calendarEvent.isSelected })}
                    /></div>
                    <label htmlFor={checkboxId} className={cursorNotAllowedCss} >
                        Include when adding all
                    </label>

                </div>
            </div>
        </div> {/* End row */}


        {validationErrors.length > 0 && // Only visible at md breakpoint and above
            <ValidationErrorDisplay
                errors={validationErrors}
                containerClassName="text-warning-darker d-md-block d-none mt-3"
            />
        }

    </fieldset>;
}

function SmallScreenColBreak() {
    return <div className="w-100 d-block d-md-none" />;
}


/*
<input
                        id={checkboxId}
                        type="checkbox"
                        className={"form-check-input" + cursorNotAllowedCss}
                        checked={calendarEvent.isSelected}
                        disabled={validationErrors.length > 0}
                        onChange={() => dispatchChange({ isSelected: !calendarEvent.isSelected })}
                    />
                    <label htmlFor={checkboxId} className={cursorNotAllowedCss} style={{ width: "15ch", flex: "none" }}>
                        Include when adding all
                    </label>

 */
