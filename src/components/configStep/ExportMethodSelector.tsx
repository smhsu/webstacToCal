import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PropsWithChildren, useEffect, useState } from "react";

import { AppWorkflowStep, PROPS_FOR_STEP } from "src/AppWorkflowStep";
import { EventExportMethod } from "src/eventLogic/EventExportMethod";
import { GoogleAuthScope } from "src/google/GoogleAuthScope";
import { AuthError, AuthManagement } from "src/google/useAuthState";
import { FancyRadioButton } from "./FancyRadioButton";

/**
 * The scopes that are required for the Google option to be selected.
 */
const AUTH_SCOPES = [GoogleAuthScope.ReadWriteEvents];

/*
 * The minimum amount of time in milliseconds it takes to log out.  There's a delay to give the illusion the computer
 * is doing hard work.
 */
const MIN_LOGOUT_DELAY_MS = 250;

enum LogoutState {
    None,
    Pending,
    Success
}

interface IExportMethodSelectorProps {
    method: EventExportMethod;
    apiLoadState: { isLoaded: boolean, isError: boolean };
    auth: AuthManagement;

    ariaLabelledby?: string;
    onMethodChanged?: (newMethod: EventExportMethod) => void;
}

export function ExportMethodSelector(props: IExportMethodSelectorProps) {
    const { method, apiLoadState, auth, ariaLabelledby, onMethodChanged } = props;
    const [authError, setAuthError] = useState(AuthError.None);
    const [logoutState, setLogoutState] = useState(LogoutState.None);

    const isAuthed = AUTH_SCOPES.every(scope => auth.authedScopes.has(scope));

    useEffect(() => { // If we lose the auth scope that this component requires, deselect the Google option.
        if (method === EventExportMethod.GoogleCalendar && !isAuthed) {
            onMethodChanged?.(EventExportMethod.None);
        }
    }, [method, isAuthed, onMethodChanged]);

    // Don't select the Google option immediately when a user clicks on it, but instead kick off the
    // authorization flow.
    const handleGoogleSelected = async () => {
        if (!isAuthed) {
            setAuthError(AuthError.None);
            setLogoutState(LogoutState.None);
            auth.startAuthFlow(AUTH_SCOPES)
                .then(() => onMethodChanged?.(EventExportMethod.GoogleCalendar))
                .catch(setAuthError);
        } else {
            onMethodChanged?.(EventExportMethod.GoogleCalendar);
        }
    };

    const handleLogoutClicked = async () => {
        setLogoutState(LogoutState.Pending);
        await delay(MIN_LOGOUT_DELAY_MS);
        auth.revokeAuth();
        setLogoutState(LogoutState.Success);
        onMethodChanged?.(EventExportMethod.None);
    };

    let googleChoiceMinorText;
    if (apiLoadState.isError) {
        // text-opacity-50 because the option will be disabled
        googleChoiceMinorText = <span className="text-danger text-opacity-50">Unavailable</span>;
    } else if (!apiLoadState.isLoaded) {
        googleChoiceMinorText = "Loading Google libraries...";
    }  else if (auth.isPending) {
        googleChoiceMinorText = "Awaiting action in popup..";
    } else if (isAuthed) {
        googleChoiceMinorText = "You have granted access to your Google Calendar.";
    } else {
        googleChoiceMinorText = "You will see a pop-up to grant access to your Google calendar.";
    }

    let googleStatusDisplay = null;
    if (apiLoadState.isError) {
        googleStatusDisplay = <div className="text-danger mb-3" role="status">
            There was a problem loading Google sign-in.  Try reloading the page.<br />
            <InstructionsToWaitOrContact />
        </div>;
    } else if (authError === AuthError.PopupBlocked) {
        googleStatusDisplay = <GoogleStatus className="text-danger" role="status">
            Error: popup blocked. Try disabling your popup blocker. Then, click above to try again.
        </GoogleStatus>;
    } else if (authError === AuthError.Unknown) {
        googleStatusDisplay = <GoogleStatus className="text-danger" role="status">
            A problem happened while trying to get calendar access.  Click above to try again.<br />
            <InstructionsToWaitOrContact />
        </GoogleStatus>;
    } else if (auth.authedScopes.size > 0 && !isAuthed) {
        googleStatusDisplay = <GoogleStatus className="text-danger" role="status">
            You have not granted permission for this app to create calendar events.
            Click above to grant access.
        </GoogleStatus>;
    } else if (isAuthed) {
        googleStatusDisplay = <button // Button to log out
            className="btn btn-link btn-small-link p-0 mb-2 align-self-start"
            onClick={handleLogoutClicked}
        >
            Use a different Google account and/or revoke calendar access
        </button>;
    } else if (logoutState === LogoutState.Pending) {
        googleStatusDisplay = <GoogleStatus>Logging out...</GoogleStatus>;
    } else if (logoutState === LogoutState.Success) {
        googleStatusDisplay = <GoogleStatus className="text-success" role="status">
            <FontAwesomeIcon icon={faCheck} /> Logged out!  Choose the above option to re-grant access.
        </GoogleStatus>;
    }

    return <div className="d-flex flex-column gap-1" role="radiogroup" aria-labelledby={ariaLabelledby} >
        <FancyRadioButton
            majorText="Direct to Google Calendar"
            minorText={googleChoiceMinorText}
            value={EventExportMethod.GoogleCalendar}
            checked={method === EventExportMethod.GoogleCalendar}
            disabled={!apiLoadState.isLoaded || auth.isPending}
            onChange={handleGoogleSelected}
        />
        {googleStatusDisplay}
        <FancyRadioButton
            majorText=".ical file"
            minorText="Not available yet -- coming in the next few months"
            value={EventExportMethod.IcalFile}
            checked={method === EventExportMethod.IcalFile}
            //onChange={() => onMethodChanged?.(EventExportMethod.IcalFile)}
            disabled={true}
        />
    </div>;
}

/**
 * @param ms number of milliseconds to wait
 * @return a promise that resolves after `ms` milliseconds
 */
function delay(ms: number): Promise<void> {
    return new Promise(resolve => {
        window.setTimeout(resolve, ms);
    });
}

function GoogleStatus(props: PropsWithChildren<{className?: string, role?: string}>) {
    const { className, role, children } = props;
    return <div className={"mb-2 " + (className || "")} style={{ fontSize: "smaller" }} role={role}>
        {children}
    </div>;
}

function InstructionsToWaitOrContact() {
    return <>
        If that doesn't work, try waiting a
        bit or <a href={"#" + PROPS_FOR_STEP[AppWorkflowStep.About].id}>contacting me</a>.
    </>;
}
