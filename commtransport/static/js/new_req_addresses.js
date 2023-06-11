// Starter code from google maps api documentation

// Initialize and add the map
let map;

async function initMap() {
	let pickupAddressIsVerified = false;
	let dropoffAddressIsVerified = false;

	// Put Egham in the centre of the map
	const center = { lat: 51.432274, lng: -0.544086 };
	// Create a bounding box with sides ~10km away from the center point
	const defaultBounds = {
		north: center.lat + 0.1,
		south: center.lat - 0.1,
		east: center.lng + 0.1,
		west: center.lng - 0.1,
	};

	const pickupAddressInput = document.getElementById('pickup_address');
	const pickupAddressId = document.getElementById('pickup_address_id');
	const dropoffAddressInput = document.getElementById('dropoff_address');
	const dropoffAddressId = document.getElementById('dropoff_address_id');

	// address_components and geometry fields can potentially be helpful too.
	// but they are all billed individually!
	const options = {
		bounds: defaultBounds,
		fields: ['place_id', 'formatted_address'],
		strictBounds: true,
		types: ['address'],
	};

	// Request Map library and initialize instance (this seems to be
	// necessary even though no map gets rendered!).
	const { Map } = await google.maps.importLibrary('maps');
	map = new Map(document.getElementById('map'), {
		zoom: 14,
		center: center,
	});

	// Request Autocomplete from places library
	const { Autocomplete } = await google.maps.importLibrary('places');

	// Initialize Augocomplete inputs
	const pickupAutocomplete = new Autocomplete(pickupAddressInput, options);
	const dropoffAutocomplete = new Autocomplete(dropoffAddressInput, options);

	// set bounds +/- 10 km from the centre of Egham
	const southwest = { lat: 51.32274, lng: -0.644086 };
	const northeast = { lat: 51.532274, lng: -0.444086 };
	const bounds = new google.maps.LatLngBounds(southwest, northeast);

	// Bind autocomplete bounds to autocomplate
	pickupAutocomplete.setBounds(bounds);
	dropoffAutocomplete.setBounds(bounds);

	const pickupNotification = document.getElementById('pickup_notification');
	const dropoffNotification = document.getElementById('dropoff_notification');

	// Look up placeId: is it a verified place in Google Maps?
	async function getVerification(
		placeId,
		placeAddress,
		whichAddress,
		callback
	) {
		const service = new google.maps.places.PlacesService(map);
		const request = {
			placeId: placeId,
			fields: ['formatted_address'],
		};

		await service.getDetails(
			request,
			(place, status) => {
				// if place_id exist
				if (status == google.maps.places.PlacesServiceStatus.OK) {
					// if place_id matches the address currently in the
					// address input element
					if (place.formatted_address == placeAddress) {
						if (whichAddress === 'pickup') {
							pickupAddressIsVerified = true;
						} else if (whichAddress === 'dropoff') {
							dropoffAddressIsVerified = true;
						}
						callback(true);
					} else {
						// if id is verified but doesn't match the typed in
						// address (because it was newly typed in wrongly)
						console.log('Id okay but address not.');
						if (whichAddress === 'pickup') {
							pickupAddressIsVerified = false;
						} else if (whichAddress === 'dropoff') {
							dropoffAddressIsVerified = false;
						}

						callback(false);
					}
				} else {
					console.log('FALSE', place);
					if (whichAddress === 'pickup') {
						pickupAddressIsVerified = true;
					} else if (whichAddress === 'dropoff') {
						dropoffAddressIsVerified = true;
					}
					callback(false);
				}
			},
			// display an error message if verification was unsuccessful
			(error) => {
				alert(
					"We could not verify the address because either \
				Google's Autocomplete Place service is down or your \
				internet connection is not reliable. Please try again later."
				);
				if (whichAddress === 'pickup') {
					pickupAddressIsVerified = false;
				} else if (whichAddress === 'dropoff') {
					dropoffAddressIsVerified = false;
				}
				callback(false);
			}
		);
	}

	function autocompleteInput(
		autocomplete,
		addressInput,
		addressId,
		notification,
		whichAddress
	) {
		const place = autocomplete.getPlace();
		if (!place || !place?.place_id) {
			// User entered the name of a Place that was not suggested
			// or the Place Details request failed,
			// display notification and red underlie
			notification.style.display = 'block';
			addressInput.style['border-bottom'] = '1px solid #f44336';
			addressInput.style['box-shadow'] = '0 1px 0 0 #f44336';
		} else {
			// if place is verified, add green underline
			addressInput.style['border-bottom'] = '1px solid #4caf50';
			addressInput.style['box-shadow'] = '0 1px 0 0 #4caf50';
			notification.style.display = 'none';
			addressInput.value = place.formatted_address;
			addressId.value = place.place_id;
			if (whichAddress === 'pickup') {
				pickupAddressIsVerified = true;
			} else if (whichAddress === 'dropoff') {
				dropoffAddressIsVerified = true;
			}
		}
	}

	function renderPickupInputField(is_verified) {
		if (!is_verified) {
			// The value in the input field is not recognised by google
			// display a notification and set red underline
			pickupNotification.style.display = 'block';
			pickupAddressInput.style['border-bottom'] = '1px solid #f44336';
			pickupAddressInput.style['box-shadow'] = '0 1px 0 0 #f44336';
			// if addressId is not verified or addressId doesn't match the
			// entered address, clear out addressId.
			pickupAddressId.value = '';
		} else {
			// if verification was successful set the underline to
			// green and hide the notification
			pickupAddressInput.style['border-bottom'] = '1px solid #4caf50';
			pickupAddressInput.style['box-shadow'] = '0 1px 0 0 #4caf50';
			pickupNotification.style.display = 'none';
		}
	}

	function renderDropoffInputField(is_verified) {
		if (!is_verified) {
			// The value in the input field is not recognised by google
			// display a notification and set red underline
			dropoffNotification.style.display = 'block';
			dropoffAddressInput.style['border-bottom'] = '1px solid #f44336';
			dropoffAddressInput.style['box-shadow'] = '0 1px 0 0 #f44336';
			// if addressId is not verified or addressId doesn't match the
			// entered address, clear out addressId.
			dropoffAddressId.value = '';
		} else {
			// if verification was successful set the underline to
			// green and hide the notification
			dropoffAddressInput.style['border-bottom'] = '1px solid #4caf50';
			dropoffAddressInput.style['box-shadow'] = '0 1px 0 0 #4caf50';
			dropoffNotification.style.display = 'none';
		}
	}

	// Check already filled in pickup address, get it verified straight away.
	if (pickupAddressId.value) {
		getVerification(
			pickupAddressId.value,
			pickupAddressInput.value,
			'pickup',
			renderPickupInputField
		);
	} else {
		pickupNotification.style.display = 'block';
		pickupAddressInput.style['border-bottom'] = '1px solid #f44336';
		pickupAddressInput.style['box-shadow'] = '0 1px 0 0 #f44336';
	}

	pickupAutocomplete.addListener('place_changed', () => {
		// every time the address input changes
		if (pickupAddressId.value) {
			getVerification(
				pickupAddressId.value,
				pickupAddressInput.value,
				'pickup',
				renderPickupInputField
			);
		} else {
			autocompleteInput(
				pickupAutocomplete,
				pickupAddressInput,
				pickupAddressId,
				pickupNotification,
				'pickup'
			);
		}
	});

	pickupAddressInput.addEventListener('focusout', () => {
		// Every time the user clicks out of the address input field, perform
		// this verification.
		if (pickupAddressId.value) {
			getVerification(
				pickupAddressId.value,
				pickupAddressInput.value,
				'pickup',
				renderPickupInputField
			);
		} else {
			pickupNotification.style.display = 'block';
			pickupAddressInput.style['border-bottom'] = '1px solid #f44336';
			pickupAddressInput.style['box-shadow'] = '0 1px 0 0 #f44336';
		}
	});

	dropoffAutocomplete.addListener('place_changed', () => {
		// every time the address input changes
		if (dropoffAddressId.value) {
			getVerification(
				dropoffAddressId.value,
				dropoffAddressInput.value,
				'dropoff',
				renderDropoffInputField
			);
		} else {
			autocompleteInput(
				dropoffAutocomplete,
				dropoffAddressInput,
				dropoffAddressId,
				dropoffNotification,
				'dropoff'
			);
		}
	});

	dropoffAddressInput.addEventListener('focusout', () => {
		// Every time the user clicks out of the address input field, perform
		// this verification.
		if (dropoffAddressId.value) {
			getVerification(
				dropoffAddressId.value,
				dropoffAddressInput.value,
				'dropoff',
				renderDropoffInputField
			);
		} else {
			dropoffNotification.style.display = 'block';
			dropoffAddressInput.style['border-bottom'] = '1px solid #f44336';
			dropoffAddressInput.style['box-shadow'] = '0 1px 0 0 #f44336';
		}
	});

	// prevent form subbmission unless address is verified
	const form = document.getElementById('form');
	form.addEventListener(
		'submit',
		(e) => {
			// Don't submit the form before validation.
			e.preventDefault();

			// Grab all form data
			const formData = new FormData(form);

			// Validate Date input
			const dateInput = formData.get('date');
			console.log(dateInput);
			const dateNotification = document.getElementById('date-notification');
			const dateInputField = document.getElementById('date');
			const transformedDate = new Date(dateInput);
			console.log("transformed Date", transformedDate);

			if (!transformedDate) {
				dateNotification.style.display = 'block';
				dateInputField.style['border-bottom'] = '1px solid #f44336';
				dateInputField.style['box-shadow'] = '0 1px 0 0 #f44336';
				dateInputField.focus()
				return;
			}

			// Validate Time input
			const timeInput = formData.get('time');
			console.log(timeInput);
			const timeNotification = document.getElementById('time-notification');
			const timeInputField = document.getElementById('time');
			const timeArr = timeInput.split(':');
			const calculatedTime = (timeArr[0] * 60 + timeArr[1]) * 60000
			var newDateTime = new Date(calculatedTime);
			console.log(calculatedTime);
		
			console.log('transformed Time', newDateTime);

			if (!newDateTime) {
				timeNotification.style.display = 'block';
				timeInputField.style['border-bottom'] = '1px solid #f44336';
				timeInputField.style['box-shadow'] = '0 1px 0 0 #f44336';
				timeInputField.focus()
				return;
			}

			if (pickupAddressIsVerified && dropoffAddressIsVerified) {
				form.submit();
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
						pickupNotification.style.display = 'block';
						pickupAddressInput.style['border-bottom'] = '1px solid #f44336';
						pickupAddressInput.style['box-shadow'] = '0 1px 0 0 #f44336';
						pickupAddressInput.focus()
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
						dropoffNotification.style.display = 'block';
						dropoffAddressInput.style['border-bottom'] = '1px solid #f44336';
						dropoffAddressInput.style['box-shadow'] = '0 1px 0 0 #f44336';
						dropoffAddressInput.focus()
					}
				}
			}
		},
		true
	);
}

initMap();