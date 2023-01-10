import { DateTime } from "luxon";

/**
 * User input for time.  Expects input in a format matching WebSTAC's formatting.
 */
export class EventTimeInput {
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
    public readonly formatInstructions = "For example, 9:00a";

    constructor(raw: string) {
        this.raw = raw;
        this.parsed = this._parse();
    }

    private _parse(): DateTime {
        let timeStr = this.raw.toUpperCase();
        if (timeStr.endsWith("A") || timeStr.endsWith("P")) { // Have an A or P without an M?  Add the M!
            timeStr += "M";
        }

        return DateTime.fromFormat(timeStr, "h:mma");
    }
}
