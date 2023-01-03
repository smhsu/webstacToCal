import { DateTime } from "luxon";
import { FancyRadioButton } from "./FancyRadioButton";
import { ISemester } from "../../eventLogic/ISemester";

export const SEMESTERS: ISemester[] = [
    {
        name: "SP23",
        firstDayOfClasses: DateTime.fromISO(""),
        lastDayOfClasses: DateTime.fromISO("")
    }
];

interface ISemesterSelectorProps {
    value: ISemester | null;
    onChange: (newSemester: ISemester) => void;
}

export function SemesterSelector(props: ISemesterSelectorProps) {
    const { value, onChange } = props;
    const semesterElements = SEMESTERS.map(semester => {
        return <FancyRadioButton
            key={semester.name}
            majorText={semester.name}
            minorText="Starts in 5 days"
            value={semester.name}
            checked={semester === value}
            onChange={() => onChange(semester)}
        />;
    });
    return <div className="d-flex flex-column gap-1">{semesterElements}</div>;
}
