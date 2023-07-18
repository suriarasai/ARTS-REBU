export default function setMarkerVisibility(
	marker: Array<google.maps.Marker>,
	map: google.maps.Map | null = null
) {
	/*
	 * Hides the initial taxis that were rendered to show the nearest N taxis
	 * Used by: Booking
	 */
	for (let i = 0; i < marker.length; i++) {
		marker[i].setMap(map)
	}
}
