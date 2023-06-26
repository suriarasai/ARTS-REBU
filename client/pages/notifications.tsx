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
import { collection, onSnapshot } from 'firebase/firestore'

// TODO: Issue with FS - workaround or Kafka...
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
