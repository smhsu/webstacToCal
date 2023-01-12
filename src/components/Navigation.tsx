import { AppWorkflowStep } from "src/AppWorkflowStep";
import { AppStepLink } from "src/components/AppStepLink";

export function Navigation() {
    const stepLinks = [];
    for (const step of Object.values(AppWorkflowStep)) {
        if (typeof step === "string") {
            continue;
        }
        stepLinks.push(<AppStepLink key={step} step={step} className="list-group-item list-group-item-action"/>);
    }

    return <nav
        className="position-sticky col-md-2 align-self-start d-md-block d-none"
        style={{ top: "15px", zIndex: 1 }}
    >
        <div className="text-body text-opacity-50 fst-italic pb-1">Navigate to...</div>
        <div className="list-group list-group-flush font-heading">{stepLinks}</div>
    </nav>;
}
