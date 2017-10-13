import * as React from "react";
import AsyncButton from "./AsyncButton";
import CalendarApi from "../CalendarApi";
import semester from "../Semester";

import "./EventTableOptions.css";

interface Calendar extends gapi.client.calendar.CalendarListEntry {} // Just an alias

interface EventTableOptionsProps {
    calendarApi?: CalendarApi;
    selectedCalendar: Calendar | null;
    onCalendarSelected?(calendar: Calendar | null): void;
}

interface EventTableOptionsState {
    calendars: Calendar[];
}

class FetchCalendarsButton extends AsyncButton<Calendar[]> {}

class EventTableOptions extends React.Component<EventTableOptionsProps, EventTableOptionsState> {
    constructor(props: EventTableOptionsProps) {
        super(props);
        this.state = {
            calendars: []
        };
        this.getIsLoggedIn = this.getIsLoggedIn.bind(this);
        this.fetchCalendars = this.fetchCalendars.bind(this);
        this.setCalendarList = this.setCalendarList.bind(this);
        this.calendarSelectChanged = this.calendarSelectChanged.bind(this);
        if (this.getIsLoggedIn()) {
            this.fetchCalendars().then(this.setCalendarList);
        }
    }

    componentWillReceiveProps(nextProps: EventTableOptionsProps) {
        let nextLoggedIn = nextProps.calendarApi ? nextProps.calendarApi.getIsSignedIn() : false;
        if (this.state.calendars.length === 0 && nextLoggedIn) { // We don't have calendars and logged in
            this.fetchCalendars(nextProps.calendarApi).then(this.setCalendarList);
        } else if (this.state.calendars.length > 0 && !nextLoggedIn) { // We have calendars and logged out
            this.setState({calendars: []});
        }
        // We have calendars and logged in: do nothing
        // We don't have calendars and logged out: do nothing
    }

    getIsLoggedIn(): boolean {
        return this.props.calendarApi ? this.props.calendarApi.getIsSignedIn() : false;
    }

    fetchCalendars(calendarApi: CalendarApi | undefined = this.props.calendarApi): Promise<Calendar[]> {
        if (calendarApi) {
            return calendarApi.getCalendarList();
        } else {
            return Promise.resolve([]);
        }
    }

    /**
     * Sets this.state.calendars, but only if the user is still logged in, since it's possible for a calendar refresh to
     * be requested and then the user to log out before the calendar refresh is completed.
     * 
     * @param newCalendars - new calendar list to set
     */
    setCalendarList(newCalendars: Calendar[]): void {
        if (this.getIsLoggedIn()) {
            this.setState({calendars: newCalendars});
        }
    }

    calendarSelectChanged(changeEvent: React.ChangeEvent<HTMLSelectElement>) {
        if (this.props.onCalendarSelected) {
            let matchingCalendar = this.state.calendars.find(calendar => calendar.id === changeEvent.target.value);
            this.props.onCalendarSelected(matchingCalendar || null);
        }
    }

    render() {
        let selectedCalendarValue = this.props.selectedCalendar ? this.props.selectedCalendar.id : "";
        let calendarOptions = this.state.calendars.map(calendar =>
            <option key={calendar.id} value={calendar.id}>{calendar.summary}</option>
        );

        return (
        <div className="EventTableOptions">
            <div>
                <label>Select semester:</label>
                <select>
                    <option key={semester.name} value={semester.name}>{semester.name}</option>
                </select>
            </div>
            <div>
                <label>Select calendar:</label>
                <select value={selectedCalendarValue} onChange={this.calendarSelectChanged}>
                    <option value="">Select a calendar...</option>
                    {calendarOptions}
                </select>
                <span className="EventTableOptions-refresh-list-button">
                {
                    this.getIsLoggedIn() ?
                        <FetchCalendarsButton
                            className="btn btn-secondary"
                            onClick={this.fetchCalendars}
                            onPromiseResolved={this.setCalendarList}
                        >
                            Refresh list
                        </FetchCalendarsButton>
                        :
                        null
                    }
                </span>
            </div>
        </div>
        );
    }
}

export default EventTableOptions;
