import { showInvalid, showValid } from './validation_helper.js';

export let passwordIsVerified = false;

export const passwordInputField = document.getElementById('password');
const passwordNotification = document.getElementById('password-notification');
const form = document.getElementById('form');

export function validateStrongPassword() {
	const formData = new FormData(form);
	const pwInput = formData.get('password');

	// Regex is adopted from:
	// https://www.ocpsoft.org/tutorials/regular-expressions/password-regular-expression/

	// Minimum eight characters, at least one uppercase letter, one lowercase letter,
	// one number, and one special character:
	// (?=.*[a-z]): At least one lowercase letter.
	// (?=.*[A-Z]): At least one uppercase letter.
	// (?=.*[0-9]): At least one number.
	// (?=.*[@$!%*?&:;£^(){}=§±€_|'"<>,.`~\\\#\[\]\-\+]): At least one special character
	// from the set of [@$!%*?&:;£^(){}=§±€_|'"<>,.`~\#[]-+] - with special characteres escaped.
	// [A-Za-z0-9@$!%*?&:;£^(){}=§±€_|'"<>,.`~\#[]-+]: Allowed characters,
	// {8,25}:minimum length of 8 characters but no more than 25.

	const passwordPattern =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&:;£^(){}=§±€_|'"<>,.`~\\\#\[\]\-\+])[A-Za-z0-9@$!%*?&:;£^(){}=§±€_|'"<>,.`~\\\#\[\]\-\+]{8,25}$/;

	const test = passwordPattern.test(pwInput);

	if (test) {
		showValid(passwordInputField, passwordNotification);
		passwordIsVerified = true;
	} else {
		showInvalid(passwordInputField, passwordNotification);
		passwordIsVerified = false;
	}

}


