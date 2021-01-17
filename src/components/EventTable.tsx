import * as React from "react";
import * as _ from "lodash";

import EventTableOptions from "./EventTableOptions";
import EventTableRow from "./EventTableRow";

import Analytics from "../Analytics";
import { CalendarApi } from "../CalendarApi";
import { EventInputModel, EventInputButtonState } from "../EventInputModel";
import { ValidationError, ValidationErrorReason } from "../ValidationError";

import "./css/EventTable.css";

interface EventTableProps {
    /**
     * Events for the table to display.
     */
    events: EventInputModel[];

    /**
     * API for adding events to the user's calendar.
     */
    calendarApi?: CalendarApi;
}

interface EventTableState {
    /**
     * All events the table is displaying.  Forked from props.events, since the user can modify them.
     */
    events: EventInputModel[];

    /**
     * The calendar to which the user wishes to add events.
     */
    selectedCalendar: gapi.client.calendar.CalendarListEntry | null;

    /**
     * After pressing the "add all" button, whether requests are still in flight.
     */
    isAddingAll: boolean;
}

/**
 * Table that displays events to add to Google calendar, as well as options for doing so.
 * 
 * @author Silas Hsu
 */
class EventTable extends React.Component<EventTableProps, EventTableState> {
    analytics: Analytics;

    constructor(props: EventTableProps) {
        super(props);
        this.state = {
            events: props.events,
            selectedCalendar: null,
            isAddingAll: false,
        };
        this.analytics = new Analytics();

        this.addCustomEvent = this.addCustomEvent.bind(this);
        this.updateOneEvent = this.updateOneEvent.bind(this);
        this.validateOptions = this.validateOptions.bind(this);
        this.addButtonPressed = this.addButtonPressed.bind(this);
        this.addAllButtonPressed = this.addAllButtonPressed.bind(this);
        this.addModelToCalendar = this.addModelToCalendar.bind(this);
        this.renderEventTableRows = this.renderEventTableRows.bind(this);
    }

    /**
     * If new events are incoming via props, replaces all non-custom events in the table with them.
     * 
     * @param {EventTableProps} nextProps - next props the component will receive
     */
    componentWillReceiveProps(nextProps: EventTableProps): void {
        if (this.props.events !== nextProps.events) {
            let customEvents = this.state.events.filter(event => event.isCustom);
            let newEvents = nextProps.events.concat(customEvents);
            this.setState({events: newEvents});
        }
    }

    /**
     * Adds a custom course to the table.
     */
    addCustomEvent(): void {
        const newEvent = new EventInputModel();
        newEvent.isCustom = true;

        const newEvents = this.state.events.slice();
        newEvents.push(newEvent);
        
        this.analytics.sendEvent({category: "Buttons", action: "Custom event"});
        this.setState({events: newEvents});
    }

    /**
     * Changes, without mutation, one event of this.state.events, then sets state.
     * 
     * @param {Pick<EventInputModel, K>} propsToChange - props to merge into the event to change
     * @param {number} index - the index of the event to change
     */
    updateOneEvent<K extends keyof EventInputModel>(propsToChange: Pick<EventInputModel, K>, index: number): void {
        const newEvent = _.cloneDeep(this.state.events[index]);
        if (!newEvent) {
            return;
        }
        const newEvents = this.state.events.slice();
        newEvents[index] = Object.assign(newEvent, propsToChange);
        this.setState({events: newEvents});
    }

    /**
     * Examines state and determines if events are ready to be added to calendar.  Returns a ValidationError if there is
     * a problem, and null if there is not.
     * 
     * @return {ValidationError | null} error object if events are not ready to be added to calendar; null otherwise
     */
    validateOptions(): ValidationError | null {
        if (!this.props.calendarApi || !this.props.calendarApi.getIsSignedIn()) {
            return new ValidationError(ValidationErrorReason.PERMISSION_DENIED);
        }
        if (!this.state.selectedCalendar) {
            return new ValidationError(ValidationErrorReason.NO_CALENDAR_SELECTED);
        }
        return null;
    }

    /**
     * Callback for when a "add to calendar" button is pressed.  Attempts to add an event to the user's calendar.  This
     * method sets state.
     * 
     * @param {number} index - the index of the event in this.state.events to add to the user's calendar
     * @return {Promise<void>} Promise that resolves after the event is added
     */
    addButtonPressed(index: number): Promise<void> {
        const event = this.state.events[index];
        if (!event || !event.getIsReadyToAdd()) {
            return Promise.resolve();
        }

        const error = this.validateOptions();
        if (error) {
            this.updateOneEvent({buttonState: EventInputButtonState.error, error: error}, index);
            return Promise.resolve();
        } else {
            return this.addModelToCalendar(index);
        }
    }

