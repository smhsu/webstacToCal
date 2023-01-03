import React, { useId } from "react";

type RestrictedInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "id">
type LabeledInputProps = RestrictedInputProps & {
    labelText: React.ReactNode,
    labelClassName?: string
}

export function LabeledInput(props: LabeledInputProps) {
    const id = useId();
    const { labelText, labelClassName, ...rest } = props;
    return <>
        <div><label htmlFor={id} className={labelClassName}>{labelText}</label></div>
        <input id={id} {...rest} />
    </>;
}
