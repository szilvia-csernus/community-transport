/**
 * Create a map with all the requests' start location marked with markerClusterer
 */
function initMap() {
    
    // grab the google place ids and convert them to an array
    const myPlaceIdsInBrackets = document.getElementById('map').dataset.locations;
    const myPlaceIdsString = myPlaceIdsInBrackets.slice(2,-2).replaceAll(",", "").replaceAll("'","");
    const myPlaceIdsArray = myPlaceIdsString.split(" ");
    
    // initialize gecoder
    const geocoder = new google.maps.Geocoder();

    // geocode one place id
    async function getOneLocation(placeId) {
      try {
        const result = await geocoder.geocode({ placeId: placeId })
			  return result.results[0].geometry.location.toJSON();
      }
      catch (error) {
        // if location was not found, return with no value
        return 
      }
		}

    // geocode the array of place ids and return them in an array
    async function getLocations(placeIds) {
			const resultsArray = [];

			for (const placeId of placeIds) {
				const result = await getOneLocation(placeId);
				resultsArray.push(result);
			}

      return resultsArray
    }

    // create a map with cluster markers with the geocoded locations
    async function createMapWithMarkers() {

      const locationsData = await getLocations(myPlaceIdsArray);

      console.log(locationsData)
      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: locationsData[0],
      });

      const markers = []
      locationsData.forEach( (location, i) => {
				const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        // empty values will not get marked.
        if (typeof location !== 'undefined' ) {
          markers.push( new google.maps.Marker({
						position: location,
						label: labels[i % labels.length],
					}));
        }
				
			});

      new markerClusterer.MarkerClusterer({
        map,
        markers,
      });
    }

    createMapWithMarkers()
  
}

window.initMap = initMap;
