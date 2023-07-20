// import SelectPaymentMethod from '@/components/payment/SelectPaymentMethod'
// import { LoadingScreen } from '@/components/ui/LoadingScreen'
// import BottomNav from '@/components/ui/bottom-nav'
// import { getDirections } from '@/server'
// import mapStyles from '@/utils/noPoi'
// import { GoogleMap, LoadScriptNext } from '@react-google-maps/api'
// import { useCallback, useState } from 'react'

// const libraries = ['places', 'geometry']

// const Notifications = () => {
// 	const [map, setMap] = useState(/** @type google.maps.Map */ null)
// 	const [route, setRoute] = useState(null)

// 	const loadMap = useCallback(async function callback(map) {
// 		setMap(map)
// 		mapStyles(map, false)
// 		await getDirections(
// 			map,
// 			{ lat: 1.2929767719001972, lng: 103.85036111494576 },
// 			{ lat: 1.30383257124474, lng: 103.86183489944777 },
// 			setRoute,
// 			setRoute,
// 			(data) => {
// 				null
// 			}
// 		)
// 	}, [])

// 	return (
// 		<>
// 			<div className='absolute left-0 top-0 h-full w-full'>
// 				<LoadScriptNext
// 					googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
// 					loadingElement={<LoadingScreen />}
// 					// @ts-ignore
// 					libraries={libraries}
// 				>
// 					<GoogleMap
// 						center={{ lat: 1.2952078, lng: 103.773675 }}
// 						zoom={15}
// 						mapContainerStyle={{ width: '100%', height: '100%' }}
// 						options={{
// 							zoomControl: false,
// 							streetViewControl: false,
// 							mapTypeControl: false,
// 							fullscreenControl: false,
// 							minZoom: 3,
// 						}}
// 						onLoad={loadMap}
// 					></GoogleMap>
// 				</LoadScriptNext>
// 			</div>
// 			<BottomNav />
// 		</>
// 	)
// }

// export default Notifications


// const Notifications2 = () => {
// 	const [selectedCard, setSelectedCard] = useState('Cash')
// 	return (
// 		<div className='relative h-screen w-screen'>
// 			<div className='responsive w-full lg:w-1/2'>
// 				<div className='absolute bottom-0 z-50 w-screen rounded-lg border bg-white lg:w-6/12'>
// 					<div className='accordion-header flex flex-wrap pl-4 pt-4'>
// 						<label>Text</label>
// 					</div>
// 					<div className='accordion-content pb-4 pl-4 pr-4'>
// 						<SelectPaymentMethod
// 							set={() => {}}
// 							selectedCard={selectedCard}
// 							setSelectedCard={setSelectedCard}
// 						/>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	)
// }

// import Dispatch from '@/components/booking/UI/Dispatch'
// import { LoadingScreen } from '@/components/ui/LoadingScreen'
// import { produceKafkaBookingEvent } from '@/server'
// import {
// 	bookingAtom,
// 	bookingEvent,
// 	clickedOptionAtom,
// 	screenAtom,
// } from '@/utils/state'
// import { useEffect, useState } from 'react'
// import { FaAngleDown, FaArrowLeft, FaCreditCard } from 'react-icons/fa'
// import { useRecoilState, useRecoilValue } from 'recoil'

// const bookingStub = {
// 	tmdtid: 1,
// 	taxiNumber: 'SGA 123456',
// 	taxiMakeModel: 'Honda Civic',
// 	taxiColor: 'Grey',
// 	driverID: 1,
// 	driverName: 'Uten Te',
// 	driverPhoneNumber: 11111111,
// 	rating: 4.85,
// 	sno: 1,
// 	bookingID: 1,
// 	customerID: 1,
// 	messageSubmittedTime: 100000000,
// 	customerName: 'Ephei Tea',
// 	phoneNumber: 22222222,
// 	taxiType: 'Regular',
// 	fareType: 'metered',
// 	fare: 10.28,
// 	distance: 6400,
// 	paymentMethod: 'Cash',
// 	eta: 440,
// 	status: 'dispatched',
// 	pickUpLocation: {
// 		placeName: 'NUS-ISS',
// 		postcode: 123456,
// 		address: '25 Heng Keng Mui Dr.',
// 	},
// 	dropLocation: {
// 		placeName: 'NUS High School of Mathematics and Science',
// 		postcode: 128406,
// 		address: '40 Clementi 1 Rd.',
// 	},
// }

