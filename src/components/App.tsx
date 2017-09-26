import "./App.css";
import { ApiHttpError, CalendarApi } from "../CalendarAPI";
import AddClassesTable from "./AddClassesTable";
import AuthButton from "./AuthButton";
import * as React from "react";

const logo = require("../logo.svg");

interface AppState {
    calendarApi: CalendarApi | null;
    apiLoadError: string;
    isAuthError: boolean;
    authErrorMessage: string;
}

class App extends React.Component<{}, AppState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            calendarApi: null,
            apiLoadError: "",
            isAuthError: false,
            authErrorMessage: "",
        };
        CalendarApi.getInstance()
            .then(api => this.setState({calendarApi: api}))
            .catch(error => this.setState({apiLoadError: error.toString()}));

        this.signIn = this.signIn.bind(this);
        this.signOut = this.signOut.bind(this);
    }

    signIn(): Promise<void> {
        if (this.state.calendarApi === null) {
            return Promise.reject(new Error("Calendar API not loaded yet"));
        }
        return this.handleAuthResult(this.state.calendarApi.signIn());
    }

    signOut(): Promise<void> {
        if (this.state.calendarApi === null) {
            return Promise.reject(new Error("Calendar API not loaded yet"));
        }
        return this.handleAuthResult(this.state.calendarApi.signOut());
    }

    handleAuthResult(authPromise: Promise<void>): Promise<void> {
        return authPromise
            .then(() => this.setState({isAuthError: false}))
            .catch((error) => {
                window.console.error(error);
                this.setState({
                    isAuthError: true,
                    authErrorMessage: error instanceof ApiHttpError ? error.message : ""
                });
            });
    }

    render() {
        let inputBoxPlaceholder = "Go to WebSTAC >> Courses and Registration >> Class Schedule.\n" +
            "Then, SELECT ALL the text, including finals schedule, and copy and paste it into this box.";

        return (
        <div className="App">
            <div className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h2>Welcome to React</h2>
            </div>
            <p className="App-intro">
                To get started, edit <code>src/App.tsx</code> and save to reload.
            </p>
            <div>
            {
                this.state.calendarApi !== null ?
                <AuthButton
                    isSignedIn={this.state.calendarApi.getIsSignedIn()}
                    onSignIn={this.signIn}
                    onSignOut={this.signOut}
                    isAuthError={this.state.isAuthError}
                    authErrorMessage={this.state.authErrorMessage}
                /> : null
            }
            </div>
            <textarea placeholder={inputBoxPlaceholder} onChange={console.log}/>
            <AddClassesTable />
        </div>
        );
    }
    
}

export default App;
