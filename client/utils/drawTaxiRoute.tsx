import { taxiRouteDisplay } from '../components/booking/RideConfirmation';

export function drawTaxiRoute(
	taxis,
	destination,
	map,
	setRoutes,
	setTaxiETA,
	_callback
) {
	taxiRouteDisplay = new google.maps.DirectionsRenderer({
		polylineOptions: { strokeColor: '#65a30d', strokeWeight: 5 },
		suppressMarkers: true,
	});

	if (taxis.length > 0) {
		const directionsService = new google.maps.DirectionsService();
		let tempObj = { 1: null, 2: null };
		let tempETA = { 1: null, 2: null };

		for (let i = 0; i < 2; i++) {
			directionsService.route(
				{
					origin: taxis[i].getPosition(),
					destination: destination,
					travelMode: google.maps.TravelMode.DRIVING,
				},
				function (result, status) {
					if (status == 'OK') {
						taxiRouteDisplay.setMap(map);
						tempObj[i + 1] = result;
						tempETA[i + 1] = result.routes[0].legs[0].duration.value;
						setRoutes(tempObj);
						setTaxiETA(tempETA);
						_callback(tempETA);
					} else {
						console.log('Error: Taxi directions API failed');
					}
				}
			);
		}
	} else {
		console.log('Error: Taxis not done loading');
	}
}
