/***
 * Data for WUSTL's various semesters and helper methods to access them.
 ***/
 
/* Returns a new date that is the specified number of days after this one. */
Date.prototype.offsetDateBy = function(days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

/* Returns the date portion of this date's ISO string, plus the 'T' */
Date.prototype.toISODateStr = function() {
	return this.toISOString().substring(0, 11);
}

/*
 * 'startdate' must be a Javascript Date.
 * 'enddate' must be a string formatted as YYYYMMDD
 */
semesters = {
	'SP15': {
		'startDate': new Date('2015','01','12'),
		'endDate': '20150425'
	}
}
