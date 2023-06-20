import {
	initMap,
	getVerification,
	renderInputField,
	addressIsVerified,
} from './edit_member_addr_validation.js';
import { showInvalid } from './validation_helper.js';
import {
	phoneInputField,
	phoneIsVerified,
	validatePhoneNumber,
} from './phone_validation.js';
import {
	fullnameInputField,
	fullnameIsVerified,
	validateFullname,
} from './name_validation.js';

// Initialize map
initMap();

// Grab HTML elements
export const addressInput = document.getElementById('address');
export const addressId = document.getElementById('address_id');
export const addressNotification = document.getElementById('address-notification');
export const phoneNotification = document.getElementById('phone-notification');
export const fullnameNotification = document.getElementById(
	'fullname-notification'
);
export const form = document.getElementById('form');

// add the imported event listeners
phoneInputField.addEventListener('focusout', validatePhoneNumber);
fullnameInputField.addEventListener('focusout', validateFullname);


// prevent form subbmission unless all form input data are verified
form.addEventListener('submit', (e) => {
	e.preventDefault();

	validatePhoneNumber();
	validateFullname();

	if (addressIsVerified && phoneIsVerified && fullnameIsVerified) {
		form.submit();
	} else {
		// if user didn't touch the address field (e.g. it was filled in by
		// the browser's autocompletion, it has to be verified before submission.)
		if (addressId.value) {
			getVerification(addressId.value, addressInput.value, renderInputField);
		} else {
			showInvalid(addressInput, addressNotification);
		}
	}
	
	if (!phoneIsVerified) {
		validatePhoneNumber();
	}
	if (!fullnameIsVerified) {
		validateFullname();
	}
});
