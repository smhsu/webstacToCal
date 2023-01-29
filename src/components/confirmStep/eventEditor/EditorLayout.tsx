import React from "react";

type ChildElementMaker = (cssClasses: string) => JSX.Element | null;

interface IEditorLayoutProps {
    className?: string;
    renderLegend: ChildElementMaker;
    renderCol0: ChildElementMaker;
    renderCol1: ChildElementMaker;
    renderCol2: ChildElementMaker;
    renderCol3: ChildElementMaker;
    renderValidationErrors: ChildElementMaker;
    renderExportErrors: ChildElementMaker
}

export function EditorLayout(props: IEditorLayoutProps) {
    const { renderLegend, renderCol0, renderCol1, renderCol2, renderCol3, renderValidationErrors,
        renderExportErrors } = props;


    const bottomRowErrs = [renderValidationErrors("col mt-2"), renderExportErrors("col mt-2")];
    let bottomRow = null;
    if (bottomRowErrs.some(element => element !== null)) {
        // Bottom row only visible on large screens
        bottomRow = <div className="row d-md-flex d-none">
            {renderCol0("col-auto invisible")} {/* Invisible first column to make a matching left margin */ }
            {bottomRowErrs[0]}
            {bottomRowErrs[1]}
        </div>;
    }

    const extraCss = props.className || "";
    return <fieldset className={"row border border-secondary px-2 pt-2 pb-md-2 pb-3 " + extraCss}>
        {renderLegend("d-none")}
        {renderCol0("col-auto")}
        {renderCol1("col")}
        <SmallScreenColBreak />
        {renderCol2("col-auto mt-md-0 mt-2")}
        {renderValidationErrors("d-md-none col mt-3")} { /* Only visible on small screens */ }
        <SmallScreenColBreak />
        {renderCol3("col-auto mt-md-0 mt-3")}
        {renderExportErrors("d-md-none col mt-3")} { /* Only visible on small screens */ }

        {bottomRow}
    </fieldset>;
}

function SmallScreenColBreak() {
    return <div className="w-100 d-block d-md-none" />;
}
