import { AsyncButton } from "./AsyncButton";
import { ApiHttpError, CalendarApi } from "../CalendarApi";
import { useCallback, useState } from "react";

interface AuthPanelProps {
    isSignedIn: boolean;
    onAuthStateChange: (isSignedIn: boolean) => void;
}

export function AuthPanel(props: AuthPanelProps) {
    const { isSignedIn, onAuthStateChange } = props;
    const [error, setError] = useState<Error | null>(null);
    const dispatchAuthStateChange = useCallback(() => {
        onAuthStateChange(CalendarApi.getIsSignedIn());
    }, [onAuthStateChange]);

    let errorDisplay = null;
    if (error !== null) {
        if (error instanceof ApiHttpError) {
            errorDisplay = <div>Error: {error.message}</div>;
        } else {
            errorDisplay = <div>Unknown error -- possibly bug?  See developer's console for details.</div>;
        }
    }

    if (!isSignedIn) {
        return <div>
            <p>Click the button to grant access to your Google calendar.</p>
            <AsyncButton
                className="btn btn-primary"
                promiseFactory={CalendarApi.signIn}
                onPromiseResolved={dispatchAuthStateChange}
                onPromiseRejected={setError}
            >
                Grant permission
            </AsyncButton>
            {errorDisplay}
        </div>;
    } else {
        return <div>
            <p>You have granted access to your calendar.</p>
            <AsyncButton
                className="btn btn-light"
                promiseFactory={CalendarApi.signOut}
                onPromiseResolved={dispatchAuthStateChange}
                onPromiseRejected={setError}
            >
                End session
            </AsyncButton>
            {errorDisplay}
        </div>;
    }
}
