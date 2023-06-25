import { immerable } from "immer";

export interface IEventExportState {
    isSelected: boolean;
    isExporting: boolean;
    successUrl: string;
    errorMessage: string;
}

export class EventExportState implements IEventExportState {
    [immerable] = true;

    /**
     * Whether the user has targeted this event for export.  Note that this does NOT indicate whether the event is valid
     * for export or whether it has already been exported.
     */
    public isSelected: boolean;
    public isExporting: boolean;
    public successUrl: string;
    public errorMessage: string;

    constructor() {
        this.isSelected = true;
        this.isExporting = false;
        this.successUrl = "";
        this.errorMessage = "";
    }

    isInBatchExport(hasValidationErrors: boolean) {
        return !hasValidationErrors && this.isSelected && this.successUrl.length <= 0;
    }
}
