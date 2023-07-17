// TODO: PlaceName
export function getAddress(place: any, clickEvent = false) {
	let PlaceName = ''
	let Postcode = ''

	for (const component of place.address_components as google.maps.GeocoderAddressComponent[]) {
		const componentType = component.types[0]

		switch (componentType) {
			case 'street_number': {
				PlaceName = `${component.long_name} ${PlaceName}`
				break
			}

			case 'route': {
				PlaceName += component.short_name
				break
			}

			case 'postal_code': {
				Postcode = component.long_name
				break
			}
		}
	}

	if (PlaceName === '') {
		PlaceName = place.formatted_address
	}

	return {
		address: PlaceName,
		placeName: PlaceName,
		lat: clickEvent
			? place.geometry.location.lat
			: place.geometry.location.lat(),
		lng: clickEvent
			? place.geometry.location.lng
			: place.geometry.location.lng(),
		postcode: Postcode,
		placeID: place.place_id,
	}
}