// const Notifications = () => {
// 	const [booking, setBooking] = useRecoilState<any>(bookingAtom)
// 	const [user, setUser] = useRecoilState(bookingAtom)
// 	const [collapse, setCollapse] = useState(false)
// 	const collapseMenu = () => setCollapse(!collapse)

// 	useEffect(() => {
// 		setBooking(bookingStub)
// 		if (!user) {
// 			setUser(JSON.parse(localStorage.getItem('user') as string))
// 		}
// 	}, [])

// 	if (!booking.pickUpLocation || !user) {
// 		return <LoadingScreen />
// 	}

// 	return (
// 		<div className='h-screen w-screen bg-stone-400'>
// 			<Header booking={booking} taxiETA={300} />
// 			<div className='absolute bottom-0 w-screen p-4'>
// 				<div className='responsive w-full max-w-md rounded-xl bg-white py-1.5 shadow-md'>
// 					<hr
// 						className='my-1 ml-auto mr-auto w-40 rounded-full border-2 border-zinc-200'
// 						onClick={collapseMenu}
// 					/>
// 					{!collapse && (
// 						<>
// 							<BookingSequence />
// 						</>
// 					)}
// 				</div>
// 			</div>
// 		</div>
// 	)
// }

// const BookingSequence = () => {
// 	const [screen, setScreen] = useRecoilState(screenAtom)
// 	return (
// 		<>
// 			{/* Ride selection: Payment */}
// 			{screen === '' && <RideSelection />}
// 			{/* Waiting  */}
// 			{screen === 'dispatched' && <Dispatch />}
// 			{/* Live trip + Arrival: receipt, rating */}
// 		</>
// 	)
// }

// const RideSelection = () => {
// 	const booking = useRecoilValue<any>(bookingAtom)
// 	const [clickedOption, setClickedOption] = useRecoilState(clickedOptionAtom)

// 	return (
// 		<div className='p-4'>
// 			<h3 className='font-bold'>Select an option:</h3>
// 			<div className='flex w-full space-x-4 border-b border-zinc-200 py-4'>
// 				<div className='flex w-1/2 flex-col rounded-xl bg-zinc-100 px-4 py-2 shadow-md'>
// 					<p>Standard</p>
// 					<p>$9.90</p>
// 					<p>3 MIN</p>
// 				</div>
// 				<div className='flex w-1/2 flex-col rounded-xl bg-zinc-100 px-4 py-2 shadow-md'>
// 					<p>Comfort</p>
// 					<p>$12.00</p>
// 					<p>10 MIN</p>
// 				</div>
// 			</div>
// 			<div className='flex items-center space-x-3 py-4'>
// 				<FaCreditCard className='mr-3 text-green-500' />
// 				{booking.paymentMethod}
// 				<FaAngleDown className='text-zinc-200' />
// 				<button className='!ml-auto rounded-lg bg-green-500 px-4 py-2 text-white'>
// 					Order Now
// 				</button>
// 			</div>
// 		</div>
// 	)
// }

// const Header = ({
// 	booking,
// 	taxiETA,
// }: {
// 	booking: bookingEvent
// 	taxiETA: number
// }) => {
// 	const [screen, setScreen] = useRecoilState(screenAtom)
// 	return (
// 		<div className='transparent-gradient flex w-screen items-center space-x-6 p-8'>
// 			<div className='flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-xl text-white'>
// 				<FaArrowLeft onClick={() => produceKafkaBookingEvent('SendingMessage')} />
// 			</div>
// 			<div className=''>
// 				{/* Upper text with user name */}
// 				<h2 className='!font-semibold'>
// 					<a className='text-green-500'>
// 						{booking.customerName!.split(' ').splice(0, 1).join(' ')}
// 					</a>
// 					,{screen === 'dispatched' && 'taxi will arrive in'}
// 				</h2>

// 				{/* Lower text with information */}
// 				<p className='!text-2xl !font-semibold'>
// 					{screen === '' && 'Choose your taxi'}
// 					{screen === 'dispatched' && Math.round(taxiETA / 60) + ' minutes'}
// 				</p>
// 			</div>
// 		</div>
// 	)
// }

// export default Notifications
