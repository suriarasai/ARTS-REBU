import { Popup } from '@/components/ui/Popup'
import { NOTIF } from '@/constants'
import {
	bookingAtom,
	dispatchAtom,
	notificationAtom,
	screenAtom,
	taxiLocationAtom,
	tripStatsAtom,
} from '@/state'
import { bookingEvent } from '@/types'
import { useEffect, useState } from 'react'
import {
	FaComment,
	FaFlag,
	FaPhone,
	FaRoad,
	FaStar,
	FaThumbtack,
	FaUser,
} from 'react-icons/fa'
import { useRecoilState, useRecoilValue } from 'recoil'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import Rating from '../Rating'

export default function Dispatch() {
	// Onload: Listener for locator event, simulated movement, ETA countdown
	const [, setScreen] = useRecoilState(screenAtom)
	const [location, setLocation] = useRecoilState(taxiLocationAtom)

	const [taxiETA, setTaxiETA] = useState()
	const [tripETA, setTripETA] = useState()
	const [arrived, setArrived] = useState(false)
	const [showRatingForm, setShowRatingForm] = useState(false)

	useEffect(() => {
		const socket = new SockJS('http://localhost:8080/ws')
		const client = Stomp.over(socket)

		client.connect({}, () => {
			client.subscribe('/topic/taxiLocatorEvent', (message) => {
				setLocation(JSON.parse(message.body))
			})
		})

		return () => {
			client.disconnect(() => console.log('Disconnected from server'))
		}
	}, [])

	const [, setDispatch] = useRecoilState(dispatchAtom)
	const [booking, setBooking] = useRecoilState(bookingAtom)
	const [, setTripStats] = useRecoilState(tripStatsAtom)

	// TODO: Temp
	useEffect(() => {
		setDispatch({
			driverName: 'Siji Ren',
			taxiColor: 'Grey',
			taxiMakeModel: 'Honda Civic',
			taxiNumber: 'SG 123456',
		} as any)

		setBooking({
			pickUpLocation: { placeName: 'NUS-ISS' },
			dropLocation: { placeName: 'NUS High School of Mathematics and Science' },
			customerName: 'Passengerkun',
			fare: 12.09,
			pickUpTime: +new Date(),
		} as any)

		setTripStats({ duration: 1234, distance: 5420 })
	}, [])

	if (!booking.pickUpLocation) return

	return (
		<>
			{/* <Popup msg='Arriving soon please make your way out ipsum lorem this is a message' />
			<ETA /> */}

			<div className='w-screen-md-max absolute bottom-0 left-0 right-0 ml-auto mr-auto w-5/6 rounded-t-lg bg-gray-700 shadow-sm'>
				<hr className='my-1.5 ml-auto mr-auto w-40 rounded-full border-2 border-zinc-400' />
				<ProximityNotifications />
				{showRatingForm ? (
					<Rating closeModal={() => setShowRatingForm(false)} />
				) : (
					<>
						<DriverInformation />
						<RateTrip setShowRatingForm={setShowRatingForm} />
						<RouteInformation />
						<TripInformation />
					</>
				)}
			</div>
		</>
	)
}

function ETA() {
	return (
		<div className='absolute left-0 right-0 top-0 ml-auto mr-auto flex w-1/2 rounded-b-md items-center bg-gray-700 p-2'>
			<p className='text-zinc-100 pl-4'>Taxi is arriving in </p>
			<div className='!ml-auto h-12 w-12 rounded-md bg-green-200 p-2 items-center justify-center text-center text-gray-700'>
				<b>8</b>
				<p className='text-zinc-400 text-xs -mt-1 font-normal'>min</p>
			</div>
		</div>
	)
}

function RateTrip({ setShowRatingForm }) {
	return (
		<div className='flex items-center border-b border-zinc-400 p-4 px-6 text-sm text-zinc-100'>
			<FaStar className='mr-3 text-green-200' />
			Enjoying your trip?{' '}
			<span
				className='ml-1 text-green-200'
				onClick={() => setShowRatingForm(true)}
			>
				Add a rating
			</span>
		</div>
	)
}

function ProximityNotifications() {
	const notification = useRecoilValue(notificationAtom)

	return (
		<>
			{notification === 'arrivingSoon' ? (
				<Popup msg={NOTIF.ARRIVINGSOON} />
			) : notification === 'arrived' ? (
				<Popup msg={NOTIF.ARRIVED} />
			) : null}
		</>
	)
}

function DriverInformation() {
	const dispatch = useRecoilValue(dispatchAtom)

	return (
		<div className='border-b border-zinc-400'>
			<div className='flex space-x-3 px-6 py-4'>
				<div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-200'>
					<FaUser />
				</div>
				<div className='text-zinc-100'>
					{dispatch.driverName}
					<h5 className='!text-zinc-300'>
						{dispatch.taxiColor} {dispatch.taxiMakeModel}
					</h5>
				</div>
				<div className='!ml-auto flex items-center space-x-3 text-green-200'>
					<div className='mr-3 rounded-md bg-green-200 px-2 py-1 text-gray-700'>
						<p className='!font-semibold'>{dispatch.taxiNumber}</p>
					</div>
					<FaComment />
					<FaPhone />
				</div>
			</div>
		</div>
	)
}

function RouteInformation() {
	const booking = useRecoilValue(bookingAtom)

	return (
		<div className='space-y-3 border-b border-zinc-400 p-4 px-6'>
			<div className='flex items-center text-sm text-zinc-100'>
				<FaThumbtack className='mr-3 text-green-200' />
				{booking.pickUpLocation!.placeName}
			</div>
			<hr className='border-zinc-400' />
			<div className='flex items-center text-sm text-zinc-100'>
				<FaFlag className='mr-3 text-green-200' />
				{booking.dropLocation!.placeName}
			</div>
		</div>
	)
}

function TripInformation() {
	const tripStatistics = useRecoilValue(tripStatsAtom)
	const booking = useRecoilValue<bookingEvent>(bookingAtom)

	return (
		<div className='flex items-center space-x-5 p-4'>
			<FaRoad className='flex-1 text-3xl text-green-200' />
			<div className='flex flex-1 flex-col space-y-2'>
				<h5 className='ml-auto mr-auto !text-zinc-300'>DISTANCE</h5>
				<b className='ml-auto mr-auto text-zinc-100'>
					{(tripStatistics.distance! / 1000).toFixed(1)} km
				</b>
			</div>
			<div className='flex flex-1 flex-col space-y-2'>
				<h5 className='ml-auto mr-auto !text-zinc-300'>ARRIVAL</h5>
				<b className='ml-auto mr-auto text-zinc-100'>
					{new Date(booking.pickUpTime + tripStatistics.duration * 1000)
						.toLocaleTimeString('en-US')
						.replace(/(.*)\D\d+/, '$1')}
				</b>
			</div>
			<div className='flex flex-1 flex-col space-y-2'>
				<h5 className='ml-auto mr-auto !text-zinc-300'>FARE</h5>
				<b className='ml-auto mr-auto text-zinc-100'>${booking.fare}</b>
			</div>
		</div>
	)
}
