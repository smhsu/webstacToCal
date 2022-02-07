import { PROPS_FOR_STEP } from "../EventExportStep";

export function NavSidebar() {
    return <div>
        <div className="text-black-50 fst-italic pb-1">Navigate to...</div>
        <div className="list-group-flush font-heading">
            <a href="#top" className="list-group-item list-group-item-action">Top</a>
            {Object.values(PROPS_FOR_STEP).map( ({ id, title }) =>
                <a href={"#" + id} key={id} className="list-group-item list-group-item-action">{title}</a>
            )}
            <a href="#about" className="list-group-item list-group-item-action">About this site</a>
        </div>
    </div>;
}
