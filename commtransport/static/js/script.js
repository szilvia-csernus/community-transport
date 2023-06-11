// Materialize code for initialisation

document.addEventListener('DOMContentLoaded', function () {
	// Initialize side navigation
	const sidenavs = document.querySelectorAll('.sidenav');
	M.Sidenav.init(sidenavs, {edge: 'right'});

	// Initialize Collapsible lists
	const collapsibles = document.querySelectorAll('.collapsible');
	M.Collapsible.init(collapsibles);

	// Initialize Tooltips
	const tooltips = document.querySelectorAll('.tooltipped');
	M.Tooltip.init(tooltips);

	// Initialize Date Picker
	const datepicker = document.querySelector('.datepicker');
	console.log(datepicker);

	let minDate = new Date();
	minDate.setDate(minDate.getDate() + 1);
	let maxDate = new Date();
	maxDate.setDate(maxDate.getDate() + 90);

	M.Datepicker.init(datepicker, {
		format: 'dd mmmm, yyyy',
		// parse: "%Y-%m-%d",
		yearRange: 3,
		showClearBtn: true,
		minDate: minDate,
		maxDate: maxDate,
		yearRange: 1,
		i18n: {
			done: 'Select',
		},
	});

	// Initialize Time Picker
	const timepickers = document.querySelectorAll('.timepicker');
	M.Timepicker.init(timepickers, {
		defaultTime: '9:00 AM',
	});

});