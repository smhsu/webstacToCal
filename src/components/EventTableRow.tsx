import * as React from "react";
import { EventInputModel, EventInputButtonState } from "../EventInputModel";
import ErrorButton from "./ErrorButton";
import { ApiHttpError } from "../CalendarApi";
import ValidationError from "../ValidationError";

interface EventTableRowProps {
    /**
     * Object containing all the information needed to render.
     */
    model: EventInputModel;

    /**
     * Called when the user modified any of the inputs in the row.
     * 
     * @param {Pick<EventInputModel, K>} propsToChange - props that should be merged into the model passed via props
     */
    onModelChangeRequested?<K extends keyof EventInputModel>(propsToChange: Pick<EventInputModel, K>): void;

    /**
     * Called when the user presses the row's "add to calendar" button.
     */
    onAddButtonPressed?(): void;
}

const inputSizes = {
    DATE: 9,
    TIME: 5,
    NAME: 35,
    LOCATION: 30
};

/**
 * Renders a single row of EventTable.  This component is completely controlled.
 * 
 * @param {EventTableRowProps} props
 * @author Silas Hsu
 */
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
        <td><RowButton {...props} /></td>
    </tr>
    );
}

/**
 * Renders the button under the "Add to calendar" column.
 * 
 * @param {EventTableRowProps} props - same props passed to EventTableRow
 */
function RowButton(props: EventTableRowProps): JSX.Element {
    switch (props.model.buttonState) {
        case EventInputButtonState.loading:
            return <button className="btn btn-light" disabled={true}>Working...</button>;
        case EventInputButtonState.success:
            return (
            <a className="btn btn-success" href={props.model.successUrl || undefined} target="_blank">
                <i className="fa fa-check" aria-hidden="true" />Added!
            </a>
            );
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
            return <ErrorButton tooltip={tooltip} onClick={props.onAddButtonPressed}>Failed - retry?</ErrorButton>;
        case EventInputButtonState.normal:
        default:
            return <button onClick={props.onAddButtonPressed}><img src="img/gcbutton.gif" /></button>;
    }
}

export default EventTableRow;
