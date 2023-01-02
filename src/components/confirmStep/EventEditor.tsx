import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { IWebstacEvent, WebstacEventType } from "../../eventModel/IWebstacEvent";
import { RepeatingDaysSelector } from "./RepeatingDaysSelector";
import "./EventEditor.css";

const DATE_INPUT_SIZE = 12;
const TIME_INPUT_SIZE = 8;
const CENTERING_CSS = "d-flex flex-column justify-content-center align-items-center";

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
    const validationErrors = [];
    const dispatchChange = (changes: Partial<IWebstacEvent>) => {
        onChange(Object.assign({}, calendarEvent, changes));
    };

    let eventNameLabel;
    let eventNamePlaceholder;
    let dateLabel;
    switch (calendarEvent.type) {
        case WebstacEventType.Course:
            eventNameLabel = "Class name";
            eventNamePlaceholder = "Untitled class";
            dateLabel = "Days";
            break;
        case WebstacEventType.Exam:
            eventNameLabel = "Final name";
            eventNamePlaceholder = "Untitled exam";
            dateLabel = "Date";
            break;
        default:
            eventNameLabel = "Event name";
            eventNamePlaceholder = "Untitled event";
            dateLabel = "Date";
    }

    let selectionBox = <div className={"col-sm-1 col-2 order-sm-first order-1 " + CENTERING_CSS}>
        {validationErrors.length === 0 ?
            <>
                <label className="d-block">Select</label>
                <input type="checkbox" className="form-check-input" />
            </>
            :
            <>
                <span className="text-danger">Invalid</span>
                <FontAwesomeIcon icon={faTriangleExclamation} className="text-danger" />
            </>
        }
    </div>;

    return <div className="EventEditor border-bottom pt-4 pt-sm-2 pb-4 pb-sm-3">
        <div className="row">
            {selectionBox}

            <div className="col-lg-7 col-sm-5 col-12">
                <label className="d-block">{eventNameLabel}</label>
                <input
                    type="text"
                    className="w-100"
                    value={calendarEvent.name}
                    placeholder={eventNamePlaceholder}
                    onChange={e => dispatchChange({ name: e.currentTarget.value })}
                />
                <label className="d-block">Location</label>
                <input
                    type="text"
                    className="w-100"
                    value={calendarEvent.location}
                    onChange={e => dispatchChange({ location: e.currentTarget.value })}
                />
            </div>

            <div className="col-lg-3 col-sm-4 col-7">
                <label className="d-block">{dateLabel}</label>
                {calendarEvent.type === WebstacEventType.Course ?
                    <RepeatingDaysSelector
                        selectedDays={calendarEvent.repeatingDays}
                        onChange={newSelection => dispatchChange({ repeatingDays: newSelection })}
                    />
                    :
                    <input
                        type="text"
                        size={DATE_INPUT_SIZE}
                        maxLength={DATE_INPUT_SIZE + 2}
                        value={calendarEvent.date}
                        onChange={e => dispatchChange({ date: e.currentTarget.value })}
                    />
                }

                <div className="d-flex gap-2">
                    <div>
                        <label className="d-block">Start time</label>
                        <input
                            type="text"
                            size={TIME_INPUT_SIZE}
                            maxLength={TIME_INPUT_SIZE + 2}
                            value={calendarEvent.startTime}
                            onChange={e => dispatchChange({
                                startTime: e.currentTarget.value
                            })}
                        />
                    </div>
                    <div>
                        <label className="d-block">End time</label>
                        <input
                            type="text"
                            size={TIME_INPUT_SIZE}
                            maxLength={TIME_INPUT_SIZE + 2}
                            value={calendarEvent.endTime}
                            onChange={e => dispatchChange({
                                endTime: e.currentTarget.value
                            })}
                        />
                    </div>
                </div>
            </div>

            <div className={"col-lg-1 col-2 order-last " + CENTERING_CSS}>
                <button className="btn btn-primary"><FontAwesomeIcon icon={faCloudArrowUp} /></button>
            </div>
        </div>
    </div>;
}
