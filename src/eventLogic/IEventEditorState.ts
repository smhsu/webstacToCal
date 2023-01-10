import { IEventExportState } from "./IEventExportState";
import { IEventInputs } from "./IEventInputs";

export type EventId = string;

export interface IEventEditorState {
    id: EventId;
    inputs: IEventInputs;
    isSelected: boolean;
    exportState: IEventExportState;
}
