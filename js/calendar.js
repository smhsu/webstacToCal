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

/** Called when Google's Javascript client loads */
function handleClientLoad() {
	gapi.client.setApiKey(apiKey);
}

/** Called when someone presses the login button */
function authorize(event) {
	loggedin = false;
	var btn = $('#login-btn');
	btn.addClass('disabled');
	btn.text('Logging in...');
	gapi.auth.authorize({client_id: clientId, scope: scope, immediate: false}, handleAuthResult);
}

var loginDiv = "<div id='login' class='center'><p>Click the button below to grant access to your Google calendar.</p>\
	<button class='btn btn-primary' id='login-btn' onclick='authorize()'>Log in</button></div>";
var loggedInDiv = "<div id='logged-in' class='center'><p>You are logged in.</p>\
	<a class='btn btn-default' id='logout-btn' onclick='logout()'>Logout</a></div>";
/** Called after authorize() */
function handleAuthResult(authResult) {
	var btn = $('#login-btn');
	if (authResult && !authResult.error) {

		if (validateToken(authResult)) {
			loggedin = true;
			$('#login').replaceWith(loggedInDiv);
			refreshCalList();
		} else {
			btn.attr('class', 'btn btn-danger');
			btn.text("Login failed - retry?");
		}

	}
	else {
		btn.attr('class', 'btn btn-danger');
		btn.text("Login failed - retry?");
	}
}

/**
 * Sends a request to Google's servers to make sure that our access token was
 * not originally issued to a different app.  Returns true if validation
 * succeeded, false if not.  This function is synchronous.
 */
function validateToken(token) {
	if (!token)
		return false;

	var url = "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=";
	url += token.access_token;
	var xmlhttp = new XMLHttpRequest();
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
	if (!loggedin) {
		$('#logged-in').replaceWith(loginDiv);
		return;
	}

	var btn = $('#logout-btn');
	btn.addClass('disabled');
	btn.text('Logging out...');

	var token = gapi.auth.getToken();
	var url = "https://accounts.google.com/o/oauth2/revoke?token="+token.access_token;

	$.ajax({
		type: 'GET',
		url: url,
		async: false,
		contentType: "application/json",
		dataType: 'jsonp',
		success: function() {
			loggedin = false;
			$('#logged-in').replaceWith(loginDiv);
		},
		error: function(e) {
			$('#logged-in p').replaceWith("<p>You may log out manually by visiting <a href=\
				'https://security.google.com/settings/security/permissions'>https://security.google.com/settings/security/permissions</a></p>");
			$('#logged-in a').attr('class', 'btn btn-danger');
			$('#logged-in a').text("Logout failed - retry?");
		}
	});
}

/***
 * All the API calls
 ***/
var defaultSelect = " <select><option>Select a calendar...</option></select> ";
var defaultRefreshBtn = " <a class='btn btn-default' onclick='refreshCalList()'>Refresh list</a> ";
var workingLabel = "<a class='btn btn-default disabled'>Working...</a>";

/** Creates the URI for HTTP post requests from a calendar ID. */
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
		var select = $(defaultSelect);
		var cals = response.result.items;
		for (index in cals) {
			calIds.push(cals[index].id);
			var newOption = $("<option></option>");
			newOption.text(cals[index].summary);
			select.append(newOption);
		}
		return select;
	});
}

/**
 * Called when a user presses the "Refresh List" button
 */
function refreshCalList() {
	var btn = $("#cal-select a");
	btn.tooltip('destroy');
	if (!loggedin) {
		btn.replaceWith(makeErrorButton("Login required", "Scroll up to step 1, and click here to try again", "refreshCalList()"));
		return;
	}

	btn.replaceWith(workingLabel);
	makeCalSelect().then( function(select) {
		$("#cal-select select").replaceWith(select);
		$("#cal-select a").replaceWith(defaultRefreshBtn);
	}, function(error) {
		$("#cal-select select").replaceWith(defaultSelect);
		var reason;
		if (error.result) // Google API error
			reason = error.result.error.message;
		else // ???
			reason = "Unexpected exception: " + error;
		$("#cal-select a").replaceWith(makeErrorButton("Fetch failed - retry?", reason, "refreshCalList()"));
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
		var originRow = document.getElementById(rowId);
		var btn = $(originRow.children[4].children[0]);
		btn.replaceWith("<a class='btn btn-success'><span class='glyphicon glyphicon-ok'></span> Added</a>");
	},
	function(err)
	{
		var reason;
		if (err.result)
			reason = 'Error trying post the event: ' + err.result.error.message;
		else
			reason = 'Unexpected exception: ' + err;

		var originRow = document.getElementById(rowId);
		var btn = $(originRow.children[4].children[0]);
		btn.replaceWith(makeErrorButton("Error - retry?", reason, "addBtnPressed('"+rowId+"')"));
	});
}

/**
 * Called when a user presses an "Add to Google Calendar" button
 */
function addBtnPressed(rowId) {
	var originRow = document.getElementById(rowId);
	var btn = $(originRow.children[4].children[0]);
	btn.tooltip('destroy');
	var callback = "addBtnPressed('"+rowId+"')";

	if (!loggedin) {
		btn.replaceWith(makeErrorButton("Login required", "Scroll up to step 1, and click here to try again", callback));
		return;
	}

	// Get which calendar the user has selected
	var selectedIndex = $("#cal-select select")[0].selectedIndex;
	if (selectedIndex <= 0) {
		$("#cal-select").attr("style", "border: 3px solid red");
		btn.replaceWith(makeErrorButton("Error - retry?", "Select a calendar first.", callback));
		return;
	}
	else
		$("#cal-select").removeAttr("style");
	var postUri = convertCalId(calIds[selectedIndex - 1]);

	// Validate the input before making the request
	originRow.children[1].removeAttribute("style"); // Remove red borders that the catch block might have added
	originRow.children[2].removeAttribute("style");
	try {
		var request;
		if (rowId.search('class') >= 0)
			request = genClassRequestBody(originRow); // genRequestBody defined in tableParse.js
		else if (rowId.search('final') >= 0)
			request = genFinalRequestBody(originRow);
		else
			throw ("Bad button ID");
	}
	catch (err) {
		if (err instanceof validationError) {
			originRow.children[err.badCol].setAttribute("style", "border: 3px solid red;");
			btn.replaceWith(makeErrorButton("Error - retry?", err.reason, callback));
		}
		else
			btn.replaceWith(makeErrorButton("Error - retry?", "Unexpected exception: "+err, callback));

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
	var errBtn = $("<a class='btn btn-danger'><span class='glyphicon glyphicon-remove'></span> </a>");
	errBtn.append(document.createTextNode(text));
	if (reason) {
		errBtn.attr("data-toggle", "tooltip");
		errBtn.attr("title", reason);
		errBtn.tooltip();
	}
	errBtn.attr("onclick", onclick);
	return errBtn;
}

/**
 * Automatically clicks all the <a> tags in all tables.  Disables the add-all button for 2 seconds.
 */
function addAll() {
	$('table a').click();
	$('#add-all-btn').addClass('disabled');
	setTimeout(function () { $('#add-all-btn').removeClass('disabled'); }, 2000);
	ga('send', 'event', 'add-all-button', 'click'); // Send click to Google Analytics
}
