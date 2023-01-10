import React from "react";
import { IWebstacEventData } from "src/eventLogic/IWebstacEvent";
import { WebstacTime } from "src/eventLogic/WebstacTime";
import { LabeledInput } from "./LabeledInput";

const TIME_INPUT_SIZE = 8;

interface IStartEndTimeInputsProps {
    data: IWebstacEventData;
    startClassName?: string;
    endClassName?: string;
    isReadOnly?: boolean;
    onChange: (updates: Partial<IWebstacEventData>) => void;
}

export function StartEndTimeInputs(props: IStartEndTimeInputsProps) {
    const { data, startClassName, isReadOnly, endClassName, onChange } = props;
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
                value={data.startTime.raw}
                onChange={e => onChange({ startTime: new WebstacTime(e.currentTarget.value) })}
            />}
        />
        <LabeledInput
            renderLabel="End time"
            renderInput={id => <input
                id={id}
                {...commonProps}
                className={"form-control" + (endClassName || "")}
                value={data.endTime.raw}
                onChange={e => onChange({ endTime: new WebstacTime(e.currentTarget.value) })}
            />}
        />
    </div>;
}
