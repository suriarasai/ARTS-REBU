import Dispatch from '@/components/booking/UI/Dispatch'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { sendBookingToKafka } from '@/server'
import {
	bookingAtom,
	clickedOptionAtom,
	screenAtom,
	userAtom,
} from '@/utils/state'
import { useEffect, useState } from 'react'
import {
	FaAngleDown,
	FaArrowCircleLeft,
	FaArrowLeft,
	FaCreditCard,
} from 'react-icons/fa'
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
			<Header booking={booking} taxiETA={300} />
			<div className='absolute bottom-0 w-screen p-4'>
				<div className='responsive w-full max-w-md rounded-xl bg-white py-1.5 shadow-md'>
					<hr
						className='my-1 ml-auto mr-auto w-40 rounded-full border-2 border-zinc-200'
						onClick={collapseMenu}
					/>
					{!collapse && (
						<>
							<BookingSequence />
						</>
					)}
				</div>
			</div>
		</div>
	)
}

const BookingSequence = () => {
	const [screen, setScreen] = useRecoilState(screenAtom)
	return (
		<>
			{/* Ride selection: Payment */}
			{screen === '' && <RideSelection />}
			{/* Waiting  */}
			{screen === 'dispatched' && <Dispatch />}
			{/* Live trip + Arrival: receipt, rating */}
		</>
	)
}

const RideSelection = () => {
	const booking = useRecoilValue<any>(bookingAtom)
	const [clickedOption, setClickedOption] = useRecoilState(clickedOptionAtom)

	return (
		<div className='p-4'>
			<h3 className='font-bold'>Select an option:</h3>
			<div className='py-4 flex w-full space-x-4 border-b border-zinc-200'>
				<div className='flex w-1/2 flex-col rounded-xl bg-zinc-100 px-4 py-2 shadow-md'>
					<p>Standard</p>
					<p>$9.90</p>
					<p>3 MIN</p>
				</div>
				<div className='flex w-1/2 flex-col rounded-xl bg-zinc-100 px-4 py-2 shadow-md'>
					<p>Comfort</p>
					<p>$12.00</p>
					<p>10 MIN</p>
				</div>
			</div>
			<div className='flex items-center space-x-3 py-4'>
				<FaCreditCard className='text-green-500 mr-3' />
				{booking.paymentMethod}
				<FaAngleDown className='text-zinc-200' />
				<button className='!ml-auto bg-green-500 text-white py-2 px-4 rounded-lg'>Order Now</button>
			</div>
		</div>
	)
}

const Header = ({ booking, taxiETA }) => {
	const [screen, setScreen] = useRecoilState(screenAtom)
	return (
		<div className='transparent-gradient flex w-screen items-center space-x-6 p-8'>
			<div className='flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-xl text-white'>
				<FaArrowLeft onClick={() => sendBookingToKafka('SendingMessage')}/>
			</div>
			<div className=''>
				{/* Upper text with user name */}
				<h2 className='!font-semibold'>
					<a className='text-green-500'>
						{booking.customerName.split(' ').splice(0, 1).join(' ')}
					</a>
					,{screen === 'dispatched' && 'taxi will arrive in'}
				</h2>

				{/* Lower text with information */}
				<p className='!text-2xl !font-semibold'>
					{screen === '' && 'Choose your taxi'}
					{screen === 'dispatched' && Math.round(taxiETA / 60) + ' minutes'}
				</p>
			</div>
		</div>
	)
}

export default Notifications
