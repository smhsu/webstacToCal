/***
 * tableParse.js
 * Parses all of a user's pasted WebSTAC classes and formats them nicely into a
 * table for the user to see.  Also converts the table's contents into valid Google
 * Calendar request bodies.
 * Author: Silas Hsu, December 2014
 * PLEASE give acknowledgement if you copy this code.
 ***/

var classnameColStr = "<td class='classname'><input type='text'></input></td>";
var checkboxColStr = "<td class='classdays'><input type='checkbox' class='mon'/><input type='checkbox' class='tue'/><input type='checkbox' class='wed'/><input type='checkbox' class='thu'/><input type='checkbox' class='fri'/><input type='checkbox' class='sat'/><input type='checkbox' class='sun'/></td>";
var timeSelect = "<select><option></option><option>8:00 AM</option><option>8:30 AM</option><option>9:00 AM</option><option>9:30 AM</option><option>10:00 AM</option><option>10:30 AM</option><option>11:00 AM</option><option>11:30 AM</option><option>12:00 PM</option><option>12:30 PM</option><option>1:00 PM</option><option>1:30 PM</option><option>2:00 PM</option><option>2:30 PM</option><option>3:00 PM</option><option>3:30 PM</option><option>4:00 PM</option><option>4:30 PM</option><option>5:00 PM</option><option>5:30 PM</option><option>6:00 PM</option><option>6:30 PM</option><option>7:00 PM</option><option>7:30 PM</option><option>8:00 PM</option><option>8:30 PM</option><option>9:00 PM</option><option>9:30 PM</option><option>10:00 PM</option><option>10:30 PM</option><option>11:00 PM</option><option>11:30 PM</option></select>";
var classlocColStr = "<td class='classloc'><input type='text'></input></td>";
var btnColStr = "<td class='btncol'><a><img class='img-responsive' src='img/gcbutton.gif'/></a>";
var parseFailedAlert = "<div class='alert alert-danger parse-failed'>\
	<p>We weren't able to detect any of your classes or finals.</p>\
	<ul>\
		<li>Be sure you're pasting your entire class schedule, including Course IDs.</li>\
		<li>You could be using an unsupported browser.  Try copying WebSTAC from the desktop version of Chrome, Firefox, Safari, or Opera.</li>\
	</ul></div>";
var reminder = "<p class='push-right parse-success'>All done?  Don't forget to <a href='https://www.google.com/calendar/' target='_blank'>visit your calendar</a> to make sure everything's correct!";

/**
 * Given a 'days of the week' string from WebSTAC, example 'M-W----', makes a
 * corresponding row of seven checkboxes.  If there is a parse error, they will
 * all be unchecked.
 */
function makeCheckboxes(dayStr) {
	var boxes = $(checkboxColStr);
	if (!dayStr || dayStr.length != 7)
		return boxes;
		
	for (i = 0; i < 7; i++) {
		if (dayStr.charAt(i) != '-')
			boxes.children()[i].checked = true;
	}
	
	return boxes;
}

/**
 * Given a 'class time' string from WebSTAC, example '10:00a-11:30a', makes
 * a pair of pre-filled selection boxes for the start and end times.  If there
 * is a parse error, returns the boxes with nothing selected.
 */
function makeTimeSelect(timeStr) {
	var col = $("<td class='classtime'></td>")
	var start = $(timeSelect);
	var end = $(timeSelect);
	col.append(start);
	col.append(' - ');
	col.append(end);
	if (!timeStr)
		return col;
		
	var split = timeStr.split('-'); // Parse time
	if (split.length != 2)
		return col;
	split[0] = split[0].toLowerCase();
	split[1] = split[1].toLowerCase();
	var startTxt = split[0].match(/\d\d?:\d\d[ap]/);
	var endTxt = split[1].match(/\d\d?:\d\d[ap]/);
	if (!startTxt || !endTxt)
		return col;
	
	var ampm;
	if (startTxt[0].charAt(startTxt[0].length - 1) == 'a') // Set start
		ampm = ' AM';
	else
		ampm = ' PM';
	start.val(startTxt[0].slice(0, startTxt[0].length - 1) + ampm);
	
	if (endTxt[0].charAt(endTxt[0].length - 1) == 'a') // Set end
		ampm = ' AM';
	else
		ampm = ' PM';
	end.val(endTxt[0].slice(0, endTxt[0].length - 1) + ampm);
	
	return col;
}

function manualAddBtnPressed() {
	addEmptyClass($('#classtable tbody'));
	$('#add-all-btn').removeClass('disabled');
	$('#add-all-btn').text('Add all to Google Calendar');
}

/**
 * Adds a new row to the user's class table with no info filled out.
 * Modified global variable classNum.
 *
 * insertBody - a tbody element
 */
