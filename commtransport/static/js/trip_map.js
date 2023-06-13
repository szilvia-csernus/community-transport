// Google's route planning is written using the Google Api Documentation

/** Google map displaying a route between two locations */
function initMap() {
		// New instances of DirectionsService and DirectionsRenderer
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer();
		
		// initialize map with Egham in the center location 
        const map = new google.maps.Map(document.getElementById('map'), {
					zoom: 13,
					center: { lat: 51.428735, lng: -0.545846 },
				});
		
		// bind map to directionsRenderer 
        directionsRenderer.setMap(map);

		// Collect data from the HTML document
        const mapDiv = document.getElementById('map');
        const startLocation = mapDiv.dataset.start;
        const endLocation = mapDiv.dataset.end;

		const distance = document.getElementById('distance');
		const duration = document.getElementById('duration');

		// Calculate and display route
        directionsService
					.route({
						origin: {
							placeId: startLocation
						},
						destination: {
							placeId: endLocation
						},
						travelMode: google.maps.TravelMode.DRIVING,
					})
					.then((response) => {
						directionsRenderer.setDirections(response);
						distance.innerText = response.routes[0].legs[0].distance.text;
						duration.innerText = response.routes[0].legs[0].duration.text;
						
					});
    }


window.initMap = initMap;