import { useEffect } from 'react';
import { useDirectionsService } from '@ubilabs/google-maps-react-hooks';

export const DirectionsService = () => {
	const directionsOptions = {
		renderOnMap: true,
		renderOptions: {
			suppressMarkers: true,
			polylineOptions: { strokeColor: '#FB2576', strokeWeight: 4 },
		},
	};

	// Render the path between 2 points
	const { findAndRenderRoute, directionsRenderer } = useDirectionsService(directionsOptions);

	useEffect(() => {
		if (!findAndRenderRoute) {
			return () => { };
		}

		const request = {
			travelMode: google.maps.TravelMode.DRIVING,
			origin: { lat: 1.292203, lng: 103.7663002 },
			destination: { lat: 1.2979853, lng: 103.7668717 },
			drivingOptions: {
				departureTime: new Date(),
				trafficModel: google.maps.TrafficModel.BEST_GUESS,
			},
		};

		findAndRenderRoute(request)
			.then((result: google.maps.DirectionsResult) => {
				// eslint-disable-next-line no-console
				console.log(result);
			})
			.catch((errorStatus: google.maps.DirectionsStatus) => {
				console.error(errorStatus);
			});

		return () => {
			if (directionsRenderer) {
				directionsRenderer.setMap(null);
			}
		};
	}, [directionsRenderer, findAndRenderRoute]);

	return null;
};
