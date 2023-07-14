import Dispatch from '@/components/booking/UI/Dispatch'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { bookingAtom, screenAtom, userAtom } from '@/utils/state'
import { useEffect, useState } from 'react'
import { FaArrowCircleLeft, FaArrowLeft } from 'react-icons/fa'
import { useRecoilState, useRecoilValue } from 'recoil'

const bookingStub = {
	tmdtid: 1,
	taxiNumber: 'SGA 123456',
	taxiMakeModel: 'Honda Civic',
	taxiColor: 'Grey',
	driverID: 1,
	driverName: 'Uten Te',
	driverPhoneNumber: 11111111,
	rating: 4.85,
	sno: 1,
	bookingID: 1,
	customerID: 1,
	messageSubmittedTime: 100000000,
	customerName: 'Ephei Tea',
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
	const [booking, setBooking] = useRecoilState<any>(bookingAtom)
	const [user, setUser] = useRecoilState(bookingAtom)
	const [collapse, setCollapse] = useState(false)
	const collapseMenu = () => setCollapse(!collapse)

	useEffect(() => {
		setBooking(bookingStub)
		if (!user) {
			setUser(JSON.parse(localStorage.getItem('user')))
		}
	}, [])

	if (!booking.pickUpLocation || !user) {
		return <LoadingScreen />
	}

	return (
		<div className='h-screen w-screen bg-stone-400'>
			<div className='transparent-gradient flex w-screen items-center space-x-6 p-8'>
				<div className='flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-xl text-white'>
					<FaArrowLeft />
				</div>
				<div className=''>
					<h2 className='!font-semibold'>
						<a className='text-green-500'>
							{booking.customerName.split(' ').splice(0, 1).join(' ')}
						</a>
						, taxi will arrive in
					</h2>
					<p className='!text-2xl !font-semibold'>5 minutes</p>
				</div>
			</div>
			<div className='absolute bottom-0 w-screen p-4'>
				<div className='responsive w-full max-w-md rounded-xl bg-white py-1.5 shadow-md'>
					<hr
						className='ml-auto mr-auto w-40 rounded-full border-2 border-zinc-200'
						onClick={collapseMenu}
					/>
					{!collapse && (
						<>
							<Dispatch taxiETA={5} />
						</>
					)}
				</div>
			</div>
		</div>
	)
}

export default Notifications
