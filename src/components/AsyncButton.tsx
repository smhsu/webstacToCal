import * as React from "react";
import { ApiHttpError } from "../CalendarApi";
import ErrorButton from "./ErrorButton";

/**
 * @template T - the resolution type of the Promise provided to this button
 */
interface AsyncButtonProps<T> {
    /**
     * CSS classes for the button in its normal state.
     */
    className?: string;

    /**
     * Text of the button if there is an error.  A reasonable default is provided.
     */
    errorContent?: string;

    /**
     * A function that provides a Promise to be executed when the button is clicked.
     */
    onClick?(): Promise<T>;

    /**
     * A callback for when the Promise provided by onClick resolves.  The first argument will contain the resolved
     * value.
     * 
     * @param {T} resolveValue - the value the Promise resolved with.
     */
    onPromiseResolved?(resolveValue: T): void;
}

interface AsyncButtonState {
    isLoading: boolean;
    isError: boolean;
    errorTooltip: string;
}

/**
 * A button that has three states -- normal, loading, and error.  Takes a function that provides a Promise as a means
 * of switching between these states.  While the Promise is pending, displays a disabled button.  If it rejects,
 * displays an error button that can retry the Promise.  Finally, if the Promise resolves, returns the button to its
 * normal state.
 * 
 * @template T - the resolution type of the Promise provided to this button
 * @author Silas Hsu
 */
class AsyncButton<T> extends React.Component<AsyncButtonProps<T>, AsyncButtonState> {
    static defaultProps = {
        errorContent: "Error - retry?"
    };

    constructor(props: AsyncButtonProps<T>) {
        super(props);
        this.state = {
            isLoading: false,
            isError: false,
            errorTooltip: "",
        };
        this.buttonClicked = this.buttonClicked.bind(this);
    }

    /**
     * Calls the promise-returning function provided via props, and then executes it.  This function sets the loading
     * state immediately, and also sets state when the promise resolves or rejects.
     */
    buttonClicked(): void {
        if (!this.props.onClick) {
            return;
        }
        this.setState({isLoading: true});
        this.props.onClick()
            .then((resolveValue) => {
                if (this.props.onPromiseResolved) {
                    this.props.onPromiseResolved(resolveValue);
                }
                this.setState({isLoading: false});
            })
            .catch((error) => {
                window.console.error(error);
                this.setState({
                    isLoading: false,
                    isError: true,
                    errorTooltip: error instanceof ApiHttpError ? error.message : ""
                });
            });
    }

    /**
     * - Normal state - renders a button with text specified by this.props.children.
     * - Loading state - renders a disabled button.
     * - Error state - renders an error button that can retry the promise, and has a tooltip depending on the error.
     * 
     * @return {JSX.Element} the element to render
     */
    render(): JSX.Element {
        if (this.state.isLoading) {
            return <button className="btn btn-light" disabled={true}>Working...</button>;
        }
        if (this.state.isError) {
            return (
            <ErrorButton tooltip={this.state.errorTooltip} onClick={this.buttonClicked}>
                {this.props.errorContent}
            </ErrorButton>
            );
        }
        
        return <button className={this.props.className} onClick={this.buttonClicked}>{this.props.children}</button>;
    }
}

export default AsyncButton;
