export function moveToStep(yourmarker, yourroute, c, timer) {
	if (yourroute.length - 1 >= c) {
		yourmarker.setPosition({
			lat: yourroute[c].lat,
			lng: yourroute[c].lng,
		});
		window.setTimeout(function () {
			moveToStep(yourmarker, yourroute, c + 1, timer);
		}, timer);
	}
}
