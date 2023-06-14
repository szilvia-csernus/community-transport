import { showInvalid } from "./validation_helper.js";
import { 
    initMap, 
    getVerification, 
    renderPickupInputField, 
    renderDropoffInputField,
    pickupAddressIsVerified,
    dropoffAddressIsVerified
} from "./new_req_addr_validation.js";
import {
	validateDate, validateTime
} from './datetime_validation.js'; 

// Grab HTML elements
export const pickupAddressId = document.getElementById('pickup_address_id');
export const pickupAddressInput = document.getElementById('pickup_address');
export const pickupNotification = document.getElementById(
	'pickup_notification'
);
export const dropoffAddressId = document.getElementById('dropoff_address_id');
export const dropoffAddressInput = document.getElementById('dropoff_address');
export const dropoffNotification = document.getElementById(
	'dropoff_notification'
);

// Initialize map, add autocomplete and address validation
initMap();

// Grab form
const form = document.getElementById('form');
// Add submit event listener to form
form.addEventListener(
	'submit',
	(e) => {
		// Don't submit the form before validation.
		e.preventDefault();

        const formData = new FormData(form);

        const isDateValid = validateDate(formData.get("date"));
        const isTimeValid = validateTime(formData.get("time"));

		if (
			isDateValid &&
            isTimeValid &&
			pickupAddressIsVerified &&
			dropoffAddressIsVerified
		) {
			form.submit();
		} else {
			// if user didn't touch the address fields (e.g. it was filled in by
			// the browser's autocompletion, it has to be verified before submission.)
			if (!dropoffAddressIsVerified) {
				if (dropoffAddressId.value) {
					getVerification(
						dropoffAddressId.value,
						dropoffAddressInput.value,
						'dropoff',
						renderDropoffInputField
					);
				} else {
					showInvalid(dropoffAddressInput, dropoffNotification);
					dropoffAddressInput.focus();
				}
			}
			if (!pickupAddressIsVerified) {
				if (pickupAddressId.value) {
					getVerification(
						pickupAddressId.value,
						pickupAddressInput.value,
						'pickup',
						renderPickupInputField
					);
				} else {
					showInvalid(pickupAddressInput, pickupNotification);
					pickupAddressInput.focus();
				}
			}
		}
	}
);