var classNum = 0;
function addEmptyClass(insertBody) {
	var newrow = $("<tr></tr>");
	newrow.attr('id', 'class'+classNum);
	
	newrow.append($(classnameColStr));
	newrow.append(makeCheckboxes());
	newrow.append(makeTimeSelect());
	newrow.append($(classlocColStr));
	var btn = $(btnColStr);
	btn.children().attr('onclick', "addBtnPressed('class"+classNum+"')");
	newrow.append(btn);
	
	insertBody.find("tr:last").before(newrow);
	classNum++;
}

/**
 * Parses a user's pasted WebSTAC classes and puts them into the specified tbody element,
 * one class per row.  Tries its best to pre-fill class metadata.
 * Modifies global variable classNum.
 *
 * insertBody - a tbody element
 * returns: the number of classes that were successfully parsed.
 */
function parseAndAddClasses(insertBody) {
	var input = document.getElementById('inputbox').value;
	var classText = input.match(/[A-Z]\d\d.+/g);
	
	var numSuccess = 0;
	for (index in classText) {
		var cols = classText[index].split('\t');
		if (cols.length < 5)
			continue;
		var name = cols[1];
		
		var time = cols[4].split(' ');
		if (time.length < 2)
			time.push(null);

		var loc = null;
		if (cols.length >= 6)
			loc = cols[5];

		var newrow = $("<tr class='autoadd'></tr>");
		newrow.attr('id', 'class'+classNum);
		
		var classname = $(classnameColStr);
		classname.children()[0].value = name;
		newrow.append(classname);
		
		var checkboxes = makeCheckboxes(time[0]);
		newrow.append(checkboxes);
		
		var classtime = makeTimeSelect(time[1]);
		newrow.append(classtime);
		
		var classloc = $(classlocColStr);
		classloc.children()[0].value = loc;
		newrow.append(classloc);
		
		var btn = $(btnColStr);
		btn.children().attr('onclick', "addBtnPressed('class"+classNum+"')");
		newrow.append(btn);
		
		insertBody.find("tr:last").before(newrow);
		classNum++;
		numSuccess++;
	}
	return numSuccess;
}

/**
 * Parses WebSTAC finals and puts them into into the specified tbody element.
 * insertBody - a tbody element
 * returns: the number of finals that were successfully parsed.
 */
var monthToNum = {'Apr': '04', 'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08', 'Dec':'12'}; // I'm only putting months in which I expect finals
function parseAndAddFinals(insertBody) { 
	var input = document.getElementById('inputbox').value;
	var finals = input.match(/(Apr|May|Jun|Jul|Aug|Dec) \d\d? \d\d\d\d.*\n(\t\n)?Exam Building \/ Room:\t.*/g);
	
	var finalNum = 0;
	var toInsert = [];
	for (index in finals) {
		var lines = finals[index].split(/\n(?:\t\n)?/);
		var line1 = lines[0].split('\t');
		var line2 = lines[1].split('\t');
		if (line1.length < 3 || line2.length < 2)
			continue;
			
		var newrow = $("<tr class='yellow autoadd'></tr>")
		newrow.attr('id', 'final'+finalNum);

		// Name
		var nameCol = $(classnameColStr);
		var finalName = line1[2];
		nameCol.children()[0].value = finalName + " Final";
		newrow.append(nameCol);
		
		// Date and time
		var dateTime = line1[0].split(' '); // Example to split: "Dec 11 2014 8:00AM - 10:00AM"
		var dateCol = $("<td class='classdays'><input type='text'></input></td>");
		var timeCol = makeTimeSelect('');
		if (dateTime.length == 6) {
			var month = monthToNum[dateTime[0]];
			var day = dateTime[1];
			if (day.length == 1)
				day = '0'+day;
			var year = dateTime[2];
			dateCol.children()[0].value = year+'-'+month+'-'+day;
			timeCol = makeTimeSelect(dateTime[3]+dateTime[4]+dateTime[5]);
		}
		newrow.append(dateCol);
		newrow.append(timeCol);
		
		// Location
		var finalLoc = line2[1]; // Should always have a len of at least 2 because of the regex
		if (line2[1] == "Same / Same") { // Try to find the location in classes parsed before
			var rows = insertBody.find('tr');
			for (var i = 0; i < rows.length; i++) {
				var row = rows[i];
				var className = row.children[0].firstChild.value;
				var classLoc = row.children[3].firstChild.value;
				if (finalName == className) {
					finalLoc = classLoc;
					break;
				}
			}
		}
		var locCol = $(classlocColStr);
		locCol.children()[0].value = finalLoc;
		newrow.append(locCol);
		
		// Button
		var btn = $(btnColStr);
		btn.children().attr('onclick', "addBtnPressed('final"+finalNum+"')");
		newrow.append(btn);
		
		toInsert.push(newrow); // classname date time location button
		finalNum++;
	}
	insertBody.find("tr:last").before(toInsert);
	return finalNum;
}

