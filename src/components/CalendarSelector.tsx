import { ChangeEvent, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { AuthError, AuthManagement } from "../google/useAuthState";
import { GoogleAuthScope } from "../google/GoogleAuthScope";
import { CalendarApi } from "../google/CalendarApi";
import { describeCount } from "../describeCount";

const AUTH_SCOPES = [GoogleAuthScope.ReadWriteEvents, GoogleAuthScope.ListCalendars];
const NON_PRIMARY_CALENDAR_VALUE = "other";

interface ICalendarSelectorProps {
    /**
     * The selected calendar ID.
     */
    value: string;
    auth: AuthManagement;
    onChange?: (newValue: string) => void;
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
            onChange?.(newValue);
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
        statusDisplay = <div className="text-danger py-1" style={{ fontSize: "smaller" }}>
            An error occurred while trying to gain permission to fetch calendars.
        </div>;
    } else if (isFetching) {
        statusDisplay = <div className="py-1" style={{ fontSize: "smaller" }}>Fetching calendars...</div>;
    } else if (isAuthed) {
        statusDisplay = <div className="d-flex align-items-center gap-1 py-1">
            <span className={isFetchError ? "text-danger" : "text-success"} style={{ fontSize: "smaller" }}>
                {isFetchError ?
                    "There was a problem getting your calendars."
                    :
                    <>
                        <FontAwesomeIcon icon={faCheck}/> Found
                        {describeCount(fetchedCalendars.length, "calendar")} for
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
        <select className="form-select w-auto" value={value} onChange={handleSelectChanged}>
            {fetchedCalendars.length === 0 &&
                <>
                    <option value="primary">Your primary calendar</option>
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
