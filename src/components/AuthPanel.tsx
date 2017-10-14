import * as React from "react";
import AsyncButton from "./AsyncButton";

interface AuthPanelProps {
    /**
     * Whether the user is signed in or not.
     */
    isSignedIn: boolean;

    /**
     * Called when an API sign in is requested.
     */
    onSignInRequested?(): Promise<void>;

    /**
     * Called when an API sign in is requested.
     */
    onSignOutRequested?(): Promise<void>;

    /**
     * Called when onSignInRequested or onSignOutRequested has resolved.
     */
    onAuthChangeComplete?(): void;
}

/**
 * An AsyncButton with specific type void.  Aliased because we cannot specify it in JSX.
 */
class AsyncButtonVoid extends AsyncButton<void> {}

/**
 * Component presenting buttons for logging in and out of Calendar API.
 * 
 * @param {AuthPanelProps} props
 * @return {JSX.Element} component to render
 * @author Silas Hsu
 */
function AuthPanel(props: AuthPanelProps): JSX.Element {
    if (!props.isSignedIn) {
        return (
        <div>
            <p>Click the button to grant access to your Google calendar.</p>
            <AsyncButtonVoid
                className="btn btn-primary"
                onClick={props.onSignInRequested}
                onPromiseResolved={props.onAuthChangeComplete}
                errorContent="Permission failed - retry?"
            >
                Grant permission 
            </AsyncButtonVoid>
        </div>
        );
    } else {
        return (
        <div>
            <p>You have granted access to your calendar.</p>
            <AsyncButtonVoid
                className="btn btn-light"
                onClick={props.onSignOutRequested}
                onPromiseResolved={props.onAuthChangeComplete}
                errorContent="End session failed - retry?"
            >
                End session
            </AsyncButtonVoid>
        </div>
        );
    }
}

export default AuthPanel;
