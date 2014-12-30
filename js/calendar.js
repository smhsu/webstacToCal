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
var validFail = false;

/* Called when Google's Javascript client loads */
function handleClientLoad() {
	gapi.client.setApiKey(apiKey);
}

/* Called when someone presses the login button */
function authorize(event) {
	loggedin = false;
	// Working...
	gapi.auth.authorize({client_id: clientId, scope: scope, immediate: false}, handleAuthResult);
}

function handleAuthResult(authResult) {
	var authorizeButton = document.getElementById('authorize-button');
	validFail = false;
	if (authResult && !authResult.error) {
	
		if (validateToken(authResult)) {
			loggedin = true;
			authorizeButton.style.visibility = 'hidden';
		} else {
			validFail = true;
			loginFailed();
		}
		
	}
	else
		loginFailed();
}

function loginFailed() {
	console.log("Login failed.")
}

function logout() {

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
	
	return gapi.client.request({
		'path':'https://www.googleapis.com/calendar/v3/users/me/calendarList',
		'params': {'minAccessRole': 'writer'}
	}).then( function(response) {
		select = $(defaultSelect);
		cals = response.result.items;
		for (index in cals) {
			calIds.append(cals[index].id);
			select.append("<option>"+cals[index].summary +"</option>");
		}
		return select;
	});
}

function refreshCalList() {
	btn = $("#select-div a");
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

/**
 * Searches for a calendar with summary of 'Classes', and if there isn't one,
 * creates it.  Returns a promise; the success handler will be passed the
 * postUri.
 */
var postUri = null;
var promise = null;
function getClassCal() {
	if (!promise) {
		promise = gapi.client.request({ // Get calendar list
			'path':'https://www.googleapis.com/calendar/v3/users/me/calendarList',
			'params': {'minAccessRole': 'owner'}
		}).then(searchCals)
			.then(makeNewCal);
	}
	
	return promise;
}

/**
 * Returns the calendar ID of the calendar with the name of "Classes",
 * or null if there was no such calendar.
 */
function searchCals(response) {
	cals = response.result.items;
	for (index in cals) {
		if (cals[index].summary == 'Classes') { // Class calendar found
			postUri = convertCalId(cals[index].id);
			return postUri;
		}
	}
	return null;
}

/**
 * If postUri is empty, makes a new calendar with name of "Classes".
 * Returns the postUri, or a promise for it.
 */
function makeNewCal() {
	if (postUri)
		return postUri;

	return gapi.client.request({
		'path':'https://www.googleapis.com/calendar/v3/calendars',
		'method': 'POST',
		'body': {'summary': 'Classes'}
	}).then( function(response) {
		postUri = convertCalId(response.result.id);
		return postUri;
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
 * request: the request body
 * rowId: the ID of the row in which replace the button
 */
function sendEventRequest(request, rowId) {
	getClassCal()
		.then( function(postUri) {
			return postEvent(postUri, request);
		},
		function(err) { // getClassCal failed
			promise = null; // Reset getClassCal's promise so we can retry
			
			if (err.result) // Whatever happens, let the next error handler take it
				throw('Error getting your calendar: ' + err.result.error.message);
			else
				throw(err);
		})
		
		.then ( function() { // Success!
			originRow = document.getElementById(rowId);
			btn = $(originRow.children[4].children[0]);
			btn.replaceWith("<a class='btn btn-success'><span class='glyphicon glyphicon-ok'></span> Added</a>");
		},
		function(err) { // All errors eventually find their way here.
			if (typeof(err) == "string") // Passed from above block
				reason = err;
			else if (err.result)
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
	if (validFail) {
		error("Auth fail");
		return;
	}
	if (!loggedin) {
		authorize();
		return;
	}
	
	originRow = document.getElementById(rowId);
	originRow.children[1].removeAttribute("style"); // Remove red borders from the catch block
	originRow.children[2].removeAttribute("style");
	
	btn = $(originRow.children[4].children[0]);
	btn.tooltip('destroy');
	try {
		request = genRequestBody(originRow); // genRequestBody defined in tableParse.js
	}
	catch (badCol) {
		onclick = "addBtnPressed('"+rowId+"')";
		if (badCol == 1) { // Days of the week
			btn.replaceWith(makeErrorButton("Error - retry?", "Select at least one day of the week.", onclick));
		}
		else if (badCol == 2) { // Start and end time
			btn.replaceWith(makeErrorButton("Error - retry?", "Start time must be before end time", onclick));
		}
		else // ???
			btn.replaceWith(makeErrorButton("Error - retry?", "Unexpected exception: "+badCol, onclick));
			
		originRow.children[badCol].setAttribute("style", "border: 2px solid red;");
		return;
	}
	
	btn.replaceWith(workingLabel);
	sendEventRequest(request, rowId);
}

/**
 * Makes an error button with handy tooltip
 * reason: the tooltip contents
 * id: the parameter passed to addBtnPressed()
 */
function makeErrorButton(text, reason, onclick) {
	errBtn = $("<a class='btn btn-danger' data-toggle='tooltip' data-placement='top'><span class='glyphicon glyphicon-remove'></span> "+text+"</a>");
	errBtn.attr("title", reason);
	errBtn.attr("onclick", onclick);
	errBtn.tooltip(); // From Bootstrap
	return errBtn;
}
