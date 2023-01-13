import { EventExportState } from "src/state/EventExportState";
import { IEventInputs } from "src/eventLogic/IEventInputs";

export type EventEditorId = string;

export interface IEventEditorState {
    id: EventEditorId;
    inputs: IEventInputs;
    exportState: EventExportState;
}
