import { useMemo } from "react";

import { EventValidator } from "src/eventLogic/EventValidator";
import { IValidationError } from "src/eventLogic/IValidationError";
import { IWebstacEvent } from "src/eventLogic/IWebstacEvent";

const VALIDATOR = new EventValidator();

export function useEventInputValidation(eventData: IWebstacEvent[]): IValidationError[][] {
    const errorCache = useMemo(() => new Map<IWebstacEvent, IValidationError[]>(), []);

    // Clear the cache of old values
    const currentUserInputs = new Set(eventData);
    for (const oldKey of errorCache.keys()) {
        // If the cache has a user input that's not in the current set of user inputs...
        if (!currentUserInputs.has(oldKey)) {
            errorCache.delete(oldKey); // Modifying a Map or Set while iterating over it is ok
        }
    }

    const allErrors: IValidationError[][] = [];
    for (const userInput of eventData) {
        let errors = errorCache.get(userInput);
        if (errors === undefined) {
            errors = VALIDATOR.validate(userInput);
            errorCache.set(userInput, errors);

        }
        allErrors.push(errors);
    }

    return allErrors;
}
