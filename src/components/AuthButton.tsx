import ErrorButton from "./ErrorButton";
import * as React from "react";

interface AuthPaneProps {
    isSignedIn: boolean; // Controls what callback is executed when the button is clicked
    onSignIn?: () => {}; // Called on sign in
    onSignOut?: () => {}; // Called on sign out
    isAuthError?: boolean; // Whether to display an error button
    authErrorMessage?: string; // The error button's tooltip
}

/**
 * A sign in or sign out button.
 * 
 * @author Silas Hsu
 */
class AuthButton extends React.Component<AuthPaneProps, {}> {
    /**
     * Depending on the passed props, renders a button that signs in or signs out, or an error button that retries the
     * operation.
     * 
     * @return {JSX.Element} a React element to render
     * @override
     */
    render(): JSX.Element {
        let buttonCallback, buttonClassName, buttonText, errorButtonText;
        if (!this.props.isSignedIn) {
            buttonCallback = this.props.onSignIn;
            buttonClassName = "btn btn-primary";
            buttonText = "Grant permission";
            errorButtonText = "Permission failed - retry?";
        } else {
            buttonCallback = this.props.onSignOut;
            buttonText = "End session";
            buttonClassName = "btn btn-light";
            errorButtonText = "End session failed - retry?";
        }

        if (this.props.isAuthError) {
            return (
            <ErrorButton onClick={buttonCallback} tooltip={this.props.authErrorMessage}>
                {errorButtonText}
            </ErrorButton>
            );
        } else {
            return <button className={buttonClassName} onClick={buttonCallback}>{buttonText}</button>;
        }
    }
}

export default AuthButton;
