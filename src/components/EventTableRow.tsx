import ParsedEventModel from "../ParsedEventModel";
import * as React from "react";

interface EventTableRowProps {
    model: ParsedEventModel;
}

const TIME_INPUT_SIZE = 4;

function EventTableRow(props: EventTableRowProps): JSX.Element {
    let dayCheckboxes = props.model.repeatingDays.map((isRepeat, index) =>
        <input type="checkbox" key={index} checked={isRepeat}/>
    );
    return (
    <tr>
        <td><input type="text" value={props.model.name} /></td>
        <td>{dayCheckboxes}</td>
        <td>
            <input type="text" value={props.model.startTime} size={TIME_INPUT_SIZE} /> -
            <input type="text" value={props.model.endTime} size={TIME_INPUT_SIZE} />
        </td>
        <td><input type="text" value={props.model.location} /></td>
        <td><button>Button!</button></td>
    </tr>
    );
}

export default EventTableRow;
