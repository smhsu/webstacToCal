import React from "react";
import { IWebstacEvent } from "../../eventModel/IWebstacEvent";
import { ISemester } from "../../eventModel/ISemester";
import { EventExportMethod } from "../../eventExport/EventExportMethod";
import { EventEditor } from "./EventEditor";


interface IExportConfirmAreaProps {
    exportMethod: EventExportMethod;
    semester: ISemester | null;
    webstacEvents: IWebstacEvent[];
    onEventsChanged: (newEvents: IWebstacEvent[]) => void;
}

export function ExportConfirmArea(props: IExportConfirmAreaProps) {
    const { exportMethod, semester, webstacEvents, onEventsChanged } = props;

    const handleOneEventChanged = (updatedCalendarEvent: IWebstacEvent, index: number) => {
        const newEvents = webstacEvents.slice();
        newEvents[index] = updatedCalendarEvent;
        onEventsChanged(newEvents);
    };

    const notReadyNotifications = [];/*
    if (exportMethod === EventExportMethod.None) {
        notReadyNotifications.push(<li key="0">
            You must <AppStepLink step={AppWorkflowStep.Config} linkText={"choose an eventExport method"}/>.
        </li>);
    }
    if (semester === null) {
        notReadyNotifications.push(<li key="1">
            You must <AppStepLink step={AppWorkflowStep.Config} linkText={"choose a semester"} />.
        </li>);
    }
    if (webstacEvents.length <= 0) {
        notReadyNotifications.push(<li key="2">You must copy-paste something valid from WebSTAC.</li>);
    }
    if (notReadyNotifications.length > 0) {
        return <div>
            Hold your horses!  To eventExport events:
            <ul className="mt-1">{notReadyNotifications}</ul>
        </div>;
    }*/

    return <div>
        <button className="btn btn-primary">Add 3 selected events to Google Calendar</button>
        <div className="span-four-cols">
            <label className="d-block">Select all</label>
            <input type="checkbox" className="form-check-input" />
        </div>
        <div>
            {
                webstacEvents.map((event, index) => {
                    return <EventEditor
                        key={index}
                        calendarEvent={event}
                        onChange={updatedCalendarEvent => handleOneEventChanged(updatedCalendarEvent, index)}
                    />;
                })
            }
        </div>
    </div>;
}
