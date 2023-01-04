import { DateTime } from "luxon";
import { describeCount } from "src/describeCount";
import { ISemester } from "src/eventLogic/ISemester";
import { FancyRadioButton } from "./FancyRadioButton";

const TIME_ZONE = { zone: "America/Chicago" };

export const SEMESTERS: ISemester[] = [
    {
        name: "SP23",
        firstDayOfClasses: DateTime.fromObject({ year: 2023, month: 1, day: 17, hour: 8 }, TIME_ZONE),
        lastDayOfClasses: DateTime.fromObject({ year: 2023, month: 4, day: 28, hour: 8 }, TIME_ZONE)
    }
];
for (const semester of SEMESTERS) {
    if (!semester.firstDayOfClasses.isValid || !semester.lastDayOfClasses.isValid) {
        throw new Error(`${semester.name} has invalid start or end date configured`);
    }
}

interface ISemesterSelectorProps {
    value: ISemester | null;
    onChange: (newSemester: ISemester) => void;
}

export function SemesterSelector(props: ISemesterSelectorProps) {
    const { value, onChange } = props;
    const semesterElements = SEMESTERS.map(semester => {
        const daysUntilSemesterStart = Math.round(semester.firstDayOfClasses.diffNow("day").days);
        let timeUntilDescription;
        if (daysUntilSemesterStart > 0) {
            timeUntilDescription = `starts in ${describeCount(daysUntilSemesterStart, "day")}`;
        } else if (daysUntilSemesterStart < 0) {
            timeUntilDescription = `started ${describeCount(daysUntilSemesterStart, "day")} ago`;
        } else {
            timeUntilDescription = "starts today";
        }

        const description = `Classes from ${semester.firstDayOfClasses.toLocaleString()} to ` +
            `${semester.lastDayOfClasses.toLocaleString()} (${timeUntilDescription})`;
        return <FancyRadioButton
            key={semester.name}
            majorText={semester.name}
            minorText={description}
            value={semester.name}
            checked={semester === value}
            onChange={() => onChange(semester)}
        />;
    });
    return <div className="d-flex flex-column gap-1">{semesterElements}</div>;
}
