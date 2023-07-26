import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { MARKERS } from '@/constants'
import { Location, User } from '@/types'
import {
	destinationAtom,
	originAtom,
	searchTypeAtom,
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
	}, [dest])

	return (
		<LoadScriptNext
			googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
			loadingElement={<LoadingScreen />}
			libraries={libraries as any}
		>
			<div className='relative h-screen w-screen'>
				<MapInterface setMap={initMap} />
				<MapControls map={map} />
				<Header />

				{isValidInput ? <TripScreens /> : <LocationInputs />}
			</div>
		</LoadScriptNext>
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

	return (
		<>
			<TaxiSelection />
			<Matching />
			<Dispatch />
			<LiveTrip />
			<Arrival />
			{/* Cancel */}
		</>
	)
}

export function TaxiSelection() {
	// Onload: Nearby taxis, Markers, Hide Markers, Route calculations
	// Local State: Selected taxi, Selected payment
	// Function: Produce booking event

	return (
		<>
			{/* Choices */}
			{/* ConfirmSelection */}
			{/* Payment Method */}
			{/* Cancel */}
		</>
	)
}

export function Matching() {
	// Onload: Listener for dispatch event, save dispatch event (previous comp mustn't use)

	return (
		<>
			{/* Waiting Visual */}
			{/* Cancel */}
		</>
	)
}

export function Dispatch() {
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

export function LiveTrip() {
	return (
		<>
			{/* ETA */}
			{/* Driver Information */}
			{/* Trip Information */}
			{/* Rate */}
		</>
	)
}

export function Arrival() {
	return (
		<>
			{/* Rate */}
			{/* Receipt */}
			{/* Return */}
		</>
	)
}
