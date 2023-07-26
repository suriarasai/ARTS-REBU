import { markers } from '@/pages/map'
import { MARKERS } from '@/constants'
import { Location, User } from '@/types'

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
