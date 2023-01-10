/**
 * One of the seven days of the week.  For iteration, the first day of the week of this implementation shall be Monday
 * and have the value of 1.  Also note: this implementation is compatible with Luxon.
 */
export enum DayOfWeek {
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6,
    Sunday = 7
}

/**
 * All days of the week starting with Monday.
 */
export const ALL_DAYS: ReadonlyArray<DayOfWeek> = [1, 2, 3, 4, 5, 6, 7];