    /**
     * Callback for when the "add all to calendar" button is pressed.  Attempts to add all events to the user's
     * calendar.  This method sets state.
     */
    async addAllButtonPressed(): Promise<void> {
        this.setState({isAddingAll: true});
        for (let i = 0; i < this.state.events.length; i++) { // Add one at a time so we don't get rate limited
            await this.addButtonPressed(i);
        }
        this.setState({isAddingAll: false});
    }

    /**
     * Calls on the CalendarApi specified through props and attempts to add an event to the user's calendar.  Returns a
     * Promise that resolves when the task is finished, whether there is an error or not; it never rejects.  Does not
     * set state immediately, but does set state asynchronously.
     * 
     * @param index - the index of the event in this.state.events to add to the user's calendar
     * @return {Promise<void>} a Promise that resolves when the task is done
     */
    addModelToCalendar(index: number): Promise<void> {
        if (!this.props.calendarApi || !this.state.selectedCalendar) {
            window.console.warn("Cannot add event to calendar: API not loaded or no selected calendar.");
            return Promise.resolve();
        }
        const event = this.state.events[index];
        if (!event) {
            console.warn(`Cannot add invalid event at index ${index} to calendar.`);
            return Promise.resolve();
        }

        this.updateOneEvent({buttonState: EventInputButtonState.loading, error: null}, index);
        return this.props.calendarApi.createEvent(this.state.selectedCalendar.id, event)
            .then((htmlLink) => {
                this.analytics.sendEvent({category: "Calendar", action: "Event added"});
                if (event.isCourse) {
                    this.analytics.sendEvent({category: "Calendar", action: "Course added"});
                } else {
                    this.analytics.sendEvent({category: "Calendar", action: "Exam added"});
                }
                this.updateOneEvent(
                    {buttonState: EventInputButtonState.success, successUrl: htmlLink}, index
                );
            })
            .catch(error => {
                if (!(error instanceof ValidationError)) {
                    window.console.error(error);
                }
                this.updateOneEvent({buttonState: EventInputButtonState.error, error: error}, index);
            });
    }

    /**
     * @return an array of table rows
     */
    renderEventTableRows(): JSX.Element[] {
        return this.state.events.map((event, index) => (
            <EventTableRow
                key={index}
                model={event}
                onModelChangeRequested={propsToChange => this.updateOneEvent(propsToChange, index)}
                onAddButtonPressed={() => this.addButtonPressed(index)}
            />
            )
        );
    }

    /**
     * Renders the table and its options.
     * 
     * @return {JSX.Element} the element to render
     */
    render(): JSX.Element {
        let addAllButton;
        if (this.state.isAddingAll) {
            addAllButton = <button className="btn btn-light" disabled={true}>Working...</button>;
        } else if (this.state.events.length > 0) {
            addAllButton = (
                <button className="btn btn-primary" onClick={this.addAllButtonPressed}>
                    Add all to calendar
                </button>
            );
        } else {
            addAllButton = <button className="btn btn-primary" disabled={true}>Nothing detected</button>;
        }

        return (
        <div className="EventTable">
            <div className="EventTable-options-container">
                <p>
                    Tip: you can go to <a href="https://www.google.com/calendar/" target="_blank" rel="noopener noreferrer">www.google.com/calendar</a>,
                    create a new calendar there, and then press "Refresh list"
                </p>
                <EventTableOptions
                    calendarApi={this.props.calendarApi}
                    selectedCalendar={this.state.selectedCalendar}
                    onCalendarSelected={calendar => this.setState({selectedCalendar: calendar})}
                />
                <p>{addAllButton}</p>
            </div>
            <div className="table-responsive">
                <table className="table table-hover table-sm">
                    <thead>
                        <tr>
                            <td>Class or final name</td>
                            <td>Days (MTWTFSS)</td>
                            <td>Time (start - end)</td>
                            <td>Location</td>
                            <td>Add to calendar</td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderEventTableRows()}
                        <tr onClick={this.addCustomEvent}>
                            <td colSpan={5}>
                                <i className="fa fa-plus-circle EventTable-add-custom-event" aria-hidden="true" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        );
    }
}

export default EventTable;
