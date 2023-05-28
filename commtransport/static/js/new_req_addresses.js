// Starter code from google maps

// Initialize and add the map
let map;

async function initMap() {
	const center = { lat: 51.478543, lng: -0.647224 };
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
		componentRestrictions: { country: 'uk' },
		fields: ['place_id', 'formatted_address'],
		strictBounds: false,
		types: ['address']
	};

	// Request needed libraries.
	const { Map } = await google.maps.importLibrary('maps');
	const { Autocomplete } = await google.maps.importLibrary('places');

	const pickupAutocomplete = new Autocomplete(pickupAddressInput, options);
	const dropoffAutocomplete = new Autocomplete(dropoffAddressInput, options);


	pickupMap = new Map(document.getElementById('pickup_map'), {
		zoom: 4,
		center: center,
		mapId: 'DEMO_MAP_ID',
	});

	dropoffMap = new Map(document.getElementById('dropoff_map'), {
		zoom: 4,
		center: center,
		mapId: 'DEMO_MAP_ID',
	});


	pickupAutocomplete.bindTo('bounds', pickupMap);
	dropoffAutocomplete.bindTo('bounds', dropoffMap);

	const pickupNotification = document.getElementById('pickup_notification');
	const dropoffNotification = document.getElementById('dropoff_notification');

	pickupAutocomplete.addListener('place_changed', function () {
				const place = pickupAutocomplete.getPlace();
				console.log('place changed', place)
				if (!place?.place_id) {
					// User entered the name of a Place that was not suggested and
					// pressed the Enter key, or the Place Details request failed.
					pickupNotification.style.display = 'block';
					pickupAddressInput.style['border-bottom'] = '1px solid #f44336';
					pickupAddressInput.style['box-shadow'] = '0 1px 0 0 #f44336';
					return;
				} else {
					pickupAddressInput.style['border-bottom'] = '1px solid #4caf50';
					pickupAddressInput.style['box-shadow'] = '0 1px 0 0 #4caf50';
					pickupNotification.style.display = 'none';
					pickupAddressInput.value = place.formatted_address;
					pickupAddressId.value = place.place_id
				}
				// renderAddress(place);
				// fillInAddress(place);
			});

	pickupAddressInput.addEventListener('focusout', function () {
		
		console.log(pickupAddressId.value)
		if (!pickupAddressId.value) {
			// User entered the name of a Place that was not suggested and
			// pressed the Enter key, or the Place Details request failed.
			pickupNotification.style.display = 'block';
			pickupAddressInput.style['border-bottom'] = '1px solid #f44336';
			pickupAddressInput.style['box-shadow'] = '0 1px 0 0 #f44336';
		}
		else {
			pickupAddressInput.style['border-bottom'] = '1px solid #4caf50';
			pickupAddressInput.style['box-shadow'] = '0 1px 0 0 #4caf50';
			pickupNotification.style.display = 'none';
		}
	})

	pickupAddressInput.addEventListener('focusin', function () {
				
		if (!pickupAddressId.value) {
			// User entered the name of a Place that was not suggested and
			// pressed the Enter key, or the Place Details request failed.
			pickupNotification.style.display = 'none';
			pickupAddressInput.style['border-bottom'] = '';
			pickupAddressInput.style['box-shadow'] = '';
		}
	});

	dropoffAutocomplete.addListener('place_changed', function () {
				const place = dropoffAutocomplete.getPlace();
				console.log('place changed', place)
				if (!place?.place_id) {
					// User entered the name of a Place that was not suggested and
					// pressed the Enter key, or the Place Details request failed.
					dropoffNotification.style.display = 'block';
					dropoffAddressInput.style['border-bottom'] = '1px solid #f44336';
					dropoffAddressInput.style['box-shadow'] = '0 1px 0 0 #f44336';
					return;
				} else {
					dropoffAddressInput.style['border-bottom'] = '1px solid #4caf50';
					dropoffAddressInput.style['box-shadow'] = '0 1px 0 0 #4caf50';
					dropoffNotification.style.display = 'none';
					dropoffAddressInput.value = place.formatted_address;
					dropoffAddressId.value = place.place_id
				}
				// renderAddress(place);
				// fillInAddress(place);
			});

	dropoffAddressInput.addEventListener('focusout', function () {
		
		console.log(dropoffAddressId.value)
		if (!dropoffAddressId.value) {
			// User entered the name of a Place that was not suggested and
			// pressed the Enter key, or the Place Details request failed.
			dropoffNotification.style.display = 'block';
			dropoffAddressInput.style['border-bottom'] = '1px solid #f44336';
			dropoffAddressInput.style['box-shadow'] = '0 1px 0 0 #f44336';
		}
		else {
			dropoffAddressInput.style['border-bottom'] = '1px solid #4caf50';
			dropoffAddressInput.style['box-shadow'] = '0 1px 0 0 #4caf50';
			dropoffNotification.style.display = 'none';
		}
	})

	dropoffAddressInput.addEventListener('focusin', function () {
				
		if (!dropoffAddressId.value) {
			// User entered the name of a Place that was not suggested and
			// pressed the Enter key, or the Place Details request failed.
			dropoffNotification.style.display = 'none';
			dropoffAddressInput.style['border-bottom'] = '';
			dropoffAddressInput.style['box-shadow'] = '';
		}
	});

}

initMap();