import { PROPS_FOR_STEP } from "AppWorkflowStep";

export function NavSidebar() {
    return <div className="position-sticky" style={{ top: "15px" }}>
        <div className="text-body text-opacity-50 fst-italic pb-1">Navigate to...</div>
        <div className="list-group list-group-flush font-heading">
            {Object.values(PROPS_FOR_STEP).map( ({ id, heading }) =>
                <a href={"#" + id} key={id} className="list-group-item list-group-item-action">{heading}</a>
            )}
        </div>
    </div>;
}
