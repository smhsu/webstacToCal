class ParsedEventModel {
    static readonly DAYS_PER_WEEK = 7;

    name: string = "";
    location: string = "";
    
    date: string = "";
    startTime: string = "";
    endTime: string = "";
    
    repeatingDays: boolean[] = Array(ParsedEventModel.DAYS_PER_WEEK).fill(false);
    endRepeat: string = "";
}

export default ParsedEventModel;
