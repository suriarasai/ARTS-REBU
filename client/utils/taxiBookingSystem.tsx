import { db } from '@/utils/firebase'
import { deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore'

export function createBookingRequest(data) {
	setBooking(data.customerID.toString(), {
		customerID: data.customerID,
		customerName: data.customerName,
		phoneNumber: data.phoneNumber,
		pickUpLocation: data.pickUpLocation,
		pickUpTime: data.pickUpTime,
		dropLocation: data.dropLocation,
		taxiType: data.taxiType,
		fareType: data.fareType,
		fare: data.fare,
		status: 'requested',
		bookingID: data.bookingID,
		sno: data.sno,
		driverID: data.driverID,
	})
}

export function setBookingDispatched(customerID) {
	setBooking(customerID, { status: 'dispatched' })
}

export function setBookingCancelled(customerID) {
	setBooking(customerID, { status: 'cancelled' })
}

export function setBookingCompleted(customerID) {
	setBooking(customerID, { status: 'completed' })
}

// This is supposed to be from the driver application
export function setDispatchData(customerID) {
	setBooking(customerID, {
		tmdtid: 1,
		taxiNumber: "SN 123456",
		taxiType: "Regular",
		taxiPassengerCapacity: 4,
		taxiMakeModel: "Honda Civic",
		taxiColor: "Grey",
		driverID: 1,
		driverName: "Augustine",
		driverPhone: 12345678,
		sno: 1,
		rating: 4.8
	})
}

export async function deleteBooking(customerID) {
	await deleteDoc(doc(db, 'BookingEvent', customerID))
}

function setBooking(customerID, data) {
	setDoc(doc(db, 'BookingEvent', customerID), data, {
		merge: true,
	})
		.then((response) => {
			console.log(response)
		})
		.catch((error) => {
			console.log(error.message)
		})
}
