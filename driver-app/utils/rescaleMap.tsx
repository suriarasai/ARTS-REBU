export function rescaleMap(map: google.maps.Map, polyline: []) {
	let bounds = new google.maps.LatLngBounds()
	for (let i = 0; i < polyline.length; i++) {
		bounds.extend(polyline[i])
	}
	map.fitBounds(bounds)
}