/***
 * Parses all of a user's pasted WebSTAC classes and formats them nicely into a
 * table for the user to see.  Also converts the table's contents into valid Google
 * Calendar request bodies.
 ***/

var classTable = 
"<table class='table table-hover'>\
	<thead>\
		<tr>\
			<td>Class name</td>\
			<td>Days <br> (MTWTFSS)</td>\
			<td>Time <br> (start - end)</td>\
			<td>Location</td>\
			<td>Add to calendar</td>\
		</tr>\
	</thead>\
	<tbody id='classtable'></tbody>\
</table>";

var classnameColStr = "<td class='classname'><input type='text'></input></td>";
var checkboxColStr = "<td class='classdays'><input type='checkbox' class='mon'/><input type='checkbox' class='tue'/><input type='checkbox' class='wed'/><input type='checkbox' class='thu'/><input type='checkbox' class='fri'/><input type='checkbox' class='sat'/><input type='checkbox' class='sun'/></td>";
var timeSelect = "<select><option></option><option>8:00 AM</option><option>8:30 AM</option><option>9:00 AM</option><option>9:30 AM</option><option>10:00 AM</option><option>10:30 AM</option><option>11:00 AM</option><option>11:30 AM</option><option>12:00 PM</option><option>12:30 PM</option><option>1:00 PM</option><option>1:30 PM</option><option>2:00 PM</option><option>2:30 PM</option><option>3:00 PM</option><option>3:30 PM</option><option>4:00 PM</option><option>4:30 PM</option><option>5:00 PM</option><option>5:30 PM</option><option>6:00 PM</option><option>6:30 PM</option><option>7:00 PM</option><option>7:30 PM</option><option>8:00 PM</option><option>8:30 PM</option><option>9:00 PM</option><option>9:30 PM</option><option>10:00 PM</option><option>10:30 PM</option><option>11:00 PM</option><option>11:30 PM</option></select>";
var classtimeColStr = "<td class='classtime'>" + timeSelect + " - " + timeSelect + "</td>";
var classlocColStr = "<td class='classloc'><input type='text'></input></td>";
var btnStr = "<td class='btncol'><a onclick='addBtnPressed.call(this.parentNode.parentNode)'><img class='img-responsive' src='img/gcbutton.gif'/></a>"

/**
 * Given a 'days of the week' string from WebSTAC, example 'M-W----', makes a
 * corresponding row of seven checkboxes.  If there is a parse error, they will
 * all be unchecked.
 */
function makeCheckboxes(dayStr) {
	boxes = $(checkboxColStr);
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
 * a pair of pre-filled selection boxes for the start and end times.
 */
function makeTimeSelect(timeStr) {
	col = $('<td></td>')
	start = $(timeSelect);
	end = $(timeSelect);
	col.append(start);
	col.append(' - ');
	col.append(end);
	if (!timeStr)
		return col;
		
	split = timeStr.split('-'); // Parse time
	if (split.length != 2)
		return col;
	split[0] = split[0].toLowerCase();
	split[1] = split[1].toLowerCase();
	startTxt = split[0].match(/\d\d?:\d\d[ap]/);
	endTxt = split[1].match(/\d\d?:\d\d[ap]/);
	if (!startTxt || !endTxt)
		return col;
	
	if (split[0].charAt(split[0].length - 1) == 'a') // Set start
		ampm = ' AM';
	else
		ampm = ' PM';
	start.val(split[0].slice(0, split[0].length - 1) + ampm);
	
	if (split[1].charAt(split[1].length - 1) == 'a') // Set end
		ampm = ' AM';
	else
		ampm = ' PM';
	end.val(split[1].slice(0, split[1].length - 1) + ampm);
	
	return col;
}

/**
 * Parses all of a user's pasted WebSTAC classes and formats them nicely into a
 * table for the user to see.
 */
function parseClasses() {
	$('table').remove();

	input = document.getElementById('inputbox').value;
	classText = input.match(/[A-Z]\d\d.+/g);
	if (classText != null)
		$('.container').append(classTable);
	
	var classNum = 0;
	for (index in classText) {
		cols = classText[index].split('\t');
		if (cols.length < 5)
			continue;
		name = cols[1];
		
		time = cols[4].split(' ');
		if (time.length < 2)
			time.push(null);

		if (cols.length >= 6)
			loc = cols[5];
		else
			loc = null;

		newrow = $("<tr></tr>");
		newrow.attr('id', 'class'+classNum.toString());
		
		classname = $(classnameColStr);
		classname.children()[0].value = name;
		newrow.append(classname);
		
		checkboxes = makeCheckboxes(time[0]);
		newrow.append(checkboxes);
		
		classtime = makeTimeSelect(time[1]);
		newrow.append(classtime);
		
		classloc = $(classlocColStr);
		classloc.children()[0].value = loc;
		newrow.append(classloc);
		
		btn = $(btnStr);
		newrow.append(btn);
		
		$('#classtable').append(newrow);
		
		classNum++;
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
	ans = '';
	boxes = tdEle.children;
	for (i = 0; i < 7; i++) {
		if (boxes[i].checked)
			ans += conversion[i];
	}
	
	if (ans)
		return ans.substring(0, ans.length - 1); // slice off the ending comma
	else
		return '';
}

/* Returns the INDEX of the first selected day in row of seven checkboxes. */
function firstSelectedDay(tdEle) {
	boxes = tdEle.children;
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
	hrMin = timestr.split(':');
	hr = parseInt(hrMin[0]);
	if (hr < 12 && timestr.charAt(timestr.length - 2) == 'P') // PM
		hr += 12;
	
	return (hr + ':' + hrMin[1].substr(0, 2) + ':00');
}

/**
 * Generates the Google Calendar API request body for a user's class.
 * Throws a string describing an error if input fails validation.
 */
function genRequestBody(tableRow) {
	children = tableRow.children; // each element of this array is a td element
	
	request = {}
	request.summary = children[0].firstChild.value; 
	
	byDay = convertDayOption(children[1]);
	if (!byDay)
		throw "No days are selected.";
	request.recurrence = ['RRULE:FREQ=WEEKLY;UNTIL='+semesters['SP15'].enddate+';BYDAY='+byDay];
	
	dayOffset = firstSelectedDay(children[1]);
	startDate = semesters['SP15'].startDate.offsetDateBy(dayOffset).toISODateStr();
	
	startSel = children[2].children[0];
	endSel = children[2].children[1];
	if (endSel.selectedIndex <= startSel.selectedIndex || startSel.selectedIndex <= 0 )
		throw "End time is before start time."
	request.start = {'dateTime': startDate + toISOTimeStr(startSel.value), 'timeZone':'America/Chicago'};
	request.end = {'dateTime': startDate + toISOTimeStr(endSel.value), 'timeZone':'America/Chicago'};
	
	request.location = children[3].firstChild.value;
	request.description = 'Created by WebSTAC to Calendar';
	
	return request;
}
