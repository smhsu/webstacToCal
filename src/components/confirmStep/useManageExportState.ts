import { GoogleEventExporter } from "src/eventLogic/GoogleEventExporter";
import { IEventEditorState } from "src/eventLogic/IEventEditorState";
import { IEventExportState } from "src/eventLogic/IEventExportState";
import { ISemester } from "src/eventLogic/ISemester";
import { ApiHttpError } from "src/google/CalendarApi";

const EXPORTER = new GoogleEventExporter();

export function useManageExportState(
    editorStates: IEventEditorState[],
    calendarId: string,
    semester: ISemester | null,
    onEditorStatesChanged: (newEvents: IEventEditorState[]) => void
) {
    const dispatchChange = (index: number, updates: Partial<IEventExportState>) => {
        const oldState = editorStates[index];
        const updatedState: IEventEditorState = {
            ...oldState,
            exportState: {
                ...oldState.exportState,
                ...updates
            }
        };
        const newStates = editorStates.slice();
        newStates[index] = updatedState;
        onEditorStatesChanged(newStates);
    };

    const exportOne = async(toExport: IEventEditorState) => {
        const index = editorStates.findIndex(state => state.id === toExport.id);
        if (index < 0) {
            return false;
        }

        if (!semester) {
            dispatchChange(index, {
                errorMessage: "No semester selected"
            });
            return false;
        }

        dispatchChange(index, {
            isExporting: true,
            successUrl: "",
            errorMessage: ""
        });

        let successUrl = "";
        let errorMessage = "";
        let wasSuccessful = false;
        try {
            successUrl = await EXPORTER.exportOne(editorStates[index].inputs, calendarId, semester);
            wasSuccessful = true;
        } catch (error) {
            console.error(error);
            errorMessage = error instanceof ApiHttpError ? error.message : "Unknown error (bug?)";
        }

        dispatchChange(index, {
            isExporting: false,
            successUrl,
            errorMessage
        });
        return wasSuccessful;
    };

    const exportMany = async(toExport: IEventEditorState[]) => {
        // TODO set EVERYTHING to be exporting

        const results = [];
        for (const element of toExport) {
            const result = await exportOne(element);
            results.push(result);
        }
        return results;
    };

    return { exportOne, exportMany };
}
