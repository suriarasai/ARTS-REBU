import { markers } from '@/pages/map'
import { MARKERS } from '@/constants'
import { Location, User } from '@/types'
import taxiStops from '@/public/resources/taxi-stops'

export function mark(
	map: google.maps.Map,
	place: Location,
	icon: any,
	title = true
) {
	return new google.maps.Marker({
		position: new google.maps.LatLng(place.lat, place.lng),
		map: map,
		title: title
			? place.placeName + ', ' + 'Singapore ' + place.postcode
			: 'Current Location',
		icon: {
			url: icon,
			scaledSize: new google.maps.Size(30, 30),
		},
	})
}

export function placeLocationMarkers(user: User, map: google.maps.Map) {
	const infoWindow = new google.maps.InfoWindow()

	markers.home = mark(map, user.home, MARKERS.HOME)
	markerPopup(markers.home, infoWindow)

	markers.work = mark(map, user.work, MARKERS.WORK)
	markerPopup(markers.work, infoWindow)

	user.savedLocations?.map((location, index: number) => {
		markers.saved.push(mark(map, location, MARKERS.SAVED))
		markerPopup(markers.saved[index], infoWindow)
	})
}

function markerPopup(marker: google.maps.Marker, info: google.maps.InfoWindow) {
	marker.addListener('click', () => {
		info.close()
		info.setContent(marker.getTitle())
		info.open(marker.getMap(), marker)
	})
}

export function loadNearbyTaxiStands(map, pos: Location) {
	const distances: [number, number, number][] = []
	if (markers.stands) markers.stands = []

	taxiStops.forEach(([a, b]: any) =>
		distances.push([Math.pow(a - pos.lng, 2) + Math.pow(b - pos.lat, 2), a, b])
	)

	distances.sort()
	let coords
	let newTaxi

	for (let i = 0; i < 5; i++) {
		coords = distances[i].slice(1, 3)
		newTaxi = new google.maps.Marker({
			map: map,
			position: new google.maps.LatLng(coords[1], coords[0]),
			icon: {
				url: MARKERS.STAND,
				scaledSize: new google.maps.Size(20, 20),
			},
		})
		markers.stands.push(newTaxi)
	}
}

export function toggleMarkers(map = null) {
	setMarkerVisibility(markers.stands, map)
	setMarkerVisibility(markers.saved, map)
	markers.home?.setMap(map)
	markers.work?.setMap(map)
	markers.user.setMap(map)

	if (map) {
		markers.origin?.setMap(null)
		markers.origin = null
		markers.dest.setMap(null)
		markers.dest = null
		markers.taxi?.setMap(null)
		markers.taxi = null
	}
}

export function setMarkerVisibility(
	marker: Array<google.maps.Marker>,
	map: google.maps.Map | null = null
) {
	for (let i = 0; i < marker.length; i++) {
		marker[i].setMap(map)
	}
}

export function computeNearbyTaxis(
	coord: Location,
	_callback
) {
	fetch('https://api.data.gov.sg/v1/transport/taxi-availability')
		.then(function (response) {
			return response.json()
		})
		.then(function (data) {
			const coordinates = data.features[0].geometry.coordinates

			const distances: Array<{
				distance: number
				lng: number
				lat: number
				index: number
			}> = []

			// Calculating the Euclidean distance
			coordinates.forEach(([a, b]: number[], index: number) =>
				distances.push({
					distance: Math.pow(a - coord.lng, 2) + Math.pow(b - coord.lat, 2),
					lng: a,
					lat: b,
					index: index + 1,
				})
			)

			// Sorting the distances in ascending order
			distances.sort((a, b) => a.distance - b.distance)
			_callback(distances)
		})
}
