import { DateTime } from "luxon";

/**
 * User input for date.  Expects input in a format matching WebSTAC's formatting.
 */
export class EventDateInput {
    /**
     * Raw input string.
     */
    public readonly raw: string;

    /**
     * Parsed input string.  Might be invalid.
     */
    public readonly parsed: DateTime;

    /**
     * User-readable instructions for properly formatting their input.
     */
    public readonly formatInstructions = "Use exactly three letters for the month, for example Dec 9 2023";

    constructor(raw: string) {
        this.raw = raw;
        this.parsed = DateTime.fromFormat(raw, "LLL d yyyy");
    }
}
