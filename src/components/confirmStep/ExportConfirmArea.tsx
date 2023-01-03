import React from "react";
import { EventExportMethod } from "eventLogic/EventExportMethod";
import { ISemester } from "eventLogic/ISemester";
import { IWebstacEvent } from "eventLogic/IWebstacEvent";
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
        <button className="btn btn-primary">Add selected events to Google Calendar</button>
        <div>
            <div>3 events added.</div>
            <div>1 invalid event ignored.</div>
            <div>2 events failed to add.  See individual rows for error details.</div>
        </div>
        <div>
            Some events are not ready for export and need manual editing.
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
