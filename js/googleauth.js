// *
// All the authorization functions
// *
var clientId = '958398529813-dsebceuap5kr2pjfdskq7rhrimh7p34n.apps.googleusercontent.com';
var apiKey = 'AIzaSyDEiPoOLx-XZvaPSJCRwBi9hwebeo_d4fA';
var scope = 'https://www.googleapis.com/auth/calendar';
// api name: calendar
// api version: v3

var token = null;
var valid = false;

/* Called when Google's Javascript client loads */
function handleClientLoad() {
	gapi.client.setApiKey(apiKey);
}

function authorize(event) {
	gapi.auth.authorize({client_id: clientId, scope: scope, immediate: false}, handleAuthResult);
}

function handleAuthResult(authResult) {
	var authorizeButton = document.getElementById('authorize-button');
	if (authResult && !authResult.error) {
		authorizeButton.style.visibility = 'hidden';
		token = authResult;
		validateToken();
	} else {
		//authorizeButton.style.visibility = '';
		//authorizeButton.onclick = handleAuthClick;
	}
}

/* 
 * Sends a request to Google's servers to make sure that our access token was
 * not originally issued to a different app.  Stores the result in var valid.
 */
function validateToken() {
	valid = false;
	if (!token)
		return;
	url = "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=";
	url += token.access_token;
	xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", url, true);
	xmlhttp.onload = function() {
		response = jQuery.parseJSON(xmlhttp.responseText);
		if (!response.error && response.audience == clientId) 
			valid = true;
	}
	xmlhttp.send();
}

// *
// All the add to calendar functions
// *

function error(reason) {
	console.log(reason);
}

/*
 * Searches for a calendar with summary of 'Classes', and if there isn't one,
 * creates it.  Stores its id in var calId.
 */
var calId = null;
function getCalId(response) {
	if (!valid)
		return;
		
	cals = response.result.items;
	for (index in cals) {
		if (cals[index].summary == 'Classes') {
			calId = cals[index].id;
			return;
		}
	}
	// Class calendar not found, make a new one.
	gapi.client.request({
		'path':'https://www.googleapis.com/calendar/v3/calendars',
		'method': 'POST',
		'body': {'summary': 'Classes'}
	}).then( function(response) { calId = response.result.id; }, error);
}

function getClassCal() {
	if (!valid)
		return;

	gapi.client.request({
		'path':'https://www.googleapis.com/calendar/v3/users/me/calendarList',
		'params': {'minAccessRole': 'owner'}
	}).then(getCalId, error); // calls readCals() on success, error() on failure
}
