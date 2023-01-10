import React from "react";
import { IEventInputs } from "src/eventLogic/IEventInputs";
import { EventTimeInput } from "src/eventLogic/EventTimeInput";
import { LabeledInput } from "./LabeledInput";

const TIME_INPUT_SIZE = 8;

interface IStartEndTimeInputsProps {
    values: IEventInputs;
    startClassName?: string;
    endClassName?: string;
    isReadOnly?: boolean;
    onChange: (updates: Partial<IEventInputs>) => void;
}

export function StartEndTimeInputs(props: IStartEndTimeInputsProps) {
    const { values, startClassName, isReadOnly, endClassName, onChange } = props;
    const commonProps: React.InputHTMLAttributes<HTMLInputElement> = {
        type: "text",
        size: TIME_INPUT_SIZE,
        maxLength: TIME_INPUT_SIZE + 2,
        readOnly: isReadOnly,
        disabled: isReadOnly
    };

    return <div className="d-flex gap-2">
        <LabeledInput
            renderLabel="Start time"
            renderInput={id => <input
                id={id}
                {...commonProps}
                className={"form-control" + (startClassName || "")}
                value={values.startTime.raw}
                onChange={e => onChange({ startTime: new EventTimeInput(e.currentTarget.value) })}
            />}
        />
        <LabeledInput
            renderLabel="End time"
            renderInput={id => <input
                id={id}
                {...commonProps}
                className={"form-control" + (endClassName || "")}
                value={values.endTime.raw}
                onChange={e => onChange({ endTime: new EventTimeInput(e.currentTarget.value) })}
            />}
        />
    </div>;
}
