/**
 * Entry point for everything dynamic in WebSTAC to Calendar.
 * 
 * @author Silas Hsu
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./components/App";
// import registerServiceWorker from "./registerServiceWorker";

/**
 * Gets whether the current browser is Internet Explorer.  Thanks to StackOverflow for this code!
 * http://stackoverflow.com/questions/19999388/jquery-check-if-user-is-using-ie
 * 
 * @return {boolean} whether the current browser is Internet Explorer
 */
function isInternetExplorer() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    var trident = ua.indexOf("Trident/");
    if (msie > 0) {
        // IE 10 or older => return version number
        // return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        return true;
    }
    if (trident > 0) {
        // IE 11 (or newer) => return version number
        // var rv = ua.indexOf('rv:');
        // return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        return true;
    }
    // Other browser
    return false;
}

/**
 * Checks that the browser is supported, and if so, creates the app root component.
 */
window.onload = () => {
    const appRootContainer = document.getElementById("root") as HTMLElement;
    if (isInternetExplorer()) {
        const alert = (
            <div style={{textAlign: "center"}} >
                <div className="alert alert-danger" style={{display: "inline-block"}} >
                    <h4><Frown /> Internet Explorer not supported. <Frown /></h4>
                    You appear to be using Internet Explorer.  WebSTAC to Calendar does not support IE.  Sorry about
                    that.
                </div>
            </div>
        );
        ReactDOM.render(alert, appRootContainer);
    } else {
        ReactDOM.render(<App />, appRootContainer);
    }
};
// registerServiceWorker();

function Frown() {
    return <span role="img" aria-label="Frown">🙁</span>;
}
