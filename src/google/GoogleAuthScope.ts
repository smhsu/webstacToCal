/**
 * https://developers.google.com/identity/protocols/oauth2/scopes#calendar
 */
export enum GoogleAuthScope {
    ListCalendars = "https://www.googleapis.com/auth/calendar.readonly",
    ReadWriteEvents = "https://www.googleapis.com/auth/calendar.events"
}
