import { nearbyTaxiMarkers } from '../pages/booking'

export const HideTaxis = () => {
	/* 
	 * Hides the initial taxis that were rendered to show the nearest N taxis
	 * Used by: Booking
	 */
	for (let i = 0; i < nearbyTaxiMarkers.length; i++) {
		nearbyTaxiMarkers[i].setMap(null)
	}
};