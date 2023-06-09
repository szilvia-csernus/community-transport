// Starter code from google maps api documentation

// Initialize and add the map
let map;

async function initMap() {
	let addressIsVerified = false;

	// Put Egham in the centre of the map
	const center = { lat: 51.432274, lng: -0.544086 };
	// Create a bounding box with sides ~10km away from the center point
	const defaultBounds = {
		north: center.lat + 0.1,
		south: center.lat - 0.1,
		east: center.lng + 0.1,
		west: center.lng - 0.1,
	};

	const addressInput = document.getElementById('address');
	const addressId = document.getElementById('address_id');

	// address_components and geometry fields can potentially be helpful too.
	// but they are all billed individually!
	const options = {
		bounds: defaultBounds,
		fields: ['place_id', 'formatted_address'],
		strictBounds: true,
		types: ['address'],
	};

	// Request needed libraries.
	const { Map } = await google.maps.importLibrary('maps');
	const { Autocomplete } = await google.maps.importLibrary('places');

	// Initializing a new Autocomplete object intance
	const autocomplete = new Autocomplete(addressInput, options);

	// Initializing a new Map object instance (this seems to be
	// necessary even though no map gets rendered!).
	map = new Map(document.getElementById('map'), {
		zoom: 4,
		center: center,
	});

	// set bounds +/- 10 km from the centre of Egham
	const southwest = { lat: 51.32274, lng: -0.644086 };
	const northeast = { lat: 51.532274, lng: -0.444086 };
	const newBounds = new google.maps.LatLngBounds(southwest, northeast);

	// Bind autocomplete bounds to autocomplate
	autocomplete.setBounds(newBounds);

	// Grab notification HTML element
	const notification = document.getElementById('addressNotification');

	// Look up placeId: is it a verified place in Google Maps?
	async function getVerification(placeId, placeAddress, callback) {
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
					console.log('TRUE');
					console.log(place.formatted_address);
					// if place_id matches the address currently in the
					// address input element
					if (place.formatted_address == placeAddress) {
						addressIsVerified = true;
						callback(true);
					} else {
						// if id is verified but doesn't match the typed in
						// address (because it was newly typed in wrongly)
						console.log('Id okay but address not.');
						addressIsVerified = false;
						callback(false);
					}
				} else {
					console.log('FALSE', place);
					addressIsVerified = false;
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
				addressIsVerified = false;
				callback(false);
			}
		);
	}

	function renderInputField(is_verified) {
		if (!is_verified) {
			// The value in the input field is not recognised by google
			// display a notification and set red underline
			notification.style.display = 'block';
			addressInput.style['border-bottom'] = '1px solid #f44336';
			addressInput.style['box-shadow'] = '0 1px 0 0 #f44336';
			// if addressId is not verified or addressId doesn't match the
			// entered address, clear out addressId.
			addressId.value = '';
		} else {
			// if verification was successful set the underline to
			// green and hide the notification
			addressInput.style['border-bottom'] = '1px solid #4caf50';
			addressInput.style['box-shadow'] = '0 1px 0 0 #4caf50';
			notification.style.display = 'none';
		}
	}

	function autocompleteInput() {
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
			addressIsVerified = true;
		}
	}

	// if address is already filled in, get it verified straight away.
	console.log(addressId);
	if (addressId.value) {
		getVerification(addressId.value, addressInput.value, renderInputField);
	} else {
		notification.style.display = 'block';
		addressInput.style['border-bottom'] = '1px solid #f44336';
		addressInput.style['box-shadow'] = '0 1px 0 0 #f44336';
	}

	autocomplete.addListener('place_changed', () => {
		// every time the address input changes
		if (addressId.value) {
			getVerification(addressId.value, addressInput.value, renderInputField);
		} else {
			autocompleteInput();
		}
	});

	addressInput.addEventListener('focusout', () => {
		// Every time the user clicks out of the address input field, perform
		// this verification.
		if (addressId.value) {
			getVerification(addressId.value, addressInput.value, renderInputField);
		} else {
			notification.style.display = 'block';
			addressInput.style['border-bottom'] = '1px solid #f44336';
			addressInput.style['box-shadow'] = '0 1px 0 0 #f44336';
		}
	});

	// prevent form subbmission unless address is verified
	const form = document.getElementById('form');
	form.addEventListener(
		'submit',
		(e) => {
			console.log(e);
			e.preventDefault();
			if (addressIsVerified) {
				form.submit();
			} else {
				if (addressId.value) {
					getVerification(
						addressId.value,
						addressInput.value,
						renderInputField
					);
				} else {
					notification.style.display = 'block';
					addressInput.style['border-bottom'] = '1px solid #f44336';
					addressInput.style['box-shadow'] = '0 1px 0 0 #f44336';
				}
			}
		},
		true
	);
}

initMap();