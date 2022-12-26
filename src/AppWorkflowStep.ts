export enum AppWorkflowStep {
    CONFIGURE,
    COPYPASTE,
    CONFIRM
}

interface StepProps {
    id: string;
    title: string;
}
export const PROPS_FOR_STEP: Record<AppWorkflowStep, StepProps> = {
    [AppWorkflowStep.CONFIGURE]: { id: "configure", title: "① CONFIGURE" },
    [AppWorkflowStep.COPYPASTE]: { id: "copypaste", title: "② COPYPASTE" },
    [AppWorkflowStep.CONFIRM]: { id: "confirm", title: "③ CONFIRM" }
};
