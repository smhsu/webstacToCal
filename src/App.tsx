import * as React from 'react';
import './App.css';
import { ApiHttpError, CalendarApi } from './CalendarAPI';

const logo = require('./logo.svg');

interface AppState {
    calendarApi: CalendarApi | null
    apiLoadError: any
}

function catchError(error: any) {
    if (error instanceof ApiHttpError) {
        console.error(error.toString());
    } else if (error instanceof Error) {
        console.error(error.message);
    } else {
        console.error("other error");
        console.error(error);
    }
}

class App extends React.Component<{}, AppState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            calendarApi: null,
            apiLoadError: null,
        };
        CalendarApi.getInstance()
            .then(api => this.setState({calendarApi: api}))
            .catch(error => this.setState({apiLoadError: error}));

        this.signIn = this.signIn.bind(this);
        this.signOut = this.signOut.bind(this);
    }

    signIn(): Promise<void> {
        if (this.state.calendarApi === null) {
            return Promise.reject("Calendar API not loaded yet");
        }
        return this.state.calendarApi.signIn()
            .then(() => this.setState({}))
            .catch(catchError);
    }

    signOut(): Promise<void> {
        if (this.state.calendarApi === null) {
            return Promise.reject("Calendar API not loaded yet");
        }
        return this.state.calendarApi.signOut()
            .then(() => this.setState({}))
            .catch(catchError);
    }

    render() {
        if (!this.state.calendarApi) {
            return <p>Loading...</p>
        }

        this.state.calendarApi.getCalendarList().then(console.log).catch(catchError);
        
        return (
        <div className="App">
            <div className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h2>Welcome to React</h2>
            </div>
            <p className="App-intro">
                To get started, edit <code>src/App.tsx</code> and save to reload.
            </p>
            {
            this.state.calendarApi.getIsSignedIn() ?
                <button onClick={this.signOut}>End session</button> :
                <button onClick={this.signIn}>Grant permission</button>
            }
        </div>
        );
    }
}

export default App;
