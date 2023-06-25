/**
 * Wrapper for Google Analytics.
 *
 * @author Silas Hsu
 */
export class Analytics {

    static sendEvent(eventName: string) {
        if (gtag) {
            gtag("event", eventName);
        }
    }
}
