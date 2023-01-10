import { useMemo } from "react";

import { EventValidator } from "src/eventLogic/EventValidator";
import { EventId, IEventEditorState } from "src/eventLogic/IEventEditorState";
import { IValidationError } from "src/eventLogic/IValidationError";
import { IEventInputs } from "src/eventLogic/IEventInputs";

const VALIDATOR = new EventValidator();

export function useEventInputValidation(editorStates: IEventEditorState[]): Record<EventId, IValidationError[]> {
    const errorCache = useMemo(() => new Map<IEventInputs, IValidationError[]>(), []);

    // Clear the cache of old values
    const currentUserInputs = new Set(editorStates.map(state => state.inputs));
    for (const oldKey of errorCache.keys()) {
        // If the cache has a user input that's not in the current set of user inputs...
        if (!currentUserInputs.has(oldKey)) {
            errorCache.delete(oldKey); // Modifying a Map or Set while iterating over it is ok
        }
    }

    const errorsById: Record<EventId, IValidationError[]> = {};
    for (const state of editorStates) {
        const userInput = state.inputs;
        let errors = errorCache.get(userInput);
        if (errors === undefined) {
            errors = VALIDATOR.validate(userInput);
            errorCache.set(userInput, errors);

        }
        errorsById[state.id] = errors;
    }

    return errorsById;
}
