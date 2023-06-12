import {
	initMap,
	getVerification,
	renderInputField,
	addressIsVerified,
} from './edit_member_addr_validation.js';
import { showInvalid } from './validation_helper.js';

// Initialize map
initMap();

// Grab HTML elements
export const addressInput = document.getElementById('address');
export const addressId = document.getElementById('address_id');
export const notification = document.getElementById('address-notification');
export const form = document.getElementById('form');


// prevent form subbmission unless address is verified
form.addEventListener('submit', (e) => {
	e.preventDefault();

	if (addressIsVerified) {
		form.submit();
	} else {
		// if user didn't touch the address field (e.g. it was filled in by
		// the browser's autocompletion, it has to be verified before submission.)
		if (addressId.value) {
			getVerification(addressId.value, addressInput.value, renderInputField);
		} else {
			showInvalid(addressInput, notification);
		}
	}
});
