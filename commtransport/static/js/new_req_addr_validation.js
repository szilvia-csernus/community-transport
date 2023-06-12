import { showInvalid, showValid } from "./validation_helper.js";
import { pickupAddressId, 
	pickupAddressInput, 
	pickupNotification, 
	dropoffAddressId, 
	dropoffAddressInput, 
	dropoffNotification 
} from "./new_req_form_validation.js";

export let pickupAddressIsVerified = false;
export let dropoffAddressIsVerified = false;


// These functions will be overwritten in the initMap() function
export let getVerification = () => {};
export let renderPickupInputField = () => {};
export let renderDropoffInputField = () => {};


// Initialize map function with Autotocomplete and PlacesService
// using Google Maps Api documentation
let map;

export async function initMap() {
	
	// Put Egham in the centre of the map
	const center = { lat: 51.432274, lng: -0.544086 };
	// Create a bounding box with sides ~10km away from the center point
	const defaultBounds = {
		north: center.lat + 0.1,
		south: center.lat - 0.1,
		east: center.lng + 0.1,
		west: center.lng - 0.1,
	};

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

	// Bind autocomplete bounds to autocomplate. This, whith strictBounds:true
	// will makes sure that results are restricted to this area.
	pickupAutocomplete.setBounds(bounds);
	dropoffAutocomplete.setBounds(bounds);

	// Look up placeId: is it a verified place in Google Maps?
	getVerification = async (
		placeId,
		placeAddress,
		whichAddress,
		callback
	) => {
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
			showInvalid(addressInput, notification)

		} else {
			// if place is verified, add green underline
			showValid(addressInput, notification)
			// Add verified address to input field's value
			addressInput.value = place.formatted_address;
			// Add Google Place Id to hidden addressId field
			addressId.value = place.place_id;

			if (whichAddress === 'pickup') {
				pickupAddressIsVerified = true;
			} else if (whichAddress === 'dropoff') {
				dropoffAddressIsVerified = true;
			}
		}
	}

	renderPickupInputField = (is_verified) => {
		if (!is_verified) {
			// The value in the input field is not recognised by google
			// display a notification and set red underline
			showInvalid(pickupAddressInput, pickupNotification)
			// if addressId is not verified or addressId doesn't match the
			// entered address, clear out addressId.
			pickupAddressId.value = '';
		} else {
			// if verification was successful set the underline to
			// green and hide the notification
			showValid(pickupAddressInput, pickupNotification)
		}
	}

	renderDropoffInputField = (is_verified) => {
		if (!is_verified) {
			// The value in the input field is not recognised by google
			// display a notification and set red underline
			showInvalid(dropoffAddressInput, dropoffNotification)
			// if addressId is not verified or addressId doesn't match the
			// entered address, clear out addressId.
			dropoffAddressId.value = '';
		} else {
			// if verification was successful set the underline to
			// green and hide the notification
			showValid(dropoffAddressInput, dropoffNotification)
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
		showInvalid(pickupAddressInput, pickupNotification)
	}

	// Event Listeners 

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
			showInvalid(pickupAddressInput, pickupNotification);
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
			showInvalid(dropoffAddressInput, dropoffNotification);
		}
	});

}
