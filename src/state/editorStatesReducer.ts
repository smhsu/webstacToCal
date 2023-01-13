import { produce } from "immer";
import { ActionType, IUpdateStateAction } from "src/state/editorStatesActions";
import { EventEditorId, IEventEditorState } from "src/state/IEventEditorState";
import { EventExportState } from "src/state/EventExportState";

export function editorStatesReducer(states: IEventEditorState[], action: IUpdateStateAction): IEventEditorState[] {
    if (action.type === ActionType.Replace) {
        return action.replacementInputs.map((input, i) => (
            {
                id: i.toString(),
                inputs: input,
                exportState: new EventExportState()
            }
        ));
    }

    return updateActionReducer(states, action);
}

const updateActionReducer = produce(function updateActionReducer(
    states: IEventEditorState[], action: IUpdateStateAction
): void {
    const indexForId: Record<EventEditorId, number> = {};
    for (let i = 0; i < states.length; i++) {
        const state = states[i];
        indexForId[state.id] = i;
    }
    function findStatesWithIds(ids: EventEditorId[]) {
        return ids.map(id => states[indexForId[id]]);
    }

    switch (action.type) {
        case ActionType.UpdateInputs:
            const [toUpdate] = findStatesWithIds([action.id]);
            Object.assign(toUpdate.inputs, action.updates);
            return;
        case ActionType.SetSelectionForExport:
            updateActionReducer(states, {
                type: ActionType.UpdateExportStates,
                ids: action.ids,
                updates: new Array(action.ids.length).fill({ isSelected: action.newSelectionState })
            });
            return;
        case ActionType.UpdateExportStates:
            const statesToUpdate = findStatesWithIds(action.ids);
            for (let i = 0; i < statesToUpdate.length; i++) {
                Object.assign(statesToUpdate[i].exportState, action.updates[i]);
            }
            return;
        default:
            console.warn("Ignoring action with unknown type:");
            console.warn(action);
    }
});
