import { nearbyTaxiMarkers } from '../pages/booking';


export const HideTaxis = () => {
	for (var i = 0; i < nearbyTaxiMarkers.length; i++) {
		nearbyTaxiMarkers[i].setMap(null);
	}
};
