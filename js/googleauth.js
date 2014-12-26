// *
// All the authorization functions
// *
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

function authorize(event) {
	loggedin = false;
	// Working...
	gapi.auth.authorize({client_id: clientId, scope: scope, immediate: false}, handleAuthResult);
}

function handleAuthResult(authResult) {
	var authorizeButton = document.getElementById('authorize-button');
	if (authResult && !authResult.error) {
	
		if (validateToken(authResult)) {
			loggedin = true;
			authorizeButton.style.visibility = 'hidden';
		}
		else
			loginFailed();
		
	}
	else
		loginFailed();
}

function loginFailed() {
	console.log("Login failed.")
}

/* 
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

// *
// All the add to calendar functions below...
// *
function error(reason) {
	console.log(reason);
}

/* Creates the URI for HTTP post requests from a calendar ID. */
function convertCalId(calId) {
	return 'https://www.googleapis.com/calendar/v3/calendars/' + calId + '/events';
}

/*
 * Searches for a calendar with summary of 'Classes', and if there isn't one,
 * creates it.  Returns a promise; the success handler will be passed the
 * postUri.
 */
var postUri = null;
function getClassCal() {
	return gapi.client.request({ // Get calendar list
		'path':'https://www.googleapis.com/calendar/v3/users/me/calendarList',
		'params': {'minAccessRole': 'owner'}
	}).then(searchCals)
		.then(makeNewCal);
}

/*
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

/*
 *
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

function getRequestBody() {
	return {
		'summary': 'Test event',
		'start': {'dateTime':'2014-12-26T10:00:00', 'timeZone':'America/Chicago'},
		'end': {'dateTime':'2014-12-26T13:00:00', 'timeZone':'America/Chicago'},
		'recurrence': [ // Make sure it's the day AFTER semester ends
			'RRULE:FREQ=WEEKLY;UNTIL=20150107;BYDAY=TU,TH',
			'EXDATE:20150106' // Must be in same format as start!
		], 
		'location': 'Test location',
		'description': 'Added by WebSTAC to Calendar'
	};
}

/*
 * Adds a class to the user's calendar.
 */
function addClass(request) {
	if (!postUri)
		getClassCal();
		// What happens if the user is not authorized?
		// What happens if it fails?
		
	gapi.client.request({
		'path': postUri,
		'method': 'POST',
		'body': getRequestBody()
	})
}

/*
 * Called when a user presses an "Add to Google Calendar" button
 */
function handleClassBtn() {
	getClassCal().then(function(postUri) {
		console.log(postUri);
	});
}
