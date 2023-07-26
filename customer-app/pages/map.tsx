import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { MARKERS } from '@/constants'
import { Location, User } from '@/types'
import {
	bookingAtom,
	bookingEvent,
	destinationAtom,
	originAtom,
	searchTypeAtom,
	userAtom,
	userLocationAtom,
} from '@/utils/state'
import { GoogleMap, LoadScriptNext } from '@react-google-maps/api'
import { useCallback, useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { mark, placeLocationMarkers } from '@/components/Map/utils/markers'
import { CoordinateToAddress } from '@/server'
import mapStyles from '@/utils/noPoi'

export const markers = {
	origin: null,
	dest: null,
	user: null,
	home: null,
	work: null,
	saved: [],
}

const libraries = ['places', 'geometry']

export default function Map() {
	// Global States
	const [booking, setBooking] = useRecoilState<bookingEvent>(bookingAtom)
	const [user, setUser] = useRecoilState<User>(userAtom)
	const [searchType, setSearchType] = useRecoilState<number>(searchTypeAtom)
	const [origin, setOrigin] = useRecoilState<Location>(originAtom)
	const [dest, setDest] = useRecoilState<Location>(destinationAtom)

	// Local States
	const [isValidInput, setIsValidInput] = useState<boolean>(false)
	const [userLocation, setUserLocation] =
		useRecoilState<Location>(userLocationAtom)
	const [poi, setPoi] = useState<boolean>(false)
	const [map, setMap] = useState<google.maps.Map>(null as google.maps.Map)

	// onLoad: Restore user state if it was lost
	useEffect(() => {
		if (!user.customerID) {
			setUser(JSON.parse(localStorage.getItem('user')))
		}
	}, [])

	// Map onLoad: Styling, Pan to curent location, Location marker
	const loadMap = useCallback(function callback(map: google.maps.Map) {
		mapStyles(map, poi)
		setMap(map)

		navigator.geolocation.getCurrentPosition((position) => {
			const coords = {
				lat: position.coords.latitude,
				lng: position.coords.longitude,
			}

			const currentLocation = new google.maps.LatLng(coords)
			map.panTo(currentLocation)
			map.setZoom(18)

			CoordinateToAddress(currentLocation, setUserLocation)
			markers.user = mark(map, coords, MARKERS.USERLOCATION, false)
		})
	}, [])

	// Location Input: Set location by map click
	function handleMapClick(e: google.maps.MapMouseEvent) {
		if (searchType === 3) {
			CoordinateToAddress(e.latLng, setOrigin)
		} else if (searchType === 4) {
			CoordinateToAddress(e.latLng, setDest)
		}
	}

	// Place location markers once user and map are loaded
	useEffect(() => {
		if (user && map) {
			placeLocationMarkers(user, map)
		}
	}, [user, map])

	// Re-place origin marker on change
	useEffect(() => {
		if (!map) return

		if (markers.origin) {
			markers.origin.setPosition(new google.maps.LatLng(origin.lat, origin.lng))
		} else {
			markers.origin = mark(map, origin, MARKERS.ORIGIN)
		}
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
				<GoogleMap
					zoom={15}
					mapContainerStyle={{ width: '100%', height: '100%' }}
					options={{
						zoomControl: false,
						streetViewControl: false,
						mapTypeControl: false,
						fullscreenControl: false,
						minZoom: 3,
					}}
					onClick={(e) => handleMapClick(e)}
					onLoad={loadMap}
				/>
				{/* <Header />
				<LocationInputs />
				<MapControls />
				<TripScreens /> */}
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

export function LocationInputs() {
	return (
		<>
			{/* Origin Search */}
			{/* Destination Search */}
			{/* Saved Locations Search */}
		</>
	)
}

export function MapControls() {
	// Local State: POI, Taxi Stands

	return (
		<>
			{/* POI Toggle */}
			{/* Current Location */}
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
