/***
 * calendar.js
 * All Google API authorization functions and functions that handle requests
 * to Google's servers.
 * Author: Silas Hsu, December 2014
 * PLEASE give acknowledgement if you copy this code.
 ***/
 
/***
 * All the authorization functions
 ***/
var clientId = '958398529813-dsebceuap5kr2pjfdskq7rhrimh7p34n.apps.googleusercontent.com';
var apiKey = 'AIzaSyDEiPoOLx-XZvaPSJCRwBi9hwebeo_d4fA';
var scope = 'https://www.googleapis.com/auth/calendar';
// api name: calendar
// api version: v3

var loggedin = false;

/* Called when Google's Javascript client loads */
function handleClientLoad() {
	gapi.client.setApiKey(apiKey);
}

/* Called when someone presses the login button */
function authorize(event) {
	loggedin = false;
	$('#login-btn').button('loading');
	gapi.auth.authorize({client_id: clientId, scope: scope, immediate: false}, handleAuthResult);
}

loginButton = "<button class='btn btn-primary' id='login-btn' data-loading-text='Working...' onclick='authorize()'>Log in</button>"
loggedInDiv = "<div id='logged-in'>You are logged in.<br><a class='btn btn-default' data-loading-text='Logging out...' onclick='logout()'>Logout</a></div>";
/* Called after authorize() */
function handleAuthResult(authResult) {
	btn = $('#login-btn');
	if (authResult && !authResult.error) {
	
		if (validateToken(authResult)) {
			loggedin = true;
			btn.replaceWith(loggedInDiv);
		} else {
			btn.replaceWith(makeErrorButton("Login failed - retry?", '', "authorize()"));
		}
		
	}
	else
		btn.replaceWith(makeErrorButton("Login failed - retry?", '', "authorize()"));
}

/**
 * Sends a request to Google's servers to make sure that our access token was
 * not originally issued to a different app.  Returns true if validation
 * succeeded, false if not.  This function is synchronous.
 */
function validateToken(token) {
	if (!token)
		return false;

	url = "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=";
	url += token.access_token;
	xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", url, false);
	xmlhttp.send();
	
	try { response = jQuery.parseJSON(xmlhttp.responseText); }
	catch (err) { return false; }
	return (!response.error && response.audience == clientId);
}

/**
 * Called when user presses logout button
 */
function logout() {
	token = gapi.auth.getToken();
	if (!token)
		return;
	url = "https://accounts.google.com/o/oauth2/revoke?token="+token.access_token;
	
	xmlhttp = new XMLHttpRequest();
	xmlhttp.timeout = 5000;
	xmlhttp.open("GET", url, true);
	xmlhttp.onload = function() {
		$('#logged-in').replaceWith(loginButton);
	}
	xmlhttp.onerror = function () {
		console.log("Error logging out");
	}
	xmlhttp.ontimeout = function () {
		console.log("Logout timed out");
	}
	
	$('#logged-in a').button('loading');
	xmlhttp.send();
}

/***
 * All the API calls
 ***/
var defaultSelect = " <select><option>Select a calendar...</option></select> ";
var defaultRefreshBtn = " <a class='btn btn-default' onclick='refreshCalList()'>Refresh list</a> ";
var workingLabel = "<a class='btn btn-default disabled'>Working...</a>";

$("#select-div").append(defaultSelect);
$("#select-div").append(defaultRefreshBtn);

/* Creates the URI for HTTP post requests from a calendar ID. */
function convertCalId(calId) {
	return 'https://www.googleapis.com/calendar/v3/calendars/' + calId + '/events';
}

/**
 * Fetches a user's calendar list and:
 * 1) Puts all their writeable calendar ids in global array calIds
 * 2) Returns a promise that returns a select element with the calendar names
 */
var calIds = []
function makeCalSelect() {
	calIds = [];
	
	return gapi.client.request({ // Request calendars
		'path':'https://www.googleapis.com/calendar/v3/users/me/calendarList',
		'params': {'minAccessRole': 'writer'}
	}).then( function(response) {
		select = $(defaultSelect);
		cals = response.result.items;
		for (index in cals) {
			calIds.push(cals[index].id);
			select.append("<option>"+cals[index].summary +"</option>");
		}
		return select;
	});
}

/**
 * Called when a user presses the "Refresh List" button
 */
