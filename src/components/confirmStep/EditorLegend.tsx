import { DESCRIPTION_FOR_TYPE, WebstacEventType } from "src/eventLogic/IWebstacEvent";
import "./EditorLegend.css";

interface IEditorLegendProps {
    className?: string;
    eventType: WebstacEventType;
    index: number;
}

export function EditorLegend(props: IEditorLegendProps) {
    const eventTypeDescription = DESCRIPTION_FOR_TYPE[props.eventType];
    return <legend
        className={"d-flex flex-md-column flex-row justify-content-md-center align-items-md-center" +
            " m-md-0 gap-md-0 gap-1 fs-5 " +
            (props.className || "")
        }
    >
        <span className="EditorLegend-type-description">{eventTypeDescription}</span>
        <span>{props.index + 1}</span>
    </legend>;
}
