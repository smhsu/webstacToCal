import ReactGA from "react-ga";

const TRACKING_ID = "UA-58192647-1";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

/**
 * Wrapper for Google Analytics.  Handles initialization and only sends events if the environment is production.
 *
 * @author Silas Hsu
 */
export class Analytics {
    private static isInitialized = false;

    /**
     * Makes a new Analytics object.  Will initialize Google Analytics, but only on first call to this constructor.
     */
    constructor() {
        if (!Analytics.isInitialized && IS_PRODUCTION) {
            ReactGA.initialize(TRACKING_ID);
            ReactGA.set({ anonymizeIp: true });
        }
    }

    /**
     * Sends a page view event.
     *
     * @param {string} path - relative path of the page
     */
    sendPageView(path: string) {
        if (IS_PRODUCTION) {
            ReactGA.pageview(path);
        }
    }

    /**
     * Record user interaction.  See https://github.com/react-ga/react-ga#reactgaeventargs
     */
    sendEvent(args: ReactGA.EventArgs) {
        if (IS_PRODUCTION) {
            ReactGA.event(args);
        }
    }
}
