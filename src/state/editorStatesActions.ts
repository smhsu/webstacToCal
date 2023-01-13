import { EventEditorId } from "src/state/IEventEditorState";
import { EventExportState } from "src/state/EventExportState";
import { IEventInputs } from "src/eventLogic/IEventInputs";

export enum ActionType {
    Replace,
    UpdateInputs,
    SetSelectionForExport,
    UpdateExportStates
}

interface IReplaceAction {
    type: ActionType.Replace,
    replacementInputs: IEventInputs[];
}

interface IUpdateInputsAction {
    type: ActionType.UpdateInputs;
    id: EventEditorId;
    updates: Partial<IEventInputs>;
}

interface ISetSelectionForExport {
    type: ActionType.SetSelectionForExport;
    ids: EventEditorId[];
    newSelectionState: boolean;
}

export interface IUpdateExportStatesAction {
    type: ActionType.UpdateExportStates;
    ids: EventEditorId[];
    updates: Partial<EventExportState>[];
}

export type IUpdateStateAction = IReplaceAction | IUpdateInputsAction | ISetSelectionForExport |
    IUpdateExportStatesAction;
