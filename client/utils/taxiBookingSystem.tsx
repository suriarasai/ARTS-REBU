import { bookingEvent } from './state'

// Customer Application:
// Stream 1: Produce booking event with 'requested' status
// Stream 2: Consume dispatch event with 'dispatched' status
// Stream 3: Consume geolocation event
// Optional: Consume/Produce messaging stream

// Driver Application:
// Stream 1: Consume all nearby geofenced booking requests
// Stream 2: Produce a dispatch event
// Stream 3: Produce geolocation events every N seconds
// Optional: Consume/Produce messaging stream

export function createBookingRequest(data: bookingEvent) {
	setBooking(data.customerID!, {
		customerID: data.customerID,
		customerName: data.customerName,
		phoneNumber: data.phoneNumber,
		pickUpLocation: data.pickUpLocation,
		eta: data.eta,
		dropLocation: data.dropLocation,
		taxiType: data.taxiType,
		fareType: data.fareType,
		fare: data.fare,
		status: 'requested',
		bookingID: data.bookingID,
	})
}

// This is supposed to be from the driver application
// Not all driver information needs to be returned; can query for it after getting the driverID
export function setBookingDispatched(customerID: number) {
	setBooking(customerID, {
		status: 'dispatched',
		tmdtid: 1,
		taxiNumber: 'SN 123456',
		taxiPassengerCapacity: 4,
		taxiMakeModel: 'Honda Civic',
		taxiColor: 'Grey',
		driverID: 1,
		driverName: 'Augustine',
		driverPhoneNumber: 12345678,
		sno: 1,
		rating: 4.8,
	})
}

export function setBookingCancelled(customerID: number) {
	setBooking(customerID, { status: 'cancelled' })
}

export function setBookingCompleted(customerID: number) {
	setBooking(customerID, { status: 'completed' })
}

export async function deleteBooking(customerID: number) {
	// await deleteDoc(doc(db, 'BookingEvent', customerID.toString()))
}

function setBooking(customerID: number, data: bookingEvent) {
	// setDoc(doc(db, 'BookingEvent', customerID.toString()), data, {
	// 	merge: true,
	// })
	// 	.then((response) => {
	// 		console.log(response)
	// 	})
	// 	.catch((error) => {
	// 		console.log(error.message)
	// 	})
}
