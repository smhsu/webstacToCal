export type IGoogleCalendarMetadata = Pick<gapi.client.calendar.CalendarListEntry, "id" | "summary">;
export const PRIMARY_CALENDAR: IGoogleCalendarMetadata = {
    id: "primary",
    summary: "Your primary calendar"
};
