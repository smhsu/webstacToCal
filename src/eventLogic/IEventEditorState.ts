import { IEventExportState } from "./IEventExportState";
import { IWebstacEvent } from "./IWebstacEvent";

export interface IEventEditorState {
    data: IWebstacEvent;
    isSelected: boolean;
    exportState: IEventExportState;
}