function refreshCalList() {
	btn = $("#select-div a");
	btn.tooltip('destroy');
	if (!loggedin) {
		btn.replaceWith(makeErrorButton("Login required", "Scroll up to step 1, and click here to try again", "refreshCalList()"));
		return;
	}
	
	btn.replaceWith(workingLabel);
	makeCalSelect().then( function(select) {
		$("#select-div select").replaceWith(select);
		$("#select-div a").replaceWith(defaultRefreshBtn);
	}, function(error) {
		$("#select-div select").replaceWith(defaultSelect);
		if (error.result) // Google API error
			reason = error.result.error.message;
		else // ???
			reason = "Unexpected exception: " + error;
		$("#select-div a").replaceWith(makeErrorButton("Fetch failed - retry?", reason, "refreshCalList()"));
	});
}

function postEvent(postUri, body) {
	return gapi.client.request({
		'path': postUri,
		'method': 'POST',
		'body': body
	});
}

/**
 * Gets the appropriate calendar, and attempts to add an event to it.  Replaces a button
 * in the class table row depending on success.
 * postUri: the URI to send the request to
 * request: the request body
 * rowId: the ID of the row in which replace the button
 */
function sendEventRequest(postUri, request, rowId) {
	postEvent(postUri, request).then( function()
	{
		originRow = document.getElementById(rowId);
		btn = $(originRow.children[4].children[0]);
		btn.replaceWith("<a class='btn btn-success'><span class='glyphicon glyphicon-ok'></span> Added</a>");
	},
	function(err)
	{
		if (err.result)
			reason = 'Error trying post the event: ' + err.result.error.message;
		else
			reason = 'Unexpected exception: ' + err;
		
		originRow = document.getElementById(rowId);
		btn = $(originRow.children[4].children[0]);
		btn.replaceWith(makeErrorButton("Error - retry?", reason, "addBtnPressed('"+rowId+"')"));
	});
}

/**
 * Called when a user presses an "Add to Google Calendar" button
 */
function addBtnPressed(rowId) {
	originRow = document.getElementById(rowId);
	btn = $(originRow.children[4].children[0]);
	btn.tooltip('destroy');
	onclick = "addBtnPressed('"+rowId+"')";
	
	if (!loggedin) {
		btn.replaceWith(makeErrorButton("Login required", "Scroll up to step 1, and click here to try again", onclick));
		return;
	}
	
	// Get which calendar the user has selected
	selectedIndex = $("#select-div select")[0].selectedIndex;
	if (selectedIndex <= 0) {
		$("#select-div").attr("style", "border: 3px solid red");
		btn.replaceWith(makeErrorButton("Error - retry?", "Select a calendar above first.", onclick));
		return;
	}
	else
		$("#select-div").removeAttr("style");
	postUri = convertCalId(calIds[selectedIndex - 1]);
	
	// Validate the input before sending it off
	originRow.children[1].removeAttribute("style"); // Remove red borders that the catch block might have added
	originRow.children[2].removeAttribute("style");
	try {
		request = genRequestBody(originRow); // genRequestBody defined in tableParse.js
	}
	catch (badCol) {
		if (badCol == 1) { // Days of the week
			btn.replaceWith(makeErrorButton("Error - retry?", "Select at least one day of the week.", onclick));
		}
		else if (badCol == 2) { // Start and end time
			btn.replaceWith(makeErrorButton("Error - retry?", "Start time must be before end time", onclick));
		}
		else // ???
			btn.replaceWith(makeErrorButton("Error - retry?", "Unexpected exception: "+badCol, onclick));
			
		originRow.children[badCol].setAttribute("style", "border: 3px solid red;");
		return;
	}
	
	btn.replaceWith(workingLabel);
	sendEventRequest(postUri, request, rowId);
}

/**
 * Makes an error button with handy tooltip
 * text: text of the button
 * reason: the tooltip contents
 * id: the parameter passed to addBtnPressed()
 */
function makeErrorButton(text, reason, onclick) {
	errBtn = $("<a class='btn btn-danger'><span class='glyphicon glyphicon-remove'></span> "+text+"</a>");
	if (reason) {
		errBtn.attr("data-toggle", "tooltip");
		errBtn.attr("title", reason);
		errBtn.tooltip();
	}
	errBtn.attr("onclick", onclick);
	return errBtn;
}
