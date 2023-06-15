export function moveToStep(marker, polyline, iter, timer) {
	/*
	 * Incrementally moves a given marker along a polyline to simulate real-time motion
	 *
	 * @param marker	: a marker object returned by Google Maps (Marker API)
	 * @param polyline	: a polyline object returned by Google Maps (DirectionsService API)
	 * @param iter		: iterator (similar to a 'for' loop)
	 * @param timer		: miliseconds between each iteration (in miliseconds)
	 */
	if (polyline.length - 1 >= iter) {
		marker.setPosition({
			lat: polyline[iter].lat,
			lng: polyline[iter].lng,
		})
		window.setTimeout(function () {
			moveToStep(marker, polyline, iter + 1, timer)
		}, timer)
	}
}
