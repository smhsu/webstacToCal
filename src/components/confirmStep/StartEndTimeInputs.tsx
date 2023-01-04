import { LabeledInput } from "components/confirmStep/LabeledInput";
import { IWebstacEvent } from "eventLogic/IWebstacEvent";
import React from "react";

const TIME_INPUT_SIZE = 8;

interface IStartEndTimeInputsProps {
    data: IWebstacEvent;
    startClassName?: string;
    endClassName?: string;
    isReadOnly?: boolean;
    onChange: (updates: Partial<IWebstacEvent>) => void;
}

export function StartEndTimeInputs(props: IStartEndTimeInputsProps) {
    const { data, startClassName, isReadOnly, endClassName, onChange } = props;
    return <div className="d-flex gap-2">
        <LabeledInput
            renderLabel="Start time"
            renderInput={id => <input
                id={id}
                type="text"
                className={"form-control" + (startClassName || "")}
                size={TIME_INPUT_SIZE}
                maxLength={TIME_INPUT_SIZE + 2}
                value={data.startTime}
                readOnly={isReadOnly}
                disabled={isReadOnly}
                onChange={e => onChange({ startTime: e.currentTarget.value })}
            />}
        />
        <LabeledInput
            renderLabel="End time"
            renderInput={id => <input
                id={id}
                type="text"
                className={"form-control" + (endClassName || "")}
                size={TIME_INPUT_SIZE}
                maxLength={TIME_INPUT_SIZE + 2}
                value={data.endTime}
                readOnly={isReadOnly}
                disabled={isReadOnly}
                onChange={e => onChange({ endTime: e.currentTarget.value })}
            />}
        />
    </div>;
}
