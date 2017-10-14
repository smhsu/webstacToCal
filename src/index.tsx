import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";
import "./index.css";

window.onload = () => {
    ReactDOM.render(
        <App />,
        document.getElementById("root") as HTMLElement
    );
};
registerServiceWorker();
