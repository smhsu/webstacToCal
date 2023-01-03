import React, { ReactNode, useId } from "react";
import "./FancyRadioButton.css";

const UNCHECKED_CSS_CLASSES = "FancyRadioButton-unchecked";
const CHECKED_CSS_CLASSES = "FancyRadioButton-checked";
const DISABLED_CSS_CLASSES = "FancyRadioButton-disabled text-body text-opacity-50";

interface IFancyRadioButtonProps {
    majorText: ReactNode;
    minorText?: ReactNode;
    name?: string;
    value?: string;
    checked?: boolean;
    disabled?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FancyRadioButton(props: IFancyRadioButtonProps) {
    const { majorText, minorText, name, value, checked, disabled, onChange } = props;
    const id = useId();
    let containerClasses = "d-flex align-items-start p-2 gap-2 rounded ";
    if (disabled) {
        containerClasses += DISABLED_CSS_CLASSES;
    } else if (checked) {
        containerClasses += CHECKED_CSS_CLASSES;
    } else {
        containerClasses += UNCHECKED_CSS_CLASSES;
    }

    return <label htmlFor={id} className={containerClasses}>
        <div>
            <input
                id={id}
                type="radio"
                style={{ height: "1rem" }}
                name={name}
                value={value}
                checked={checked}
                disabled={disabled}
                onChange={onChange}
            />
        </div>
        <div>
            <div className="fw-bold">{majorText}</div>
            {minorText && <div className="fst-italic" style={{ fontSize: "smaller" }}>{minorText}</div>}
        </div>
    </label>;
}
