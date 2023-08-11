import { markers } from "@/pages/map"
import { User, bookingEvent } from "@/types"

export const mockDispatchEvent = (user: User, booking: bookingEvent) => {
	return {
		customerID: user.customerID,
		customerName: user.customerName,
		customerPhoneNumber: user.phoneNumber,
		pickUpLocation: booking.pickUpLocation,
		dropLocation: booking.dropLocation,
		status: booking.status,
		tmdtid: 0,
		taxiNumber: 'SGN 123456',
		taxiPassengerCapacity: 6,
		taxiMakeModel: 'Honda Civic',
		taxiColor: 'Silver',
		driverID: markers.nearbyTaxis[0].getTitle(),
		driverName: 'Anonymous Driver',
		driverPhoneNumber: 12345678,
		sno: markers.nearbyTaxis[0].getTitle(),
		rating: 5,
	}
}
