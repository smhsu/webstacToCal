import React, { useId } from "react";

interface ILabeledInputProps {
    className?: string;
    renderLabel: ((inputId: string) => JSX.Element) | string;
    renderInput: (id: string) => JSX.Element;
    isPutLabelSecond?: boolean;
}

export function LabeledInput(props: ILabeledInputProps) {
    const id = useId();
    const { className, renderLabel, renderInput } = props;

    let label;
    if (typeof(renderLabel) === "string") {
        label = <label htmlFor={id}>{renderLabel}</label>;
    } else {
        label = renderLabel(id);
    }

    return <div className={className} >
        {label}
        {renderInput(id)}
    </div>;
}
