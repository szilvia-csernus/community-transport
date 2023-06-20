import { showInvalid, showValid } from './validation_helper.js';
import { form } from './reg_form_validation.js';

export let phoneIsVerified = false;

export const phoneInputField = document.getElementById('phone_nr');
const phoneNotification = document.getElementById('phone-notification');

export function validatePhoneNumber() {
	const formData = new FormData(form);
	const phoneInput = formData.get('phone_nr');
	console.log(phoneInput)

	// Regex tester I used for UK phone number: https://www.regextester.com/104299
	// (?:\+44|0): Starts with either +44 or 0, followed by
	// \d{10}: Exactly 10 digits.

	const phonePattern = /^(?:\+44|0)\d{10}$/;

	const test = phonePattern.test(phoneInput);

	if (test) {
		showValid(phoneInputField, phoneNotification);
		phoneIsVerified = true;
	} else {
		showInvalid(phoneInputField, phoneNotification);
		phoneIsVerified = false;
	}

	return phoneInputField.removeEventListener('change', validatePhoneNumber);
}


