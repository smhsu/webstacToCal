import { immerable } from "immer";

export interface IEventExportState {
    isSelected: boolean;
    isExporting: boolean;
    successUrl: string;
    errorMessage: string;
}

export class EventExportState implements IEventExportState {
    [immerable] = true;

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
