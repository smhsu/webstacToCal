import { GoogleEventExporter } from "eventLogic/GoogleEventExporter";
import { IEventEditorState } from "eventLogic/IEventEditorState";
import { IEventExportState } from "eventLogic/IEventExportState";
import { ISemester } from "eventLogic/ISemester";
import { ApiHttpError } from "google/CalendarApi";

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
