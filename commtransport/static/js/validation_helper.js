export const showInvalid = (inputField, notificationField, message) => {
	inputField.style['border-bottom'] = '1px solid #f44336';
	inputField.style['box-shadow'] = '0 1px 0 0 #f44336';
	notificationField.style.display = 'block';
	if (message) {
		notificationField.lastElementChild.textContent = message;
	}
};

export const showValid = (inputField, notificationField) => {
	inputField.style['border-bottom'] = '1px solid #4caf50';
	inputField.style['box-shadow'] = '0 1px 0 0 #4caf50';
	notificationField.style.display = 'none';
};