function parseBtnPressed() {
	$('.autoadd').remove();
	$('.parse-success').remove();
	$('.parse-failed').remove();
	
	var tbody = $('#classtable tbody');
	var numParsed = parseAndAddClasses(tbody);
	numParsed += parseAndAddFinals(tbody);
	
	if (numParsed == 0) {
		$('#step3').append(parseFailedAlert);
	}
	else {
		$('#step3').append(reminder);
		$('#add-all-btn').removeClass('disabled');
		$('#add-all-btn').text('Add all to Google Calendar');
	}
}

/**
 * Converts the values of the row of seven checkboxes into a comma-separated string,
 * like 'MO,TU,WE'.  Used for recurrence requests to Google Calendar API.
 * 
 * Expects the appropriate td element as input.
 */
conversion = ['MO,','TU,','WE,','TH,','FR,','SA,','SU,'];
function convertDayOption(tdEle) {
	var ans = '';
	var boxes = tdEle.children;
	for (i = 0; i < 7; i++) {
		if (boxes[i].checked)
			ans += conversion[i];
	}
	
	if (ans)
		return ans.substring(0, ans.length - 1); // slice off the ending comma
	else
		return '';
}

/** Returns the INDEX of the first selected day in row of seven checkboxes. */
function firstSelectedDay(tdEle) {
	var boxes = tdEle.children;
	for (i = 0; i < 7; i++) {
		if (boxes[i].checked)
			return i;
	}
	return -1;
}

/**
 * Converts one of the time options to an ISO time string.
 * Warning: incorrect for times from 12:00 AM to 12:59 AM.  Luckily, those aren't options.
 */
function toISOTimeStr(timestr) {
	if (!timestr)
		return '';
	var hrMin = timestr.split(':');
	var hr = parseInt(hrMin[0], 10);
	if (hr < 12 && timestr.charAt(timestr.length - 2) == 'P') // PM
		hr += 12;
	
	return (hr + ':' + hrMin[1].substr(0, 2) + ':00');
}

/** Thrown by the functions that generate request bodies */
function validationError(badCol, reason) {
	this.badCol = badCol;
	this.reason = reason;
}

/**
 * Generates the Google Calendar API request body from a row of the table.
 * Assumes the row describes someone's class.
 * Throws validationError.
 */
function genClassRequestBody(tableRow) {
	var rowCols = tableRow.children; // each element of this array is a td element
	
	var request = {};
	request.summary = rowCols[0].firstChild.value;
	
	// Construct recurrence
	var byDay = convertDayOption(rowCols[1]);
	if (!byDay)
		throw new validationError(1, "Select at least one day of the week.");
	var semester = $('#semester-select select').val();
	request.recurrence = ['RRULE:FREQ=WEEKLY;UNTIL='+semesters[semester].endDate+';BYDAY='+byDay];
	
	// Construct start and end
	// Warning: only correct if semester starts on a Monday!
	var dayOffset = firstSelectedDay(rowCols[1]);
	var startDate = semesters[semester].startDate.offsetDateBy(dayOffset).toISODateStr();
	var startSel = rowCols[2].children[0];
	var endSel = rowCols[2].children[1];
	if (endSel.selectedIndex <= startSel.selectedIndex || startSel.selectedIndex <= 0 )
		throw new validationError(2, "Start time must be before end time.");
	request.start = {'dateTime': startDate + toISOTimeStr(startSel.value), 'timeZone':'America/Chicago'};
	request.end = {'dateTime': startDate + toISOTimeStr(endSel.value), 'timeZone':'America/Chicago'};
	
	request.location = rowCols[3].firstChild.value;
	request.description = 'Created by WebSTAC to Calendar';
	request.reminders = { 'useDefault': false };
	
	return request;
}

/**
 * Generates the Google Calendar API request body from a row of the table.
 * Assumes the row describes someone's final.
 * Throws validationError.
 */
function genFinalRequestBody(tableRow) {
	var rowCols = tableRow.children; // each element of this array is a td element
	
	var request = {};
	request.summary = rowCols[0].firstChild.value;
	
	var date = rowCols[1].children[0].value;
	if (date.length != 10 || !date.match(/\d\d\d\d-\d\d-\d\d/))
		throw new validationError(1, "Enter a valid date (yyyy-mm-dd).");
	var split = date.split('-')
	var month = split[1];
	var day = split[2];
	if (month <= 0 || month > 12 || day <= 0 || day > 31)
		throw new validationError(1, "Enter a valid date (yyyy-mm-dd).");
	
	var startSel = rowCols[2].children[0];
	var endSel = rowCols[2].children[1];
	if (endSel.selectedIndex <= startSel.selectedIndex || startSel.selectedIndex <= 0 )
		throw new validationError(2, "Start time must be before end time.");
	
	request.start = {'dateTime': date + 'T' + toISOTimeStr(startSel.value), 'timeZone':'America/Chicago'};
	request.end = {'dateTime': date + 'T' + toISOTimeStr(endSel.value), 'timeZone':'America/Chicago'};
	request.location = rowCols[3].firstChild.value;
	request.description = 'Created by WebSTAC to Calendar';
	
	return request;
}
