import { IEventExportState } from "eventLogic/IEventExportState";
import { IWebstacEvent } from "eventLogic/IWebstacEvent";

export interface IEventEditorState {
    data: IWebstacEvent;
    isSelected: boolean;
    exportState: IEventExportState;
}
