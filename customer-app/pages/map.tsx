import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { MARKERS } from '@/constants'
import { Location, User } from '@/types'
import {
	bookingAtom,
	destinationAtom,
	originAtom,
	screenAtom,
	searchTypeAtom,
	taxiETAAtom,
	userAtom,
	userLocationAtom,
	validInputAtom,
} from '@/utils/state'
import { LoadScriptNext } from '@react-google-maps/api'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { mark, placeLocationMarkers } from '@/components/Map/utils/markers'
import { MapInterface } from '@/components/Map/Interface'
import { MapControls } from '@/components/Map/Controls'
import { loadNearbyTaxiStands } from '@/components/Map/utils/markers'
import { LocationInputs } from '@/components/Map/LocationInput'
import { FaCar, FaCarAlt, FaTimesCircle } from 'react-icons/fa'
import computeFare from '@/utils/computeFare'
import { produceKafkaBookingEvent } from '@/server'

export const markers = {
	origin: null,
	dest: null,
	user: null,
	home: null,
	work: null,
	saved: [],
	stands: [],
}

const libraries = ['places', 'geometry']

export default function Map() {
	const [user, setUser] = useRecoilState<User>(userAtom)
	const origin = useRecoilValue<Location>(originAtom)
	const dest = useRecoilValue<Location>(destinationAtom)
	const userLocation = useRecoilValue(userLocationAtom)
	const [map, setMap] = useState<google.maps.Map>(null as google.maps.Map)
	const [isValidInput] = useRecoilState(validInputAtom)
	const searchType = useRecoilValue(searchTypeAtom)

	// Hooks
	const initMap = (newMap) => setMap(newMap)

	// onLoad: Restore user state if it was lost
	useEffect(() => {
		if (!user.customerID) {
			setUser(JSON.parse(localStorage.getItem('user')))
		}
	}, [])

	// Place location markers once user and map are loaded
	useEffect(() => {
		if (user.customerID && userLocation.lat) {
			placeLocationMarkers(user, map)
			loadNearbyTaxiStands(map, userLocation)
		}
	}, [user.customerID, userLocation.lat])

	// Re-place origin marker and nearby taxi stands on change
	useEffect(() => {
		if (!map) return

		// If the user clears their origin location, default to their current location
		if (!origin.lat) {
			loadNearbyTaxiStands(map, userLocation)
			return
		}

		if (markers.origin) {
			markers.origin.setPosition(new google.maps.LatLng(origin.lat, origin.lng))
		} else {
			markers.origin = mark(map, origin, MARKERS.ORIGIN)
		}
		map.panTo(new google.maps.LatLng(origin.lat, origin.lng))
		loadNearbyTaxiStands(map, origin)
	}, [origin])

	// Re-place destination marker on change
	useEffect(() => {
		if (!map) return

		if (markers.dest) {
			markers.dest.setPosition(new google.maps.LatLng(dest.lat, dest.lng))
		} else {
			markers.dest = mark(map, dest, MARKERS.DESTINATION)
		}
		map.panTo(new google.maps.LatLng(dest.lat, dest.lng))
	}, [dest])

	return (
		// <LoadScriptNext
		// 	googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
		// 	loadingElement={<LoadingScreen />}
		// 	libraries={libraries as any}
		// >
		// 	<div className='relative h-screen w-screen'>
		// 		<MapInterface setMap={initMap} />
		// 		<MapControls map={map} />
		// 		<Header />

		// 		{isValidInput ? <TripScreens /> : <LocationInputs />}
		// 	</div>
		// </LoadScriptNext>
		<TripScreens />
	)
}

export function Header() {
	// Global State: Screen, User

	return (
		<>
			{/* SideNav */}
			{/* Icon */}
			{/* Subtitle */}
			{/* Title */}
		</>
	)
}

export function TripScreens() {
	// Global State: Screen
	const screen = useRecoilValue(screenAtom)
	return (
		<>
			<CancelTripButton />
			<TaxiSelection />
			<Matching />
			<Dispatch />
			<LiveTrip />
			<Arrival />
		</>
	)
}

function CancelTripButton() {
	const [, setIsValidInput] = useRecoilState(validInputAtom)

	const handleTripCancellation = () => {
		setIsValidInput(false)
	}

	return (
		<button
			className='absolute left-0 top-0 ml-8 rounded-b-2xl bg-white p-3 shadow-md'
			onClick={handleTripCancellation}
		>
			<FaTimesCircle className='text-3xl text-red-600' />
		</button>
	)
}

function TaxiSelection() {
	const user = useRecoilValue(userAtom)
	const origin = useRecoilValue(originAtom)
	const dest = useRecoilValue(destinationAtom)
	const userLocation = useRecoilValue(userLocationAtom)
	const [, setBooking] = useRecoilState(bookingAtom)
	const [taxiETA, setTaxiETA] = useRecoilState(taxiETAAtom)

	const [selectedTaxi, setSelectedTaxi] = useState<string>('regular')
	const [paymentMethod, setPaymentMethod] = useState<string>('Cash')
	let distance
	let eta

	const options = {
		regular: {
			taxiType: 'regular',
			taxiPassengerCapacity: 4,
			fare: computeFare(
				'regular',
				dest.postcode.toString(),
				distance,
				+new Date()
			),
			taxiETA: Math.round(taxiETA.regular / 60),
			icon: <FaCarAlt />,
			desc: 'Find the closest car',
		},
		plus: {
			taxiType: 'plus',
			taxiPassengerCapacity: 7,
			fare: computeFare(
				'plus',
				dest.postcode.toString(),
				distance,
				+new Date()
			),
			taxiETA: Math.round(taxiETA.plus / 60),
			icon: <FaCar />,
			desc: 'Better cars',
		},
	}

	// onLoad: Compute and render nearby taxis
	// onLoad: Compute and render routes
	// onLoad: Hide/show the appropriate markers
	// set origin to userlocation if blank
	useEffect(() => {}, [])

	// onSubmit: Create and send the bookingEvent
	const onTripConfirmation = () => {
		const bookingEvent = {
			// bookingID: bookingID,
			customerID: user.customerID,
			messageSubmittedTime: +new Date(),
			customerName: user.customerName,
			phoneNumber: user.phoneNumber,
			taxiType: options[selectedTaxi].taxiType,
			fareType: 'metered',
			fare: options[selectedTaxi].fare,
			distance: distance,
			paymentMethod: paymentMethod,
			eta: eta,
			pickUpLocation: origin.address ? origin : userLocation,
			dropLocation: dest,
			status: 'requested',
			pickUpTime: null,
			dropTime: null,
		}
		setBooking(bookingEvent)
		produceKafkaBookingEvent(JSON.stringify(bookingEvent))
	}

	return (
		<>
			{/* Choices */}
			{/* ConfirmSelection */}
			{/* Payment Method */}
		</>
	)
}

function Matching() {
	// Onload: Listener for dispatch event, save dispatch event (previous comp mustn't use)

	return (
		<>
			{/* Waiting Visual */}
			{/* Cancel */}
		</>
	)
}

function Dispatch() {
	// Onload: Listener for locator event, simulated movement, ETA countdown

	return (
		<>
			{/* ETA */}
			{/* Driver Information */}
			{/* Trip Information */}
			{/* Cancel */}
			{/* Proximity Notifications */}
		</>
	)
}

function LiveTrip() {
	return (
		<>
			{/* ETA */}
			{/* Driver Information */}
			{/* Trip Information */}
			{/* Rate */}
		</>
	)
}

function Arrival() {
	return (
		<>
			{/* Rate */}
			{/* Receipt */}
			{/* Return */}
		</>
	)
}
