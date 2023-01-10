import { IEventExportState } from "./IEventExportState";
import { IWebstacEventData } from "./IWebstacEvent";

export type EventId = string;

export interface IEventEditorState {
    id: EventId;
    data: IWebstacEventData;
    isSelected: boolean;
    exportState: IEventExportState;
}
