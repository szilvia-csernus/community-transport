import { showInvalid, showValid } from './validation_helper.js';

// Grab HTML elements
const dateNotification = document.getElementById('date-notification');
const dateInputField = document.getElementById('date');
const timeNotification = document.getElementById('time-notification');
const timeInputField = document.getElementById('time');

/** Validate Date input */
export function validateDate(dateInput) {
    
	const datePattern =
		/^(\d{1,2})\s(January|February|March|April|May|June|July|August|September|October|November|December),\s\d{4}$/;
	let isDateValid = datePattern.test(dateInput);

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
		let now = new Date();
		let inThePast = dateInputInDateFormat < now;

		// calculate if request time is too far
		const threeMonthsLater = new Date();
		threeMonthsLater.setDate(now.getDate() + 90);
		let tooFar = dateInputInDateFormat > threeMonthsLater;

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
    return isDateValid;
}

/** Validate Time input */
export function validateTime(timeInput) {
	
	// Validate Time input against pattern
	const timePattern = /^(0?[1-9]|1[0-2]):[0-5][0-9] [AP]M$/;
	let isTimeValid = timePattern.test(timeInput);

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
    return isTimeValid;
}

// Date and Time validation happens only when the form gets submitted. That is because
// these fields are controlled by Materialize and it seems that they multiplied the 
// input fields by the available dates / minutes. When I tried to attach my event
// listeners to these input fields, they got attached a million times, causing
// stack overflow.