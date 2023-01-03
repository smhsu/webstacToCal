import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { IValidationError } from "eventLogic/IValidationError";

interface IValidationErrorDisplayProps {
    errors: IValidationError[];
    containerClassName?: string;
}

export function ValidationErrorDisplay(props: IValidationErrorDisplayProps) {
    return <div className={props.containerClassName}>
        {
            props.errors.map((error, i) => {
                return <div key={i}>
                    <FontAwesomeIcon icon={faTriangleExclamation} /> {error.details}
                </div>;
            })
        }
    </div>;
}
