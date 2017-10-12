import * as React from "react";
import AsyncButton from "./AsyncButton";
import CalendarApi from "../CalendarApi";

interface AuthPanelProps {
    calendarApi: CalendarApi;
    onAuthStatusChange?(): void;
}

class AsyncButtonVoid extends AsyncButton<void> {} // Because JSX disagrees with the type parameter.

class AuthPanel extends React.Component<AuthPanelProps, {}> {
    constructor(props: AuthPanelProps) {
        super(props);
        this.signInClicked = this.signInClicked.bind(this);
        this.signOutClicked = this.signOutClicked.bind(this);
    }

    signInClicked() {
        return this.props.calendarApi.signIn();
    }

    signOutClicked() {
        return this.props.calendarApi.signOut();
    }

    render(): JSX.Element {
        return (
        <div>
        {
            !this.props.calendarApi.getIsSignedIn() ?
                <AsyncButtonVoid
                    className="btn btn-primary"
                    onClick={this.signInClicked}
                    onPromiseResolved={this.props.onAuthStatusChange}
                    errorContent="Permission failed - retry?"
                >
                    Grant permission 
                </AsyncButtonVoid> :

                <AsyncButtonVoid
                    className="btn btn-light"
                    onClick={this.signOutClicked}
                    onPromiseResolved={this.props.onAuthStatusChange}
                    errorContent="End session failed - retry?"
                >
                    End session
                </AsyncButtonVoid>
        }
        </div>
        );
    }
}

export default AuthPanel;
