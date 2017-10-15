import * as React from "react";
import AsyncButton from "./AsyncButton";
import CalendarApi from "../CalendarApi";
import semester from "../Semester";

import "./css/EventTableOptions.css";

interface Calendar extends gapi.client.calendar.CalendarListEntry {} // Just an alias

interface EventTableOptionsProps {
    /**
     * Used for fetching calendar lists.
     */
    calendarApi?: CalendarApi;

    /**
     * The currently selected calendar.
     */
    selectedCalendar: Calendar | null;

    /**
     * Callback for when a calendar is selected.
     */
    onCalendarSelected?(calendar: Calendar | null): void;
}

interface EventTableOptionsState {
    /**
     * Current calendar options among which to select.
     */
    calendars: Calendar[];
}

/**
 * An AsyncButton with specific type Calendar[].  Aliased because we cannot specify it in JSX.
 */
class AsyncButtonCalendars extends AsyncButton<Calendar[]> {}

/**
 * Manages calendar and semester <select>s for EventTable.  This component manages available calendar options, but the 
 * selected option is stored in a parent.
 * 
 * @author Silas Hsu
 */
class EventTableOptions extends React.Component<EventTableOptionsProps, EventTableOptionsState> {
    /**
     * Not only initializes state and binds methods, but also immediately fetches calendars, if possible
     * 
     * @param {EventTableOptionsProps} props
     */
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

    /**
     * If props change from logged in to logged out, clears the calendar options.  If props change from being logged out
     * to logged in, fetches a new calendar option list.
     * 
     * @param nextProps - next props the component will receive
     */
    componentWillReceiveProps(nextProps: EventTableOptionsProps): void {
        let nextLoggedIn = this.getIsLoggedIn(nextProps.calendarApi);
        if (this.state.calendars.length === 0 && nextLoggedIn) { // We don't have calendars and logged in
            this.fetchCalendars(nextProps.calendarApi).then(this.setCalendarList);
        } else if (this.state.calendars.length > 0 && !nextLoggedIn) { // We have calendars and logged out
            this.setState({calendars: []});
        }
        // We have calendars and logged in: do nothing
        // We don't have calendars and logged out: do nothing
    }

    /**
     * Gets whether the input API (default this.props.calendarApi) is logged in.  If given undefined, returns false.
     * 
     * @param {CalendarApi} [calendarApi=this.props.calendarApi] - the API to check
     */
    getIsLoggedIn(calendarApi: CalendarApi | undefined = this.props.calendarApi): boolean {
        return calendarApi ? calendarApi.getIsSignedIn() : false;
    }

    /**
     * Fetches the user's calendar list using the given API.  If given undefined, returns a Promise resolved with empty
     * array.
     * 
     * @param {CalendarApi} [calendarApi=this.props.calendarApi] - the API used to fetch calendars
     * @return {Promise<Calendar[]>} Promise for the user's calendar list
     */
    fetchCalendars(calendarApi: CalendarApi | undefined = this.props.calendarApi): Promise<Calendar[]> {
        if (calendarApi) {
            return calendarApi.getCalendarList();
        } else {
            return Promise.resolve([]);
        }
    }

    /**
     * Sets this component's calendar option list, but only if the user is still logged in, since it's possible for data
     * to come in after the user has logged out.
     * 
     * @param {Calendar[]} newCalendars - new calendar option list
     */
    setCalendarList(newCalendars: Calendar[]): void {
        if (this.getIsLoggedIn()) {
            this.setState({calendars: newCalendars});
        }
    }

    /**
     * Callback for when the component's calendar <select> changes.  Coverts the change event to a Calendar object to
     * pass to the parent.
     * 
     * @param {React.ChangeEvent<HTMLSelectElement>} changeEvent - React change event from the calendar <select>
     */
    calendarSelectChanged(changeEvent: React.ChangeEvent<HTMLSelectElement>): void {
        if (this.props.onCalendarSelected) {
            let matchingCalendar = this.state.calendars.find(calendar => calendar.id === changeEvent.target.value);
            this.props.onCalendarSelected(matchingCalendar || null);
        }
    }

    render(): JSX.Element {
        let selectedCalendarValue = this.props.selectedCalendar ? this.props.selectedCalendar.id : "";
        let calendarOptions = this.state.calendars.map(calendar =>
            <option key={calendar.id} value={calendar.id}>{calendar.summary}</option>
        );

        return (
        <div className="EventTableOptions">
            <div className="EventTableOptions-row">
                <label>Select semester:</label>
                <select>
                    <option key={semester.name} value={semester.name}>{semester.name}</option>
                </select>
            </div>
            <div className="EventTableOptions-row">
                <label>Select calendar:</label>
                <select value={selectedCalendarValue} onChange={this.calendarSelectChanged}>
                    <option value="">Select a calendar...</option>
                    {calendarOptions}
                </select>
                <span className="EventTableOptions-refresh-list-button">
                {
                    this.getIsLoggedIn() ?
                        <AsyncButtonCalendars
                            className="btn btn-secondary"
                            onClick={this.fetchCalendars}
                            onPromiseResolved={this.setCalendarList}
                        >
                            Refresh list
                        </AsyncButtonCalendars>
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
