import { showInvalid, showValid } from './validation_helper.js';

export let fullnameIsVerified = false;

export const fullnameInputField = document.getElementById('fullname');
const fullnameNotification = document.getElementById('fullname-notification');
const form = document.getElementById('form');

export function validateFullname() {
	const formData = new FormData(form);
	const fullnameInput = formData.get('fullname');
	console.log(fullnameInput);

	// Regex tester I used for UK fullname number: https://www.regextester.com/104299
	// [A-Za-z ]: Only letter characters and spaces allowed
	// {5,30}: length between 5 and 30 characters long.

	const fullnamePattern = /^[A-Za-z ]{5,30}$/;

	const test = fullnamePattern.test(fullnameInput);

	if (test) {
		showValid(fullnameInputField, fullnameNotification);
		fullnameIsVerified = true;
	} else {
		showInvalid(fullnameInputField, fullnameNotification);
		fullnameIsVerified = false;
	}

}


