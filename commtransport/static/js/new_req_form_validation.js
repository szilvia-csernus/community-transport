import { showInvalid } from "./validation_helper.js";
import { 
    initMap, 
    getVerification, 
    renderPickupInputField, 
    renderDropoffInputField,
    pickupAddressIsVerified,
    dropoffAddressIsVerified
} from "./new_req_addr_validation.js";
import { validateDateTime } from "./datetime_validation.js";

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


initMap();

// Add submit event listener to form
const form = document.getElementById('form');
form.addEventListener(
	'submit',
	(e) => {
		// Don't submit the form before validation.
		e.preventDefault();

		// Validate Date and Time inputs
		const dateAndTimeValidated = validateDateTime();

		if (
			dateAndTimeValidated &&
			pickupAddressIsVerified &&
			dropoffAddressIsVerified
		) {
			// form.submit();
		} else {
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
		}
	},
	true
);
