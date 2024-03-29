import { DateTime } from "luxon";
import { ISemester } from "src/eventLogic/ISemester";
import { FancyRadioButton } from "./FancyRadioButton";

const TIME_ZONE = { zone: "America/Chicago" };

export const SEMESTERS: ISemester[] = [
    {
        name: "SU23 Session III",
        firstDayOfClasses: DateTime.fromObject({ year: 2023, month: 6, day: 12, hour: 8 }, TIME_ZONE),
        lastDayOfClasses:DateTime.fromObject({ year: 2023, month: 8, day: 4, hour: 8 }, TIME_ZONE)
    },
    {
        name: "SU24 Session IV",
        firstDayOfClasses: DateTime.fromObject({ year: 2023, month: 7, day: 17, hour: 8 }, TIME_ZONE),
        lastDayOfClasses:DateTime.fromObject({ year: 2023, month: 8, day: 17, hour: 8 }, TIME_ZONE)
    },
    {
        name: "FL23",
        firstDayOfClasses: DateTime.fromObject({ year: 2023, month: 8, day: 29, hour: 8 }, TIME_ZONE),
        lastDayOfClasses: DateTime.fromObject({ year: 2023, month: 12, day: 9, hour: 8 }, TIME_ZONE)
    }
];
for (const semester of SEMESTERS) {
    if (!semester.firstDayOfClasses.isValid || !semester.lastDayOfClasses.isValid) {
        throw new Error(`${semester.name} has invalid start or end date configured`);
    }
}
function sortSemesters() {
    const now = DateTime.now().toUnixInteger();
    SEMESTERS.sort((s1, s2) => {
        const s1TimeDiff = Math.abs(s1.firstDayOfClasses.toUnixInteger() - now);
        const s2TimeDiff = Math.abs(s2.firstDayOfClasses.toUnixInteger() - now);
        return s1TimeDiff - s2TimeDiff;
    });
}
sortSemesters();


interface ISemesterSelectorProps {
    value: ISemester | null;
    onChange: (newSemester: ISemester) => void;
}

export function SemesterSelector(props: ISemesterSelectorProps) {
    const { value, onChange } = props;
    const semesterElements = SEMESTERS.map(semester => {
        let timeDiff = semester.firstDayOfClasses.toRelativeCalendar();
        if (timeDiff) {
            if (DateTime.now() < semester.firstDayOfClasses) {
                timeDiff = "starts " + timeDiff;
            } else {
                timeDiff = "started " + timeDiff;
            }
        }

        const description = `Classes from ${semester.firstDayOfClasses.toLocaleString()} to ` +
            `${semester.lastDayOfClasses.toLocaleString()} (${timeDiff})`;
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
