import Page from '@/components/ui/page'
import Section from '@/components/ui/section'
import { Title } from '@/redux/types/constants'
// import { bookingRequestListener, createMatchingRequest } from '@/server'
import { useContext, useEffect, useState } from 'react'
import { db } from '@/utils/firebase'

const data = {
	customerID: 12,
	customerName: 'Mr. Me',
	phoneNumber: 85316475,
	pickUpLocation: 'NUS High Boarding School of Maths and Science',
	pickUpTime: '9:48 AM',
	dropLocation: '25 Heng Keng Mui Terrace',
	taxiType: 'Rebu Plus',
	fareType: 'metered',
	fare: 1,
}

import { UserContext } from '@/context/UserContext'
import {
	collection,
	doc,
	getDocs,
	onSnapshot,
	query,
	where,
} from 'firebase/firestore'

// TODO: Issue with FS - workaround or Kafka...
export default function Notifications() {
	// const [notification, setNotification] = useState('')
	const [bookings, setBookings] = useState([])
	const { user } = useContext(UserContext)

	const q = query(collection(db, 'BookingEvent'), where('customerID', '==', 1))

	function getBookingRequests() {
		const bookingRequestRef = collection(db, 'BookingEvent')
		getDocs(bookingRequestRef)
			.then((response) => {
				const requests = response.docs.map((doc) => ({
					data: doc.data(),
					id: doc.id,
				}))
				setBookings(requests)
			})
			.catch((error) => console.log(error.message))
	}

	useEffect(() => {
		if (user.customerName) {
			getBookingRequests()
		} else {
			console.log('Error: User is not signed in')
		}
	}, [])

	return (
		<Page title={Title.NOTIFICATIONS}>
			<Section>
				{bookings.map((item) => (
					<li key={item.id}>{item.data.customerID}</li>
				))}
			</Section>
		</Page>
	)
}
