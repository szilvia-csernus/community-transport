// Validate date input field - after Materialize validation - which is not
// complete (it's possible to overwrite the date manually witha any text.)

let minDate = new Date();
minDate.setDate(minDate.getDate() + 1);
let maxDate = new Date();
maxDate.setDate(maxDate.getDate() + 90);

// const dateInput = document.getElementById('date');
// dateInput.setAttribute('min', minDate);
// dateInput.setAttribute('max', maxDate);
// dateInput.value = minDate.toDateString();

const dateNotification = document.getElementById('date-notification');

function renderInputField(is_verified, inputField, inputNotification) {
	if (!is_verified) {
		// The value in the input field is not recognised by google
		// display a notification and set red underline
		inputNotification.style.display = 'block';
		inputField.style['border-bottom'] = '1px solid #f44336';
		inputField.style['box-shadow'] = '0 1px 0 0 #f44336';
	} else {
		// if verification was successful set the underline to
		// green and hide the notification
		inputField.style['border-bottom'] = '1px solid #4caf50';
		inputField.style['box-shadow'] = '0 1px 0 0 #4caf50';
		inputNotification.style.display = 'none';
	}
}

function verifyDate(dateInput) {
	let is_verified = false;

	return is_verified;
}

// dateInput.addEventListener('focusout', (e) => {
	// Every time the user clicks out of the date input field, perform
	// this verification.
	// console.log(dateInput);
	// const is_verified = verifyDate(dateInput.value);
	// renderInputField(is_verified, dateInput, dateNotification);
	// if (!is_verified) {
	// 	dateInput.focus();
	// }
// });
