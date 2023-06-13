export function expandArray(coords, steps) {
	var arr = [];
	var latInc;
	var lngInc;
	for (var i = 0; i < coords.length - 1; i++) {
		latInc = (coords[i + 1].lat() - coords[i].lat()) / steps;
		lngInc = (coords[i + 1].lng() - coords[i].lng()) / steps;
		for (var j = 0; j < steps; j++) {
			arr.push({
				lat: coords[i].lat() + (j + 1) * latInc,
				lng: coords[i].lng() + (j + 1) * lngInc,
			});
		}
	}
	return arr;
}
