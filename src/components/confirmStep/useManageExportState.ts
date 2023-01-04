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

    const exportOne = async (index: number) => {
        if (!semester) {
            dispatchChange(index, {
                errorMessage: "No semester selected"
            });
            return;
        }

        dispatchChange(index, {
            isExporting: true,
            successUrl: "",
            errorMessage: ""
        });

        let successUrl = "";
        let errorMessage = "";
        try {
            successUrl = await EXPORTER.exportOne(editorStates[index].data, calendarId, semester);
        } catch (error) {
            console.error(error);
            errorMessage = error instanceof ApiHttpError ? error.message : "Unknown error (bug?)";
        }

        dispatchChange(index, {
            isExporting: false,
            successUrl,
            errorMessage
        });
    };

    return { exportOne };
}
