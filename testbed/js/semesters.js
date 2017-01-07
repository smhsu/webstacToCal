/***
 * semesters.js
 * Data for WUSTL's various semesters and helper methods to access them.
 * Author: Silas Hsu, December 2014
 * PLEASE give acknowledgement if you copy this code.
 ***/

/**
 * Returns a new date that is the specified number of days after this one.
 * Thank you StackOverflow!  http://stackoverflow.com/questions/563406/add-days-to-datetime
 */
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
	'SP17': {
		'startDate': new Date(2017,00,17), // 0 = January
		'endDate': '20170428'
	}
}
