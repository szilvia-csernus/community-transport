import { showInvalid, showValid } from './validation_helper.js';

export let emailIsVerified = false;

// Grab HTML elements
export const emailInputField = document.getElementById('email');
const emailNotification = document.getElementById('email-notification');
const form = document.getElementById('form');

/** Validate email against Regex */
export function validateEmail() {
	const formData = new FormData(form);
	const emailInput = formData.get('email');

	// Regex tester I used: https://www.regextester.com/
	// [\w.-]+: matches one or more word characters (alphanumeric and underscore), periods, or hyphens, representing the local part of the email address before the @ symbol.
	// @: matches the literal @ symbol.
	// [a-zA-Z_-]+? matches one or more letters, underscores, or hyphens for the domain name.
	// \. matches the literal . character that separates the domain name from the top-level domain (TLD).
	// [a-zA-Z]{2,3} matches two or three letters for the TLD.

	const emailPattern = /^[\w.-]+@[a-zA-Z_-]+?\.[a-zA-Z]{2,5}$/;

	const test = emailPattern.test(emailInput);

	if (test) {
		showValid(emailInputField, emailNotification);
		emailIsVerified = true;
	} else {
		showInvalid(emailInputField, emailNotification);
		emailIsVerified = false;
	}

}


