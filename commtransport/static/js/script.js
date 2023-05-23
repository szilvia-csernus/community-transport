// Materialize code for initialisation

$(document).ready(function () {
	$('.sidenav').sidenav({ edge: 'right' });
	$('.collapsible').collapsible();
	$('.tooltipped').tooltip();
	$('select').formSelect();
	$('.datepicker').datepicker({
		format: 'dd mmmm, yyyy',
		yearRange: 3,
		showClearBtn: true,
		i18n: {
			done: 'Select',
		},
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

// google maps autocompletion version 1 

    // function initMap() {
	// 		const CONFIGURATION = {
	// 			ctaTitle: 'Select Address',
	// 			mapOptions: {
	// 				center: { lat: 51.478543, lng: -0.647224 },
	// 				fullscreenControl: true,
	// 				mapTypeControl: false,
	// 				// streetViewControl: false,
	// 				zoom: 10,
	// 				zoomControl: true,
	// 				maxZoom: 22,
	// 				mapId: '',
	// 			},
	// 			mapsApiKey: 'AIzaSyCJKHrw61FGKpNiIY4H5eZhJF2rEYn1DJ0',
	// 			capabilities: {
	// 				addressAutocompleteControl: true,
	// 				mapDisplayControl: true,
	// 				ctaControl: true,
	// 			},
	// 		};
	// 		const componentForm = [
	// 			'location',
	// 			'locality',
	// 			'administrative_area_level_1',
	// 			'country',
	// 			'postal_code',
	// 		];

	// 		const getFormInputElement = (component) =>
	// 			document.getElementById(component + '-input');
	// 		const map = new google.maps.Map(document.getElementById('gmp-map'), {
	// 			zoom: CONFIGURATION.mapOptions.zoom,
	// 			center: { lat: 51.478543, lng: -0.647224 },
	// 			mapTypeControl: false,
	// 			fullscreenControl: CONFIGURATION.mapOptions.fullscreenControl,
	// 			zoomControl: CONFIGURATION.mapOptions.zoomControl,
	// 			// streetViewControl: CONFIGURATION.mapOptions.streetViewControl,
	// 		});
	// 		const marker = new google.maps.Marker({ map: map, draggable: false });
	// 		const autocompleteInput = getFormInputElement('location');
	// 		const autocomplete = new google.maps.places.Autocomplete(
	// 			autocompleteInput,
	// 			{
	// 				fields: ['address_components', 'geometry', 'name'],
	// 				types: ['address'],
	// 			}
	// 		);
	// 		autocomplete.addListener('place_changed', function () {
	// 			marker.setVisible(false);
	// 			const place = autocomplete.getPlace();
	// 			if (!place.geometry) {
	// 				// User entered the name of a Place that was not suggested and
	// 				// pressed the Enter key, or the Place Details request failed.
	// 				$('notification').addClass('visible')
	// 				window.alert("No details available for input: '" + place.name + "'");
	// 				return;
	// 			}
	// 			renderAddress(place);
	// 			fillInAddress(place);
	// 		});

	// 		function fillInAddress(place) {
	// 			// optional parameter
	// 			const addressNameFormat = {
	// 				street_number: 'short_name',
	// 				route: 'long_name',
	// 				locality: 'long_name',
	// 				administrative_area_level_1: 'short_name',
	// 				country: 'long_name',
	// 				postal_code: 'short_name',
	// 			};
	// 			const getAddressComp = function (type) {
	// 				for (const component of place.address_components) {
	// 					if (component.types[0] === type) {
	// 						return component[addressNameFormat[type]];
	// 					}
	// 				}
	// 				return '';
	// 			};
	// 			getFormInputElement('location').value =
	// 				getAddressComp('street_number') + ' ' + getAddressComp('route');
	// 			for (const component of componentForm) {
	// 				// Location field is handled separately above as it has different logic.
	// 				if (component !== 'location') {
	// 					getFormInputElement(component).value = getAddressComp(component);
	// 				}
	// 			}
	// 		}

	// 		function renderAddress(place) {
	// 			map.setCenter(place.geometry.location);
	// 			marker.setPosition(place.geometry.location);
	// 			marker.setVisible(true);
	// 		}
	// 	}
    // function initMap() {
	// 		const CONFIGURATION = {
	// 			ctaTitle: 'Select Address',
	// 			mapOptions: {
	// 				center: { lat: 51.478543, lng: -0.647224 },
	// 				fullscreenControl: true,
	// 				mapTypeControl: false,
	// 				// streetViewControl: false,
	// 				zoom: 10,
	// 				zoomControl: true,
	// 				maxZoom: 22,
	// 				mapId: '',
	// 			},
	// 			mapsApiKey: 'AIzaSyCJKHrw61FGKpNiIY4H5eZhJF2rEYn1DJ0',
	// 			capabilities: {
	// 				addressAutocompleteControl: true,
	// 				mapDisplayControl: true,
	// 				ctaControl: true,
	// 			},
	// 		};
	// 		const componentForm = [
	// 			'location',
	// 			'locality',
	// 			'administrative_area_level_1',
	// 			'country',
	// 			'postal_code',
	// 		];

	// 		const map = new google.maps.Map(document.getElementById('gmp-map'), {
	// 			zoom: CONFIGURATION.mapOptions.zoom,
	// 			center: { lat: 51.478543, lng: -0.647224 },
	// 			mapTypeControl: false,
	// 			fullscreenControl: CONFIGURATION.mapOptions.fullscreenControl,
	// 			zoomControl: CONFIGURATION.mapOptions.zoomControl,
	// 			streetViewControl: CONFIGURATION.mapOptions.streetViewControl,
	// 		});
		// 	const marker = new google.maps.Marker({ map: map, draggable: false });
		// 	const autocompleteInput = getFormInputElement('location');
		// 	const autocomplete = new google.maps.places.Autocomplete(
		// 		autocompleteInput,
		// 		{
		// 			fields: ['address_components', 'geometry', 'name'],
		// 			types: ['address'],
		// 		}
		// 	);
		// 	autocomplete.addListener('place_changed', function () {
		// 		marker.setVisible(false);
		// 		const place = autocomplete.getPlace();
		// 		if (!place.geometry) {
		// 			// User entered the name of a Place that was not suggested and
		// 			// pressed the Enter key, or the Place Details request failed.
		// 			$('notification').addClass('visible')
		// 			window.alert("No details available for input: '" + place.name + "'");
		// 			return;
		// 		}
		// 		renderAddress(place);
		// 		fillInAddress(place);
		// 	});

		// 	function fillInAddress(place) {
		// 		// optional parameter
		// 		const addressNameFormat = {
		// 			street_number: 'short_name',
		// 			route: 'long_name',
		// 			locality: 'long_name',
		// 			administrative_area_level_1: 'short_name',
		// 			country: 'long_name',
		// 			postal_code: 'short_name',
		// 		};
		// 		const getAddressComp = function (type) {
		// 			for (const component of place.address_components) {
		// 				if (component.types[0] === type) {
		// 					return component[addressNameFormat[type]];
		// 				}
		// 			}
		// 			return '';
		// 		};
		// 		getFormInputElement('location').value =
		// 			getAddressComp('street_number') + ' ' + getAddressComp('route');
		// 		for (const component of componentForm) {
		// 			// Location field is handled separately above as it has different logic.
		// 			if (component !== 'location') {
		// 				getFormInputElement(component).value = getAddressComp(component);
		// 			}
		// 		}
		// 	}

		// 	function renderAddress(place) {
		// 		map.setCenter(place.geometry.location);
		// 		marker.setPosition(place.geometry.location);
		// 		marker.setVisible(true);
		// 	}
		// }
  



