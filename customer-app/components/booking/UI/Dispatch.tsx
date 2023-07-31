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
	FaFileAlt,
	FaFlag,
	FaPhone,
	FaRoad,
	FaStar,
	FaThumbsUp,
	FaThumbtack,
	FaUser,
} from 'react-icons/fa'
import { useRecoilState, useRecoilValue } from 'recoil'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import Rating from '../Rating'
import { RouteInformation, TripInformation } from '@/components/Map/TripScreens/Dispatch/tripInformation'

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
				<label className='text-zinc-100 p-4 mb-0 border-b border-zinc-400'>You have arrived</label>
				<RouteInformation />
				<TripInformation />
				<ArrivalController />
			</div>
		</>
	)
}

function ArrivalController() {
	const [, setScreen] = useRecoilState(screenAtom)
	return (
		<div className='flex items-center p-4 px-6 text-sm space-x-3'>
			<button
				className='w-10/12 rounded-md p-2 bg-green-200'
				onClick={() => {}}
			>
				Finish
			</button>
			<button
				className='flex h-10 w-10 items-center justify-center rounded-full bg-green-200 p-2'
				onClick={() => setScreen('receipt')}
			>
				<FaFileAlt />
			</button>
			<button
				className='flex h-10 w-10 items-center justify-center rounded-full bg-green-200 p-2'
				onClick={() => setScreen('review')}
			>
				<FaThumbsUp />
			</button>
		</div>
	)
}
