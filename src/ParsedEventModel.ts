class ParsedEventModel {
    static readonly DAYS_PER_WEEK = 7;

    name: string = "";
    location: string = "";
    repeatingDays: boolean[] = Array(ParsedEventModel.DAYS_PER_WEEK).fill(false);
    startTime: string = "";
    endTime: string = "";
    startDate: string = "";
    endDate: string = "";
}

export default ParsedEventModel;
