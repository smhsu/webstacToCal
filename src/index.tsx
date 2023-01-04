import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "src/components/App";
import reportWebVitals from "src/reportWebVitals";
import "./index.css";

const rootDom = document.getElementById("root");
if (!rootDom) {
    throw new Error("Could not find an HTML element with id of `root` in which to render the React app.  " +
        "Be sure this script is running *after* the appearance of that element in the HTML file.");
}
const root = createRoot(rootDom);
root.render(<React.StrictMode><App /></React.StrictMode>);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
