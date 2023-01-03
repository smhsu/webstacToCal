import React from "react";
import { DayOfWeek } from "../../eventLogic/DayOfWeek";
import "./RepeatingDaysSelector.css";

interface IRepeatingDaysSelectorProps {
    selectedDays: Set<DayOfWeek>;
    onChange: (newSelection: Set<DayOfWeek>) => void;
}

export function RepeatingDaysSelector(props: IRepeatingDaysSelectorProps) {
    const { selectedDays, onChange } = props;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, day: DayOfWeek) => {
        if (e.key === " ") {
            e.preventDefault();
            handleToggle(day);
        }
    };

    const handleToggle = (day: DayOfWeek) => {
        const newSet = new Set(selectedDays);
        if (selectedDays.has(day)) {
            newSet.delete(day);
        } else {
            newSet.add(day);
        }
        onChange?.(newSet);
    };

    const checkboxes = [];
    for (const day of Object.values(DayOfWeek) as number[]) {
        const dayFullName = DayOfWeek[day];
        const isChecked = props.selectedDays.has(day);
        const className = "RepeatingDaysSelector-box btn p-0 rounded-0 align-baseline " +
            (isChecked ? "btn-primary" : "btn-outline-primary");
        checkboxes.push(<div
            key={day}
            className={className}
            role="checkbox"
            aria-checked={isChecked}
            aria-label={dayFullName}
            tabIndex={0}
            onClick={() => handleToggle(day)}
            onKeyDown={e => handleKeyDown(e, day)}
        >
            <span role="presentation">{dayFullName[0] /* Just the first character */}</span>
        </div>);
    }

    return <fieldset>
        <legend>Repeat every week on...</legend>
        <div className="RepeatingDaysSelector-box-row">
            {checkboxes}
            {/* An invisible text input so the height of things are still consistent */}
            <input type="text" className="form-control d-inline invisible" style={{ width: "1px" }} />
        </div>
    </fieldset>;
}
