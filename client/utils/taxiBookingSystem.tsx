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
