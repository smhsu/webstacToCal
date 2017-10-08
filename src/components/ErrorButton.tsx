import * as React from "react";

interface ErrorButtonProps {
    tooltip?: string; // Tooltip for the button
    onClick?(): void; // Callback when button is clicked
}

/**
 * A nice, big, red error button, with optional tooltip.  Requires jQuery and Bootstrap JS in global scope for the
 * tooltip.
 * 
 * @author Silas Hsu
 */
class ErrorButton extends React.Component<ErrorButtonProps, {}> {
    private button: HTMLButtonElement | null;

    constructor(props: ErrorButtonProps) {
        super(props);
        this.button = null;
    }

    /**
     * Initializes the tooltip.
     * 
     * @override
     */
    componentDidMount() {
        this.initTooltip();
    }

    /**
     * Reinitalizes the tooltip if it has changed.
     * 
     * @param {ErrorButtonProps} prevProps - props that the component used to have
     * @override
     */
    componentDidUpdate(prevProps: ErrorButtonProps) {
        if (this.props.tooltip !== prevProps.tooltip) {
            this.initTooltip();
        }
    }

    /**
     * @return {JSX.Element} the button
     */
    render(): JSX.Element {
        return (
        <button
            onClick={this.props.onClick}
            className="btn btn-danger"
            ref={(node) => this.button = node}
            data-toggle={this.props.tooltip && "tooltip"}
            data-placement={this.props.tooltip && "top"}
            title={this.props.tooltip}
        >
            <i className="fa fa-times" /> {/* 'times', but we use it just because it looks like a big X. */}
            {this.props.children}
        </button>
        );
    }

    /**
     * Initializes the tooltip, if the button has been mounted and there is a tooltip.
     */
    private initTooltip(): void {
        if (!this.button || !this.props.tooltip) {
            return;
        }
        $(this.button).tooltip(); // Relies on both jQuery and Bootstrap JS in global scope
    }
}

export default ErrorButton;
