import React, { useCallback } from "react";
import { GoogleEventExporter } from "src/eventLogic/GoogleEventExporter";
import { ISemester } from "src/eventLogic/ISemester";
import { ApiHttpError } from "src/google/CalendarApi";
import { ActionType, IUpdateStateAction } from "src/state/editorStatesActions";
import { IEventEditorState } from "src/state/IEventEditorState";
import { EventExportState } from "src/state/EventExportState";

const EXPORTER = new GoogleEventExporter();

export function useEventExporter(
    calendarId: string,
    semester: ISemester | null,
    dispatch: React.Dispatch<IUpdateStateAction>
) {
    const exportOne = useCallback(async(toExport: IEventEditorState, setStateBeforeExport=true) => {
        const dispatchChange = (updates: Partial<EventExportState>) => {
            dispatch({
                type: ActionType.UpdateExportStates,
                ids: [toExport.id],
                updates: [updates]
            });
        };

        if (!semester) {
            dispatchChange({ isExporting: false, errorMessage: "No semester selected" });
            return false;
        }

        if (setStateBeforeExport) {
            dispatchChange({
                isExporting: true,
                successUrl: "",
                errorMessage: ""
            });
        }

        let successUrl = "";
        let errorMessage = "";
        let wasSuccessful = false;
        try {
            successUrl = await EXPORTER.exportOne(toExport.inputs, calendarId, semester);
            wasSuccessful = true;
        } catch (error) {
            console.error(error);
            errorMessage = error instanceof ApiHttpError ? error.message : "Unknown error (bug?)";
        }

        dispatchChange({
            isExporting: false,
            successUrl,
            errorMessage
        });
        return wasSuccessful;
    }, [calendarId, semester, dispatch]);

    const exportMany = useCallback((exports: IEventEditorState[]): Array<Promise<boolean>> => {
        dispatch({ // Set everything to be exporting
            type: ActionType.UpdateExportStates,
            ids: exports.map(toExport => toExport.id),
            updates: new Array(exports.length).fill({
                isExporting: true,
                successUrl: "",
                errorMessage: ""
            })
        });

        const promises: Array<Promise<boolean>> = [];
        let previousPromise = Promise.resolve(true);
        for (const toExport of exports) {
            const waitPrevThenExportOne = previousPromise.then(() => exportOne(toExport, false));
            promises.push(waitPrevThenExportOne);
            previousPromise = waitPrevThenExportOne;
        }
        return promises;
    }, [dispatch, exportOne]);

    return { exportOne, exportMany };
}
