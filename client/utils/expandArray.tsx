export function expandArray(coords, steps) {
	/* Adds points to an array by interpolating the coordinates between 2 points
	 *
	 * @param coords	: the polyline returned by Google Maps (DirectionService API)
	 * @param steps		: how many points to interpolate between every 2 points
	 */
	let arr = [] // array to store new data points
	let latInc // how much to increase the latitude by, each step
	let lngInc // how much to increase the longitude by, each step

	// Iterating through every coordinate in the polyline
	for (let i = 0; i < coords.length - 1; i++) {
		latInc = (coords[i + 1].lat() - coords[i].lat()) / steps
		lngInc = (coords[i + 1].lng() - coords[i].lng()) / steps

		// Iterating through every 'step'
		for (let j = 0; j < steps; j++) {
			arr.push({
				lat: coords[i].lat() + (j + 1) * latInc,
				lng: coords[i].lng() + (j + 1) * lngInc,
			})
		}
	}
	return arr
}
