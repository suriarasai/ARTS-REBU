export function moveToStep(
	marker,
	polyline,
	iter,
	timer,
	ETA,
	setETA,
	stepsPerMinute,
	clickedOption
) {
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
		if (iter % stepsPerMinute == 0) {
			const nextDecrement = ETA[clickedOption] - 60
			setETA((ETA) => ({
				...ETA,
				[clickedOption]: nextDecrement >= 0 ? nextDecrement : 0,
			}))
		}
		window.setTimeout(function () {
			moveToStep(
				marker,
				polyline,
				iter + 1,
				timer,
				ETA,
				setETA,
				stepsPerMinute,
				clickedOption
			)
		}, timer)
	}
}
