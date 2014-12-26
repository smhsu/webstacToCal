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
// All the add to calendar functions
// *
function error(reason) {
	console.log(reason);
}

/*
 * Creates the URI for HTTP post requests from a calendar ID.  Also stores it in postUri.
 */

function makePostUri(calId) {
	postUri = 'https://www.googleapis.com/calendar/v3/calendars/' + calId + '/events';
	return postUri;
}

var postUri = null
// returns a promise
function getPostUri() {
	return new Promise(function (good, fail) {
		if (postUri)
			good(postUri);
		else
			getClassCal().then(good(postUri), fail);
			
		fail(reason);
	};
}

// you can return a value, which the next then can access, or you can return a promise, which the next then will wait on.

/*
 * Searches for a calendar with summary of 'Classes', and if there isn't one,
 * creates it.  Returns a promise.
 */
function getClassCal() {
	if (!loggedin)
		return;

	gapi.client.request({
		'path':'https://www.googleapis.com/calendar/v3/users/me/calendarList',
		'params': {'minAccessRole': 'owner'}
	}).then(searchCals, error).then(function(calId) {
		console.log(calId);
	}; // calls getCalId() on success, error() on failure
}

// Could return a value... or a promise!
// If it returns a value, .then(function (arg), arg has the value
// If it returns a promise, use it like one.  arg will have the server response, but not the value.
function searchCals(response) {
	cals = response.result.items;
	for (index in cals) {
		if (cals[index].summary == 'Classes') { // Class calendar found
			return cals[index].id;
		}
	}
	// Class calendar not found, make a new one.  This does nothing for now!
	gapi.client.request({
		'path':'https://www.googleapis.com/calendar/v3/calendars',
		'method': 'POST',
		'body': {'summary': 'Classes'}
	}).then( function(response) { return response.result.id; }, error);
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
	if (!valid)
		login;
		return;
		
	getPostUri().then(success, fail);
}
