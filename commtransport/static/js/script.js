// Materialize code for initialisation

$(document).ready(function () {
	let minDate = new Date();
	minDate.setDate(minDate.getDate() + 1);
	let maxDate = new Date();
	maxDate.setDate(maxDate.getDate() + 90);

	$('.sidenav').sidenav({ edge: 'right' });
	$('.collapsible').collapsible();
	$('.tooltipped').tooltip();
	$('select').formSelect();
	$('.datepicker').datepicker({
		format: 'dd mmmm, yyyy',
		yearRange: 3,
		showClearBtn: true,
		minDate: minDate,
		maxDate: maxDate,
		yearRange: 1,
		i18n: {
			done: 'Select',
		},
	});
	$('.timepicker').timepicker({
		defaultTime: 'now',
	});

	// custom validation for the Materialize select element. (The select element is replaced by Materialize to a <ul> element
	// hence the 'required' property will be ignored and does not get proper validation.)
	validateMaterializeSelect();
	function validateMaterializeSelect() {
		let classValid = {
			'border-bottom': '1px solid #4caf50',
			'box-shadow': '0 1px 0 0 #4caf50',
		};
		let classInvalid = {
			'border-bottom': '1px solid #f44336',
			'box-shadow': '0 1px 0 0 #f44336',
		};
		if ($('select.validate').prop('required')) {
			$('select.validate').css({
				display: 'block',
				height: '0',
				padding: '0',
				width: '0',
				position: 'absolute',
			});
		}
		$('.select-wrapper input.select-dropdown')
			.on('focusin', function () {
				$(this)
					.parent('.select-wrapper')
					.on('change', function () {
						if (
							$(this)
								.children('ul')
								.children('li.selected:not(.disabled)')
								.on('click', function () {})
						) {
							$(this).children('input').css(classValid);
						}
					});
			})
			.on('click', function () {
				if (
					$(this)
						.parent('.select-wrapper')
						.children('ul')
						.children('li.selected:not(.disabled)')
						.css('background-color') === 'rgba(0, 0, 0, 0.03)'
				) {
					$(this).parent('.select-wrapper').children('input').css(classValid);
				} else {
					$('.select-wrapper input.select-dropdown').on(
						'focusout',
						function () {
							if (
								$(this)
									.parent('.select-wrapper')
									.children('select')
									.prop('required')
							) {
								if (
									$(this).css('border-bottom') != '1px solid rgb(76, 175, 80)'
								) {
									$(this)
										.parent('.select-wrapper')
										.children('input')
										.css(classInvalid);
								}
							}
						}
					);
				}
			});
	}

	validateAddressSelect();
	function validateAddressSelect() {
		let classValid = {
			'border-bottom': '1px solid #4caf50',
			'box-shadow': '0 1px 0 0 #4caf50',
		};
		let classInvalid = {
			'border-bottom': '1px solid #f44336',
			'box-shadow': '0 1px 0 0 #f44336',
		};
		if ($('select.validate').prop('required')) {
			$('select.validate').css({
				display: 'block',
				height: '0',
				padding: '0',
				width: '0',
				position: 'absolute',
			});
		}
		$('.select-wrapper input.select-dropdown')
			.on('focusin', function () {
				$(this)
					.parent('.select-wrapper')
					.on('change', function () {
						if (
							$(this)
								.children('ul')
								.children('li.selected:not(.disabled)')
								.on('click', function () {})
						) {
							$(this).children('input').css(classValid);
						}
					});
			})
			.on('click', function () {
				if (
					$(this)
						.parent('.select-wrapper')
						.children('ul')
						.children('li.selected:not(.disabled)')
						.css('background-color') === 'rgba(0, 0, 0, 0.03)'
				) {
					$(this).parent('.select-wrapper').children('input').css(classValid);
				} else {
					$('.select-wrapper input.select-dropdown').on(
						'focusout',
						function () {
							if (
								$(this)
									.parent('.select-wrapper')
									.children('select')
									.prop('required')
							) {
								if (
									$(this).css('border-bottom') != '1px solid rgb(76, 175, 80)'
								) {
									$(this)
										.parent('.select-wrapper')
										.children('input')
										.css(classInvalid);
								}
							}
						}
					);
				}
			});
	}
});




