import React from "react";
import { IEventInputs } from "src/eventLogic/IEventInputs";
import { EventTimeInput } from "src/eventLogic/EventTimeInput";

const TIME_INPUT_SIZE = 6;

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

    return <div className="d-flex gap-1 align-items-baseline mt-1">
        <input
            {...commonProps}
            aria-label="Start time"
            className={"form-control px-1" + (startClassName || "")}
            value={values.startTime.raw}
            onChange={e => onChange({ startTime: new EventTimeInput(e.currentTarget.value) })}
        />
        to
        <input
            {...commonProps}
            aria-label="End time"
            className={"form-control px-1" + (endClassName || "")}
            value={values.endTime.raw}
            onChange={e => onChange({ endTime: new EventTimeInput(e.currentTarget.value) })}
        />
    </div>;
}
