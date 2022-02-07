import { PropsWithChildren, useState } from "react";

/**
 * @template T
 * @template E
 * @param T - the resolution type of the Promises provided to this button
 * @param E - the type of errors thrown when Promises provided to this button reject.
 */
interface AsyncButtonProps<T, E> {
    /**
     * CSS classes for the button in its normal state.
     */
    className?: string;

    /**
     * A function that provides a Promise to be executed when the button is clicked.
     */
    promiseFactory: () => Promise<T>;

    /**
     * A callback for when the Promise provided by `promiseFactory` resolves.  The first argument will contain the
     * resolved value.
     *
     * @param resolveValue - the value the Promise resolved with.
     */
    onPromiseResolved: (resolveValue: T) => void;

    /**
     * A callback for when the Promise provided by `promiseFactory` rejects.  The first argument will contain the
     * value that was thrown.
     *
     * @param error - the error the Promise rejected with.
     */
    onPromiseRejected?: (error: E) => void;
}

/**
 * Renders a bah.
 *
 * @props props as specified by React
 */
export function AsyncButton<T, E>(props: PropsWithChildren<AsyncButtonProps<T, E>>) {
    const { className, promiseFactory, onPromiseResolved, onPromiseRejected, children } = props;
    const [isLoading, setIsLoading] = useState(false);

    if (isLoading) {
        return <button className="btn btn-light" disabled={true}>Working...</button>;
    }

    const handleButtonClicked = () => {
        setIsLoading(true);
        promiseFactory()
            .then(onPromiseResolved)
            .catch(onPromiseRejected)
            .finally(() => setIsLoading(false));
    };
    return <button className={className} onClick={handleButtonClicked}>
        {children}
    </button>;
}
