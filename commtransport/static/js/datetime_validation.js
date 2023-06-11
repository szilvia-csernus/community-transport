import { showInvalid, showValid } from "./validation_helper.js";

/** Validate Date input */
function validateDate(dateInput, dateInputField, dateNotification) {
    const datePattern =
			/^(\d{1,2})\s(January|February|March|April|May|June|July|August|September|October|November|December),\s\d{4}$/;
    let isDateValid = datePattern.test(dateInput);

    console.log('Date is Valid:', isDateValid);

    // Show notification if date is invalid
    if (!isDateValid) {
        showInvalid(
            dateInputField,
            dateNotification,
            'Please use the Popup Calendar to select date.'
        );
        dateInputField.focus();
    } else {
        showValid(dateInputField, dateNotification);
    }

    if (isDateValid) {

        // calculate if request time is in the past
        const dateInputInDateFormat = new Date(dateInput);
        console.log(dateInputInDateFormat);
        let now = new Date();
        let inThePast = dateInputInDateFormat < now;
        console.log('in the past: ', inThePast);
        
        // calculate if request time is too far
        const threeMonthsLater = new Date();
        threeMonthsLater.setDate(now.getDate() + 90);
        let tooFar = dateInputInDateFormat > threeMonthsLater;
        console.log('too far: ', tooFar);
        
        // if date is in the past, show notification
        if (inThePast) {
            showInvalid(
                dateInputField,
                dateNotification,
                'Pickup date can not be in the past.'
                );
                dateInputField.focus();
                isDateValid = false;
            }
            // if date too far show notification
            else if (tooFar) {
                showInvalid(
                    dateInputField,
                    dateNotification,
                    'Pickup date should be within 3 months.'
                    );
                    dateInputField.focus();
                    isDateValid = false;
                }
    }

    return isDateValid
}
    
/** Validate Time input */
function validateTime(timeInput, timeInputField, timeNotification) {
	
    // Validate Time input against pattern
	const timePattern = /^(0?[1-9]|1[0-2]):[0-5][0-9] [AP]M$/;
	let isTimeValid = timePattern.test(timeInput);

	console.log('Time is valid', isTimeValid);

	// Show notification if time is invalid
	if (!isTimeValid) {
		showInvalid(
			timeInputField,
			timeNotification,
			'Please use the Popup Clock to select time.'
		);
		timeInputField.focus();
	} else {
		showValid(timeInputField, timeNotification);
	}

    return isTimeValid
}

/** Validate Date and Time inputs of form */
export function validateDateTime() {
	// Grab all form data
	const formData = new FormData(form);

    // Grab Date data
	const dateInput = formData.get('date');
	console.log(dateInput);
	const dateNotification = document.getElementById('date-notification');
	const dateInputField = document.getElementById('date');
	// Validate Date input
	const isDateValid = validateDate(dateInput, dateInputField, dateNotification);

    // Grab Time data
	const timeNotification = document.getElementById('time-notification');
	const timeInputField = document.getElementById('time');
	const timeInput = formData.get('time');
	console.log(timeInput);
	// Validate Time input
	const isTimeValid = validateTime(timeInput, timeInputField, timeNotification);

	// Return value is true if both Date & Time are valid
	return isDateValid && isTimeValid ? true : false;
}