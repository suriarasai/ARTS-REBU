import Dispatch from '@/components/booking/UI/Dispatch'
import { useState } from 'react'

const dispatchEvent = {
	tmdtid: 1,
	taxiNumber: 'SN 123456',
	taxiType: 'Regular',
	taxiPassengerCapacity: 4,
	taxiMakeModel: 'Honda Civic',
	taxiColor: 'Grey',
	driverID: 1,
	driverName: 'Friendly Neighborhood Driver',
	driverPhone: 12345678,
	sno: 1,
	rating: 4.8,
}

const bookingEvent = {
	pickUpLocation: {
		placeName: '25 Heng Keng Mui',
	},
	dropLocation: {
		placeName: 'NUS High Boarding School of Mathematics and Science',
	},
	distance: 3578,
	duration: 3500,
	fare: 25.3,
}

const Notifications = () => {
	const [screen, setScreen] = useState('main')
	return (
		<>
			<Dispatch
				dispatchEvent={dispatchEvent}
				bookingEvent={bookingEvent}
				taxiETA={5}
			/>
		</>
	)
}

export default Notifications
