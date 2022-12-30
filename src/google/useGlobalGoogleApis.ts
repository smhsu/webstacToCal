import { useEffect, useState } from "react";
import { CalendarApi } from "./CalendarApi";

const GAPI_URL = "https://apis.google.com/js/api.js"; // GAPI stands for Google API
const GIS_URL = "https://accounts.google.com/gsi/client"; // GIS stands for Google Identity Services
let hasAttemptedLoading = false;

/**
 * Manages loading of Google APIs and sets state when they are done loading (or had an error).
 *
 * **IMPORTANT**: Only use this hook once per app.  This is because Google APIs load in global scope, and more than one
 * use may cause incorrect load states to be reported.
 */
export function useGlobalGoogleApis() {
    const [isLoaded, setIsLoaded] = useState(
        window.gapi?.client !== undefined &&
        window.google?.accounts !== undefined
    );
    const [isError, setIsError] = useState(false);
    useEffect(() => {
        if (hasAttemptedLoading) {
            return;
        }
        Promise.all([loadGapi(), loadScript(GIS_URL)])
            .then(() => setIsLoaded(true))
            .catch(error => {
                console.error(error);
                setIsError(true);
            });
        hasAttemptedLoading = true;

    }, []);

    return { isLoaded, isError };
}

async function loadScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.onload = () => resolve();
        script.onerror = (event, source, lineno, colno, error) => reject(error);
        script.src = url;
        document.head.appendChild(script);
    });
}

async function loadGapi(): Promise<void> {
    await loadScript(GAPI_URL);
    await new Promise((resolve, reject) => {
        // https://github.com/google/google-api-javascript-client/blob/master/docs/reference.md
        gapi.load("client", {
            callback: resolve,
            onerror: reject,
            timeout: 5000,
            ontimeout: () => reject("Loading Google API timed out.")
        });
    });
    return CalendarApi.initGapi();
}
