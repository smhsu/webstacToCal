import React from "react";

type ChildElementMaker = (cssClasses: string) => JSX.Element;

interface IEditorLayoutProps {
    className?: string;
    renderLegend: ChildElementMaker
    renderCol1: ChildElementMaker;
    renderCol2: ChildElementMaker;
    renderCol3: ChildElementMaker;
    renderValidationErrors: ChildElementMaker;
    renderExportErrors: ChildElementMaker
}

export function EditorLayout(props: IEditorLayoutProps) {
    const { renderLegend, renderCol1, renderCol2, renderCol3, renderValidationErrors, renderExportErrors } = props;
    const extraCss = props.className || "";
    return <fieldset className={"row EventEditor border border-secondary ps-1 pt-2 pb-md-0 pb-3 " + extraCss}>
        {renderLegend("col-auto")}
        {renderCol1("col-md col-12")}
        <SmallScreenColBreak />
        {renderCol2("col-auto mt-2 mt-md-0")}
        {renderValidationErrors("d-md-none col mt-3")} { /* Only visible on small screens */ }
        <SmallScreenColBreak />
        {renderCol3("col-xl-2 col-md-3 col-auto mt-3")}
        {renderExportErrors("d-md-none col mt-3")} { /* Only visible on small screens */ }

        { /* Render row of errors that's only visible on larger screens */ }
        <div className="row d-md-flex d-none mt-3">
            { /* Render an invisible legend so there's a left margin that's the width of the legend */ }
            {renderLegend("col-auto invisible height-0")}
            {renderValidationErrors("col")}
            {renderExportErrors("col")}
        </div>
    </fieldset>;
}

function SmallScreenColBreak() {
    return <div className="w-100 d-block d-md-none" />;
}
