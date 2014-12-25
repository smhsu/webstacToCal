var clientId = '958398529813-dsebceuap5kr2pjfdskq7rhrimh7p34n.apps.googleusercontent.com';
var apiKey = 'AIzaSyDEiPoOLx-XZvaPSJCRwBi9hwebeo_d4fA';
var scope = 'https://www.googleapis.com/auth/calendar';

document.getElementById('authorize-button').onclick = handleAuthClick;

var token = null;
var valid = false;

function handleClientLoad() {
	gapi.client.setApiKey(apiKey);
	//window.setTimeout(checkAuth,1);
}

function checkAuth() {
	gapi.auth.authorize({client_id: clientId, scope: scope, immediate: true}, handleAuthResult);
}

function handleAuthResult(authResult) {
	var authorizeButton = document.getElementById('authorize-button');
	if (authResult && !authResult.error) {
		authorizeButton.style.visibility = 'hidden';
		token = authResult;
		validateToken();
	} else {
		authorizeButton.style.visibility = '';
		authorizeButton.onclick = handleAuthClick;
	}
}

function handleAuthClick(event) {
	gapi.auth.authorize({client_id: clientId, scope: scope, immediate: false}, handleAuthResult);
	return false;
}


function validateToken() {
	valid = false;
	if (!token)
		return;
	url = "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=1/";
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
