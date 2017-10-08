import * as React from "react";
import { ApiHttpError } from "../CalendarApi";
import ErrorButton from "./ErrorButton";

interface AsyncButtonProps<T> {
    className?: string;
    errorContent?: string;
    onClick?(): Promise<T>;
    onPromiseResolved?(resolveValue: T): void;
}

interface AsyncButtonState {
    isLoading: boolean;
    isError: boolean;
    errorTooltip: string;
}

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
