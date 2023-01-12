import React from "react";
import { AppWorkflowStep } from "src/AppWorkflowStep";
import { AppStepLink } from "src/components/AppStepLink";

export function Navigation() {
    const stepLinks = [];
    for (const step of Object.values(AppWorkflowStep)) {
        if (typeof step === "string") {
            continue;
        }
        stepLinks.push(<AppStepLink step={step} className="list-group-item list-group-item-action" />);
    }

    return <div className="position-sticky" style={{ top: "15px" }}>
        <div className="text-body text-opacity-50 fst-italic pb-1">Navigate to...</div>
        <div className="list-group list-group-flush font-heading">{stepLinks}</div>
    </div>;
}
