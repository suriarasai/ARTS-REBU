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
import { doc, onSnapshot } from 'firebase/firestore'
import { createBookingRequest, setBookingCancelled, setBookingCompleted, setBookingDispatched } from '@/utils/taxiBookingSystem'

export default function TaxiBookingSystem() {
	const { user } = useContext(UserContext)
	const [bookings, setBookings] = useState(null)
	const [stopStream, setStopStream] = useState(false)

	useEffect(() => {
		if (stopStream) {
			return
		}

		const unsubscribe = onSnapshot(
			doc(db, 'BookingEvent', user.customerID.toString()),
			(snapshot) => {
				if (snapshot.data().status === 'dispatched') {
					console.log('Matched')
				}
				console.log(snapshot.data())
			}
		)

		return () => {
			unsubscribe()
		}
	}, [stopStream])

	return (
		<Page title={Title.NOTIFICATIONS}>
			<Section>
				{bookings && bookings.customerID + ' ' + bookings.status}
				<button onClick={() => createBookingRequest(user.customerID)}>
					Create Booking
				</button>
				<button onClick={() => setBookingDispatched(user.customerID)}>
					Set Dispatched
				</button>
				<button onClick={() => setBookingCancelled(user.customerID)}>
					Set Cancelled
				</button>
				<button onClick={() => setBookingCompleted(user.customerID)}>
					Set Completed
				</button>
				<button onClick={() => setStopStream(true)}>Stop Listening</button>
			</Section>
		</Page>
	)
}
