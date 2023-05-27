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
	
	const addressInput = document.getElementById('address');
	const addressId = document.getElementById('address_id');
	const addressInput_nr2 = document.getElementById('address_nr2');
	const addressId_nr2 = document.getElementById('address_nr2_id');
	
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

	const autocomplete = new Autocomplete(addressInput, options);
	const autocomplete_nr2 = new Autocomplete(addressInput_nr2, options);


	map = new Map(document.getElementById('map'), {
		zoom: 4,
		center: center,
		mapId: 'DEMO_MAP_ID',
	});


	autocomplete.bindTo('bounds', map);

	const notification = document.getElementById('addressNotification');
	const notification_nr2 = document.getElementById('addressNotification_nr2');

	autocomplete.addListener('place_changed', function () {
				const place = autocomplete.getPlace();
				console.log('place changed', place)
				if (!place?.place_id) {
					// User entered the name of a Place that was not suggested and
					// pressed the Enter key, or the Place Details request failed.
					notification.style.display = 'block';
					addressInput.style['border-bottom'] = '1px solid #f44336';
					addressInput.style['box-shadow'] = '0 1px 0 0 #f44336';
					return;
				} else {
					addressInput.style['border-bottom'] = '1px solid #4caf50';
					addressInput.style['box-shadow'] = '0 1px 0 0 #4caf50';
					notification.style.display = 'none';
					addressInput.value = place.formatted_address;
					addressId.value = place.place_id
				}
				// renderAddress(place);
				// fillInAddress(place);
			});

	addressInput.addEventListener('focusout', function () {
		
		console.log(addressId.value)
		if (!addressId.value) {
			// User entered the name of a Place that was not suggested and
			// pressed the Enter key, or the Place Details request failed.
			notification.style.display = 'block';
			addressInput.style['border-bottom'] = '1px solid #f44336';
			addressInput.style['box-shadow'] = '0 1px 0 0 #f44336';
		}
		else {
			addressInput.style['border-bottom'] = '1px solid #4caf50';
			addressInput.style['box-shadow'] = '0 1px 0 0 #4caf50';
			notification.style.display = 'none';
		}
	})

	addressInput.addEventListener('focusin', function () {
				
		if (!addressId.value) {
			// User entered the name of a Place that was not suggested and
			// pressed the Enter key, or the Place Details request failed.
			notification.style.display = 'none';
			addressInput.style['border-bottom'] = '';
			addressInput.style['box-shadow'] = '';
		}
	});

}
	autocomplete_nr2?.addListener('place_changed', function () {
				const place = autocomplete_nr2?.getPlace();
				console.log('place changed', place)
				if (!place?.place_id) {
					// User entered the name of a Place that was not suggested and
					// pressed the Enter key, or the Place Details request failed.
					notification_nr2.style.display = 'block';
					addressInput_nr2.style['border-bottom'] = '1px solid #f44336';
					addressInput_nr2.style['box-shadow'] = '0 1px 0 0 #f44336';
					return;
				} else {
					addressInput_nr2.style['border-bottom'] = '1px solid #4caf50';
					addressInput_nr2.style['box-shadow'] = '0 1px 0 0 #4caf50';
					notification_nr2.style.display = 'none';
					addressInput_nr2.value = place.formatted_address;
					addressId_nr2.value = place.place_id
				}
				// renderAddress(place);
				// fillInAddress(place);
			});

	addressInput_nr2?.addEventListener('focusout', function () {
		
		console.log(addressId_nr2?.value)
		if (!addressId_nr2?.value) {
			// User entered the name of a Place that was not suggested and
			// pressed the Enter key, or the Place Details request failed.
			notification_nr2.style.display = 'block';
			addressInput_nr2.style['border-bottom'] = '1px solid #f44336';
			addressInput_nr2.style['box-shadow'] = '0 1px 0 0 #f44336';
		}
		else {
			addressInput_nr2.style['border-bottom'] = '1px solid #4caf50';
			addressInput_nr2.style['box-shadow'] = '0 1px 0 0 #4caf50';
			notification_nr2.style.display = 'none';
		}
	})

	addressInput_nr2?.addEventListener('focusin', function () {
				
		if (!addressId_nr2?.value) {
			// User entered the name of a Place that was not suggested and
			// pressed the Enter key, or the Place Details request failed.
			notification_nr2.style.display = 'none';
			addressInput_nr2.style['border-bottom'] = '';
			addressInput_nr2.style['box-shadow'] = '';
		}
	});


initMap();