import Dispatch from '@/components/booking/UI/Dispatch'
import { bookingAtom, screenAtom, userAtom } from '@/utils/state'
import { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

const bookingStub = {
	tmdtid: 1,
	taxiNumber: 1,
	taxiMakeModel: 'Honda Civic',
	taxiColor: 'Grey',
	driverID: 1,
	driverName: 'Your Friendly Driver',
	driverPhoneNumber: 11111111,
	rating: 4.85,
	sno: 1,
	bookingID: 1,
	customerID: 1,
	messageSubmittedTime: 100000000,
	customerName: 1,
	phoneNumber: 22222222,
	taxiType: 'Regular',
	fareType: 'metered',
	fare: 10.28,
	distance: 6400,
	paymentMethod: 'Cash',
	eta: 440,
	status: 'dispatched',
	pickUpLocation: {
		placeName: 'NUS-ISS',
		postcode: 123456,
		address: '25 Heng Keng Mui Dr.',
	},
	dropLocation: {
		placeName: 'NUS High School of Mathematics and Science',
		postcode: 128406,
		address: '40 Clementi 1 Rd.',
	},
}

const Notifications = () => {
	const [screen, setScreen] = useRecoilState(screenAtom)
	const [booking, setBooking] = useRecoilState(bookingAtom)
	const [user, setUser] = useRecoilState(bookingAtom)

	useEffect(() => {
		setBooking(bookingStub)
		if (!user) {
			setUser(JSON.parse(localStorage.getItem('user')))
		}
	}, [])

	return (
		<div className='absolute bottom-0 w-screen p-4'>
			<div className='responsive w-full max-w-md rounded-xl bg-white shadow-md'>
				<Dispatch taxiETA={5} />
			</div>
		</div>
	)
}

export default Notifications
