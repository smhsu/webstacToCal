export enum EventExportStep {
    PERMISSION,
    CONFIGURE,
    COPYPASTE,
    CONFIRM
}

interface StepProps {
    id: string;
    title: string;
}
export const PROPS_FOR_STEP: Record<EventExportStep, StepProps> = {
    [EventExportStep.PERMISSION]: { id: "permission", title: "① PERMISSION" },
    [EventExportStep.CONFIGURE]: { id: "configure", title: "② CONFIGURE" },
    [EventExportStep.COPYPASTE]: { id: "copypaste", title: "③ COPYPASTE" },
    [EventExportStep.CONFIRM]: { id: "confirm", title: "④ CONFIRM" }
};
