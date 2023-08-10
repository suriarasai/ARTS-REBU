import { markers } from '@/pages/map'
import { MARKERS } from '@/constants'
import { Location } from '@/types'
import { mark } from './markers'

export function setOriginToUserLocation(
	map: google.maps.Map,
	userLocation: Location
) {
	if (markers.origin) {
		markers.origin.setPosition(
			new google.maps.LatLng(userLocation.lat, userLocation.lng)
		)
	} else {
		markers.origin = mark(map, userLocation, MARKERS.ORIGIN, true)
	}
}

export default function computeFare(
	type: 'regular' | 'plus',
	postcode: string,
	distance: number,
	pickUpTime: number
) {
	// Hours since the start of the day
	let startOfDay = new Date()
	startOfDay.setHours(0, 0, 0, 0)
	const t = (pickUpTime - startOfDay.getTime()) / 1000 / 60 / 60

	// Peak periods are 6:00-9:30 and 18:00-24:00
	const peak = (t > 6 && t < 9.5) || (t > 18 && t < 24)
	const night = t > 0 && t < 6
	const plus = type === 'plus'

	const bookingFee = 2 + (peak ? 2 : night ? 1 : plus ? 2 : 0)
	const baseFee = 2 + (peak ? 2 : plus ? 1 : 0)
	const meteredFee = ((0.25 + (plus ? 0.09 : 0)) * distance) / 400
	const peakFee = meteredFee * (peak ? 0.25 : night ? 0.5 : 0)
	const locationFee = locationSurchageMap[Number(postcode.substring(0, 2))]
	const tempSurchageFee = (0.01 * distance) / 500

	const meteredFare = Math.max(
		bookingFee +
			baseFee +
			meteredFee +
			peakFee +
			tempSurchageFee +
			(locationFee ? locationFee : 0),
		plus ? 7 : 5
	)

	console.log('Fare: $', meteredFare.toFixed(2))
	return meteredFare.toFixed(2)
}

// First 2 digits of postcode denote the region
// https://www.mingproperty.sg/singapore-district-code/
// LTA charges extra for these regions:
const locationSurchageMap: any = {
	1: 3,
	2: 3,
	3: 3,
	4: 3,
	5: 3,
	6: 3,
	9: 3,
	20: 3,
	21: 3,
	22: 3,
	23: 3,
	48: 3,
	49: 3,
	72: 3,
	79: 3,
	80: 3,
	81: 7, // Changi Airport
}

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

function distKM(lat1, lon1, lat2, lon2) {
	var a = Math
	var r = ((lat2 - lat1) * a.PI) / 180
	var c = ((lon2 - lon1) * a.PI) / 180

	var e =
		a.sin(r / 2) * a.sin(r / 2) +
		a.cos((lat1 * a.PI) / 180) *
			a.cos((lat2 * a.PI) / 180) *
			a.sin(c / 2) *
			a.sin(c / 2)

	return 2 * a.atan2(a.sqrt(e), a.sqrt(1 - e)) * 6371
}

export function expandArray(pos, prevPos, steps: number) {
	/* Adds points to an array by interpolating the coordinates between 2 points
	 *
	 * @param coords	: the polyline returned by Google Maps (DirectionService API)
	 * @param steps		: how many points to interpolate between every 2 points
	 */
	let arr = [] // array to store new data points

	const latInc = (pos.lat - prevPos.lat) / steps
	const lngInc = (pos.lng - prevPos.lng) / steps

	// Iterating through every 'step'
	for (let j = 0; j < steps; j++) {
		arr.push({
			lat: prevPos.lat + (j + 1) * latInc,
			lng: prevPos.lng + (j + 1) * lngInc,
		})
	}

	return arr
}

export let taxiMovementTimer

export function moveTaxiMarker(polyline, iter) {
	setTimeout(function () {
	taxiMovementTimer = markers.taxi.setPosition(
			new google.maps.LatLng(polyline[iter].lat, polyline[iter].lng)
		)
		if (iter < polyline.length - 1) {
			moveTaxiMarker(polyline, iter + 1)
		}
	}, 250 / polyline.length)
}