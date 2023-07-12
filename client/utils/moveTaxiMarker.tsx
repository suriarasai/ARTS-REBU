export function moveToStep(
	marker,
	polyline,
	iter,
	timer,
	_callback,
	ETA: any = 0,
	setETA = (n) => {},
	stepsPerMinute = 1000,
	clickedOption = 0
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

		// iter < polyline.length - 1 &&
		// 	marker.setIcon({
		// 		path: icon.taxiMarker,
		// 		fillColor: '#d9f99d',
		// 		fillOpacity: 1,
		// 		scale: 0.03,
		// 		strokeColor: '#65a30d',
		// 		strokeWeight: 0.5,
		// 		rotation:
		// 			google.maps.geometry.spherical.computeHeading(
		// 				polyline[iter],
		// 				polyline[iter + 1]
		// 			) + 270,
		// 	})

		if (iter % stepsPerMinute == 0) {
			if (clickedOption === 0) {
				setETA((ETA) => ETA)
			} else {
				setETA((ETA) => ({
					...ETA,
					[clickedOption]: Math.max(ETA[clickedOption] - 60, 0),
				}))
			}
		}
		window.setTimeout(function () {
			moveToStep(
				marker,
				polyline,
				iter + 1,
				timer,
				_callback,
				ETA,
				setETA,
				stepsPerMinute,
				clickedOption
			)
		}, timer)
	} else {
		// the taxi has 'arrived', but in practice this also requires the driver's confirmation
		_callback()
	}
}

