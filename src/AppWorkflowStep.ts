export enum AppWorkflowStep {
    Top,
    Config,
    CopyPaste,
    Confirm,
    About
}

interface StepProps {
    id: string;
    heading: string;
}

export const PROPS_FOR_STEP: Record<AppWorkflowStep, Readonly<StepProps>> = {
    // WARNING!  The ids for Top and About are set directly in index.html, as those sections are not React-controlled.
    // Thus, for Top and About, make sure the html file and the id values are consistent.
    // The other steps use ids directly from this file; changes in those steps those shouldn't break anything.
    [AppWorkflowStep.Top]: { id: "top", heading: "Top" },
    [AppWorkflowStep.Config]: { id: "configure", heading: "① CONFIGURE" },
    [AppWorkflowStep.CopyPaste]: { id: "copypaste", heading: "② COPYPASTE" },
    [AppWorkflowStep.Confirm]: { id: "confirm", heading: "③ CONFIRM" },
    [AppWorkflowStep.About]: { id: "about", heading: "About this site" }
};
