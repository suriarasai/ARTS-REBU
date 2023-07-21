export function moveToStep(
	marker: google.maps.Marker,
	polyline: google.maps.LatLng[],
	iter: number,
	timer: number,
	_callback: Function,
	ETA: any = 0,
	setETA: Function = () => {},
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
		} as google.maps.LatLng)

		if (iter % stepsPerMinute == 0) {
			if (clickedOption === 0) {
				setETA((ETA: any) => ETA)
			} else {
				setETA((ETA: any) => ({
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
