import React from "react";

type ChildElementMaker = (cssClasses: string) => JSX.Element;

interface IEventEditorLayoutProps {
    renderLegend: ChildElementMaker
    renderCol1: ChildElementMaker;
    renderCol2: ChildElementMaker;
    renderCol3: ChildElementMaker;
    renderValidationErrors: ChildElementMaker;
    renderExportErrors: ChildElementMaker
}

export function EventEditorLayout(props: IEventEditorLayoutProps) {
    const { renderLegend, renderCol1, renderCol2, renderCol3, renderValidationErrors, renderExportErrors } = props;
    return <fieldset className="EventEditor border border-secondary px-3 pt-2 pb-md-1 pb-3 bg-light">
        <div className="row">
            {renderLegend("col-auto")}
            {renderCol1("col-md col-12")}
            <SmallScreenColBreak />
            {renderCol2("col-auto mt-2 mt-md-0")}
            {renderValidationErrors("d-md-none col mt-3")} { /* Only visible on small screens */ }
            <SmallScreenColBreak />
            {renderCol3("col-xl-2 col-md-3 col-auto mt-3")}
            {renderExportErrors("d-md-none col mt-3")} { /* Only visible on small screens */ }
        </div>
        <div className="row d-md-flex d-none mt-3 mb-1">{ /* Only visible on larger screens */ }
            {renderValidationErrors("col-7")}
            {renderExportErrors("col-5")}
        </div>
    </fieldset>;
}

function SmallScreenColBreak() {
    return <div className="w-100 d-block d-md-none" />;
}
