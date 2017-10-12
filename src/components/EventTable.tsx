import * as React from "react";
import * as _ from "lodash";

import { CalendarApi } from "../CalendarApi";
import EventTableOptions from "./EventTableOptions";
import EventTableRow from "./EventTableRow";
import { EventInputModel, EventInputButtonState } from "../EventInputModel";
import { ValidationError, ValidationErrorReason } from "../ValidationError";

interface EventTableProps {
    events: EventInputModel[];
    calendarApi?: CalendarApi;
    rawInput?: string;
}

interface EventTableState {
    events: EventInputModel[];
    selectedCalendar: gapi.client.calendar.CalendarListEntry | null;
    isAddingAll: boolean;
}

class EventTable extends React.Component<EventTableProps, EventTableState> {
    constructor(props: EventTableProps) {
        super(props);
        this.state = {
            events: props.events,
            selectedCalendar: null,
            isAddingAll: false,
        };

        this.updateOneEvent = this.updateOneEvent.bind(this);
        this.updateAllEvents = this.updateAllEvents.bind(this);
        this.validateOptions = this.validateOptions.bind(this);
        this.addButtonPressed = this.addButtonPressed.bind(this);
        this.addAllButtonPressed = this.addAllButtonPressed.bind(this);
        this.addModelToCalendar = this.addModelToCalendar.bind(this);
        this.renderEventTableRows = this.renderEventTableRows.bind(this);
    }

    componentWillReceiveProps(nextProps: EventTableProps) {
        if (this.props.events !== nextProps.events) {
            let customEvents = this.state.events.filter(event => event.isCustom);
            let newEvents = nextProps.events.concat(customEvents);
            this.setState({events: newEvents});
        }
    }

    updateOneEvent<K extends keyof EventInputModel>(propsToChange: Pick<EventInputModel, K>, index: number) {
        const newEvent = _.cloneDeep(this.state.events[index]);
        if (!newEvent) {
            return;
        }
        const newEvents = this.state.events.slice();
        newEvents[index] = Object.assign(newEvent, propsToChange);
        this.setState({events: newEvents});
    }

    updateAllEvents<K extends keyof EventInputModel>(
        propsToChange: Pick<EventInputModel, K>,
        eventShouldUpdate: (model: EventInputModel) => boolean = event => true
    ) {
        const newEvents = this.state.events.map(event => {
            if (eventShouldUpdate(event)) {
                const newEvent = _.cloneDeep(event);
                return Object.assign(newEvent, propsToChange);
            } else {
                return event;
            }
        });
        this.setState({events: newEvents});
    }

    validateOptions(): ValidationError | null {
        if (!this.props.calendarApi || !this.props.calendarApi.getIsSignedIn()) {
            return new ValidationError(ValidationErrorReason.PERMISSION_DENIED);
        }
        if (!this.state.selectedCalendar) {
            return new ValidationError(ValidationErrorReason.NO_CALENDAR_SELECTED);
        }
        return null;
    }

    addButtonPressed(index: number) {
        const event = this.state.events[index];
        if (!event || !event.getIsReadyToAdd()) {
            return;
        }

        const error = this.validateOptions();
        if (error) {
            this.updateOneEvent({buttonState: EventInputButtonState.error, error: error}, index);
        } else {
            this.updateOneEvent({buttonState: EventInputButtonState.loading, error: null}, index);
            this.addModelToCalendar(index);
        }
    }

    addAllButtonPressed() {
        const error = this.validateOptions();
        if (error) {
            this.updateAllEvents(
                {buttonState: EventInputButtonState.error, error: error}, event => event.getIsReadyToAdd()
            );
            return Promise.resolve();
        }

        this.setState({isAddingAll: true});
        this.updateAllEvents(
            {buttonState: EventInputButtonState.loading, error: null}, event => event.getIsReadyToAdd()
        );
        return Promise.all(this.state.events.map((event, index) => this.addModelToCalendar(index)))
            .then(() => this.setState({isAddingAll: false}));
    }

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
        if (!event.getIsReadyToAdd()) {
            return Promise.resolve();
        }

        return this.props.calendarApi.createEvent(this.state.selectedCalendar.id, event)
            .then((htmlLink) => this.updateOneEvent(
                {buttonState: EventInputButtonState.success, successUrl: htmlLink}, index
            ))
            .catch(error => {
                if (!(error instanceof ValidationError)) {
                    window.console.error(error);
                }
                this.updateOneEvent({buttonState: EventInputButtonState.error, error: error}, index);
            });
    }

    renderEventTableRows() {
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
        <div>
            <EventTableOptions
                calendarApi={this.props.calendarApi}
                selectedCalendar={this.state.selectedCalendar}
                onCalendarSelected={calendar => this.setState({selectedCalendar: calendar})}
            />
            <p>{addAllButton}</p>
            <table className="table table-hover table-sm table-responsive">
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
                </tbody>
            </table>
        </div>
        );
    }
}

export default EventTable;
