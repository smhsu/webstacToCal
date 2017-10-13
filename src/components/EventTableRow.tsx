import * as React from "react";
import { EventInputModel, EventInputButtonState } from "../EventInputModel";
import ErrorButton from "./ErrorButton";
import { ApiHttpError } from "../CalendarApi";
import ValidationError from "../ValidationError";

interface EventTableRowProps {
    model: EventInputModel;
    onModelChangeRequested?<K extends keyof EventInputModel>(propsToChange: Pick<EventInputModel, K>): void;
    onAddButtonPressed?(): void;
}

const inputSizes = {
    DATE: 9,
    TIME: 4,
    NAME: 35,
    LOCATION: 30
};

function EventTableRow(props: EventTableRowProps): JSX.Element {
    const model = props.model;
    const modelChangeCallback = props.onModelChangeRequested || (() => undefined);

    const checkboxCallback = function(index: number, value: boolean) {
        let newRepeatingDays = props.model.repeatingDays.slice();
        newRepeatingDays[index] = value;
        modelChangeCallback({repeatingDays: newRepeatingDays});
    };

    const renderCheckboxes = function() {
        return model.repeatingDays.map((isRepeat, index) => (
            <input
                type="checkbox"
                key={index}
                checked={isRepeat}
                onChange={event => checkboxCallback(index, event.target.checked)}
            />)
        );
    };

    let button = null;
    switch (props.model.buttonState) {
        case EventInputButtonState.loading:
            button = <button className="btn btn-light" disabled={true}>Working...</button>;
            break;
        case EventInputButtonState.success:
            button = (
                <a className="btn btn-success" href={model.successUrl || undefined} target="_blank">
                    <i className="fa fa-check" aria-hidden="true" />Added!
                </a>
            );
            break;
        case EventInputButtonState.error:
            const error = props.model.error;
            let tooltip;
            if (error instanceof ValidationError || error instanceof ApiHttpError) {
                tooltip = error.message;
            } else {
                tooltip = "Unexpected error (bug?) -- Check developers' console for technical details.";
                if (error == null) {
                    window.console.error(
                        "Button state was set to error, but model.error is empty.  Are you setting state correctly?"
                    );
                }
            }
            button = <ErrorButton tooltip={tooltip} onClick={props.onAddButtonPressed}>Failed - retry?</ErrorButton>;
            break;
        case EventInputButtonState.normal:
        default:
            button = <button onClick={props.onAddButtonPressed}><img src="img/gcbutton.gif" /></button>;
    }

    return (
    <tr>
        <td> {/* Name */}
            <input
                type="text"
                value={model.name}
                size={inputSizes.NAME}
                onChange={event => modelChangeCallback({name: event.target.value})}
            />
        </td>
        <td>
        { 
            props.model.isCourse ? // Course: checkboxes for repeating days
                renderCheckboxes() 
                : // Otherwise: date input
                <input
                    type="text"
                    value={model.date}
                    size={inputSizes.DATE}
                    onChange={event => modelChangeCallback({date: event.target.value})}
                />
        }
        </td>
        <td> {/* Start and end times */}
            <input 
                type="text"
                value={model.startTime}
                size={inputSizes.TIME}
                onChange={event => modelChangeCallback({startTime: event.target.value})}
            />
            -
            <input
                type="text"
                value={model.endTime}
                size={inputSizes.TIME}
                onChange={event => modelChangeCallback({endTime: event.target.value})}
            />
        </td>
        <td> {/* Location */}
            <input
                type="text"
                value={model.location}
                size={inputSizes.LOCATION}
                onChange={event => modelChangeCallback({location: event.target.value})}
            />
        </td>
        <td>{button}</td>
    </tr>
    );
}

export default EventTableRow;
