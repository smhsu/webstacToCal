window.onload = function() {
	$("#login").replaceWith(loginDiv);
	$("#cal-select").append(defaultSelect);
	$("#cal-select").append(defaultRefreshBtn);
	document.getElementById('inputbox').addEventListener('input', pastedTextChanged);
}
