import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useEffect, useState } from "react";

import { describeCount } from "src/describeCount";
import { CalendarApi } from "src/google/CalendarApi";
import { GoogleAuthScope } from "src/google/GoogleAuthScope";
import { IGoogleCalendarMetadata, PRIMARY_CALENDAR } from "src/google/IGoogleCalendarMetadata";
import { AuthError, AuthManagement } from "src/google/useAuthState";

const AUTH_SCOPES = [GoogleAuthScope.ReadWriteEvents, GoogleAuthScope.ListCalendars];
const NON_PRIMARY_CALENDAR_VALUE = "other";

interface ICalendarSelectorProps {
    /**
     * The selected calendar.
     */
    value: IGoogleCalendarMetadata;
    auth: AuthManagement;
    onChange?: (newValue: IGoogleCalendarMetadata) => void;
}

export function CalendarSelector(props: ICalendarSelectorProps) {
    const { value, auth, onChange } = props;
    const [fetchedCalendars, setFetchedCalendars] = useState<gapi.client.calendar.CalendarListEntry[]>([]);
    const [authError, setAuthError] = useState(AuthError.None);
    const [isFetchError, setIsFetchError] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const isAuthed = AUTH_SCOPES.every(scope => auth.authedScopes.has(scope));

    useEffect(() => {
        if (isAuthed) {
            fetchCalendars();
        }
    }, [isAuthed]);

    const handleSelectChanged = (e: ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.currentTarget.value;
        if (newValue === NON_PRIMARY_CALENDAR_VALUE) {
            setAuthError(AuthError.None);
            auth.startAuthFlow(AUTH_SCOPES)
                .then(fetchCalendars)
                .catch(setAuthError);
        } else {
            const matchingCalendar = fetchedCalendars.find(calendar => calendar.id === newValue)!;
            onChange?.(matchingCalendar);
        }
    };

    const fetchCalendars = async () => {
        setIsFetching(true);
        setIsFetchError(false);
        try {
            const calendars = await CalendarApi.getInstance().listWritableCalendars();
            const primaryCalIndex = calendars.findIndex(calendar => calendar.primary);
            if (primaryCalIndex >= 0) { // Swap so the primary calendar comes first
                const temp = calendars[0];
                calendars[0] = calendars[primaryCalIndex];
                calendars[primaryCalIndex] = temp;
            }
            setFetchedCalendars(calendars);
        } catch (error) {
            console.error(error);
            setIsFetchError(true);
        }
        setIsFetching(false);
    };

    let statusDisplay;
    if (authError === AuthError.PopupBlocked || authError === AuthError.Unknown) {
        statusDisplay = <div className="text-danger py-1" style={{ fontSize: "smaller" }} role="status">
            An error occurred while trying to gain permission to fetch calendars.
        </div>;
    } else if (isFetching) {
        statusDisplay = <div className="py-1" style={{ fontSize: "smaller" }}>Fetching calendars...</div>;
    } else if (isAuthed) {
        statusDisplay = <div className="d-flex align-items-center gap-1 py-1" role="status">
            <span className={isFetchError ? "text-danger" : "text-success"} style={{ fontSize: "smaller" }}>
                {isFetchError ?
                    "There was a problem getting your calendars."
                    :
                    <>
                        <FontAwesomeIcon icon={faCheck} aria-hidden="true" /> Found
                        {" " + describeCount(fetchedCalendars.length, "calendar")} for
                        which you have edit access.
                    </>
                }
            </span>
            <button className="btn btn-link btn-small-link" onClick={fetchCalendars}>
                {isFetchError ? "Click here to try again." : "Refresh calendar list"}
            </button>
        </div>;
    }

    return <div>
        <select className="form-select w-auto" value={value.id} onChange={handleSelectChanged}>
            {fetchedCalendars.length === 0 &&
                <>
                    <option value={PRIMARY_CALENDAR.id}>{PRIMARY_CALENDAR.summary}</option>
                    <option value="other">
                        Another calendar... (will ask for permission to fetch your calendars)
                    </option>
                </>
            }
            {
                fetchedCalendars.map(calendar => {
                    return <option
                        key={calendar.id}
                        value={calendar.id}
                    >
                        {calendar.summary} {calendar.primary && "(Your primary calendar)"}
                    </option>;
                })
            }
        </select>

        {statusDisplay}
    </div>;
}
