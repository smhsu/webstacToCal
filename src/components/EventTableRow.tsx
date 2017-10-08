import ParsedEventModel from "../ParsedEventModel";
import * as React from "react";
import * as _ from "lodash";

interface EventTableRowProps {
    model: ParsedEventModel;
    isExam?: boolean;
    error?: boolean;
    onModelChangeRequested?(newModel: ParsedEventModel): void;
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
    const buttonCallback = props.onAddButtonPressed || (() => undefined);

    const requestModelChange = function(propsToChange: Partial<ParsedEventModel>) {
        let newModel = _.cloneDeep(props.model);
        newModel = Object.assign(newModel, propsToChange);
        modelChangeCallback(newModel);
    };

    const makeCheckboxes = function() {
        return model.repeatingDays.map((isRepeat, index) => (
            <input
                type="checkbox"
                key={index}
                checked={isRepeat}
                onChange={event => checkboxCallback(index, event.target.checked)}
            />)
        );
    };

    const checkboxCallback = function(index: number, value: boolean) {
        let newModel = _.cloneDeep(props.model);
        newModel.repeatingDays[index] = value;
        modelChangeCallback(newModel);
    };

    return (
    <tr>
        <td> {/* Name */}
            <input
                type="text"
                value={model.name}
                size={inputSizes.NAME}
                onChange={event => requestModelChange({name: event.target.value})}
            />
        </td>
        <td>
        { 
            props.isExam ? // Exam: date input
            <input
                type="text"
                value={model.date}
                size={inputSizes.DATE}
                onChange={event => requestModelChange({date: event.target.value})}
            />
            : makeCheckboxes() // Not exam: checkboxes for repeating days
        }
        </td>
        <td> {/* Start and end times */}
            <input 
                type="text"
                value={model.startTime}
                size={inputSizes.TIME}
                onChange={event => requestModelChange({startTime: event.target.value})}
            />
            -
            <input
                type="text"
                value={model.endTime}
                size={inputSizes.TIME}
                onChange={event => requestModelChange({endTime: event.target.value})}
            />
        </td>
        <td> {/* Location */}
            <input
                type="text"
                value={model.location}
                size={inputSizes.LOCATION}
                onChange={event => requestModelChange({location: event.target.value})}
            />
        </td>
        <td><button onClick={buttonCallback}>Button!</button></td>
    </tr>
    );
}

export default EventTableRow;
