import Page from '@/components/ui/page'
import Section from '@/components/ui/section'
import { Title } from '@/redux/types/constants'
import { useContext, useEffect, useState } from 'react'
import { db } from '@/utils/firebase'

// const data = {
// 	customerID: 12,
// 	customerName: 'Mr. Me',
// 	phoneNumber: 85316475,
// 	pickUpLocation: 'NUS High Boarding School of Maths and Science',
// 	pickUpTime: '9:48 AM',
// 	dropLocation: '25 Heng Keng Mui Terrace',
// 	taxiType: 'Rebu Plus',
// 	fareType: 'metered',
// 	fare: 1,
// }

import { UserContext } from '@/context/UserContext'
import { addDoc, collection, doc, onSnapshot, setDoc } from 'firebase/firestore'

export default function Notifications() {
	// const [notification, setNotification] = useState('')
	const [bookings, setBookings] = useState([])
	const { user } = useContext(UserContext)

	const bookingRequestRef = collection(db, 'BookingEvent')

	useEffect(() => {
		const unsubscribe = onSnapshot(bookingRequestRef, (snapshot) => {
			setBookings(
				snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
			)
		})

		return () => {
			unsubscribe()
		}
	}, [])

	function createBookingRequest() {
		setBooking({
			customerID: user.customerID,
			customerName: user.customerName,
			phoneNumber: user.phoneNumber,
			pickUpLocation: 'NUS High Boarding School of Maths and Science',
			pickUpTime: '9:48 AM',
			dropLocation: '25 Heng Keng Mui Terrace',
			taxiType: 'Rebu Plus',
			fareType: 'metered',
			fare: 1,
			status: 'requested'
		})
	}

	function setBookingDispatched() {
		setBooking({status: 'dispatched'})
	}

	function setBookingCancelled() {
		setBooking({status: 'cancelled'})
	}

	function setBookingCompleted() {
		setBooking({status: 'completed'})
	}

	function setBooking(data) {
		setDoc(doc(db, 'BookingEvent', user.customerID.toString()), data, {
			merge: true,
		})
			.then((response) => {
				console.log(response)
			})
			.catch((error) => {
				console.log(error.message)
			})
	}

	return (
		<Page title={Title.NOTIFICATIONS}>
			<Section>
				{bookings.map((item) => (
					<li key={item.id}>{item.data.customerID + " Status: " +  item.data.status}</li>
				))}
				<button onClick={createBookingRequest}>Create Booking</button>
				<button onClick={setBookingDispatched}>Set Dispatched</button>
				<button onClick={setBookingCancelled}>Set Cancelled</button>
				<button onClick={setBookingCompleted}>Set Completed</button>
			</Section>
		</Page>
	)
}
