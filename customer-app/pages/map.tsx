import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { MARKERS } from '@/constants'
import { Location, User } from '@/types'
import {
	destinationAtom,
	originAtom,
	screenAtom,
	tripStatsAtom,
	userAtom,
	userLocationAtom,
	validInputAtom,
} from '@/state'
import { LoadScriptNext } from '@react-google-maps/api'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { mark, placeLocationMarkers } from '@/components/Map/utils/markers'
import { MapInterface } from '@/components/Map/Interface'
import { MapControls } from '@/components/Map/Controls'
import { loadNearbyTaxiStands } from '@/components/Map/utils/markers'
import { LocationInputs } from '@/components/Map/LocationInput'
import { getDirections } from '@/server'
import setMarkerVisibility from '@/components/Map/utils/markers'
import { renderDirections } from '@/components/Map/utils/viewport'
import { CancelTripButton } from '@/components/Map/Controls/buttons'
import { rescaleMap } from '@/components/Map/utils/viewport'
import { RouteDetails } from '@/components/Map/TripScreens/Selection/routeDetails'
import { setOriginToUserLocation } from '@/components/Map/utils/calculations'
import { toggleMarkers } from '@/components/Map/utils/markers'
import { TripScreens } from '@/components/Map/TripScreens'

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
		if (!origin.address) {
			markers.origin?.setMap(null)
			markers.origin = null

			setMarkerVisibility(markers.stands)
			loadNearbyTaxiStands(map, userLocation)
			return
		}

		if (markers.origin) {
			markers.origin.setPosition(new google.maps.LatLng(origin.lat, origin.lng))
		} else {
			markers.origin = mark(map, origin, MARKERS.ORIGIN)
		}
		map.panTo(new google.maps.LatLng(origin.lat, origin.lng))
		setMarkerVisibility(markers.stands)
		loadNearbyTaxiStands(map, origin)
	}, [origin])

	// Re-place destination marker on change
	useEffect(() => {
		if (!map) return

		if (!dest.address) {
			markers.dest?.setMap(null)
			markers.dest = null
			return
		}

		if (markers.dest) {
			markers.dest.setPosition(new google.maps.LatLng(dest.lat, dest.lng))
		} else {
			markers.dest = mark(map, dest, MARKERS.DESTINATION)
		}
		map.panTo(new google.maps.LatLng(dest.lat, dest.lng))
	}, [dest])

	return (
		<LoadScriptNext
			googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
			loadingElement={<LoadingScreen />}
			libraries={libraries as any}
		>
			<div className='relative h-screen w-screen'>
				<MapInterface setMap={initMap} />

				{isValidInput ? (
					<Trip map={map} />
				) : (
					<>
						<LocationInputs />
						<MapControls map={map} />
					</>
				)}
			</div>
		</LoadScriptNext>
	)
}

function distKM(lat1, lon1, lat2, lon2) {
	var a = Math,
		r = ((lat2 - lat1) * a.PI) / 180,
		c = ((lon2 - lon1) * a.PI) / 180,
		e =
			a.sin(r / 2) * a.sin(r / 2) +
			a.cos((lat1 * a.PI) / 180) *
				a.cos((lat2 * a.PI) / 180) *
				a.sin(c / 2) *
				a.sin(c / 2)
	return 2 * a.atan2(a.sqrt(e), a.sqrt(1 - e)) * 6371
}

export function Trip({ map }) {
	const [origin, setOrigin] = useRecoilState(originAtom)
	const userLocation = useRecoilValue(userLocationAtom)
	const [dest, setDest] = useRecoilState(destinationAtom)
	const [polyline, setPolyline] = useState()
	const [, setTripStats] = useRecoilState(tripStatsAtom)

	useEffect(() => {
		// Place the origin marker to the user's location if no origin was input
		!origin.address && setOriginToUserLocation(map, userLocation)

		// onLoad: Send location and request to TBS to locate nearby taxis

		// onLoad: Compute and render routes
		getDirections(origin.address ? origin : userLocation, dest, (res) => {
			setTripStats({
				distance: res.distanceMeters,
				duration: Number(res.duration.match(/\d+/)[0]),
				route: google.maps.geometry.encoding.decodePath(
					res.polyline.encodedPolyline
				),
			})
			rescaleMap(
				map,
				google.maps.geometry.encoding.decodePath(
					res.polyline.encodedPolyline
				) as []
			)
			renderDirections(map, res, setPolyline)
		})

		// onLoad: Hide/show the appropriate markers
		toggleMarkers()

		setScreen('select')
	}, [])

	// Global State: Screen
	// 'select' | 'match' | 'dispatch' | 'trip' | 'arrival' | ''
	const [screen, setScreen] = useRecoilState<string>(screenAtom)
	const [collapse, setCollapse] = useState(false)

	const handleCollapse = () => setCollapse(!collapse)

	return (
		<>
			{!['trip', 'arrival'].includes(screen) && (
				<CancelTripButton map={map} polyline={polyline} />
			)}
			{screen === 'select' && <RouteDetails />}

			<div className='w-screen-md-max absolute bottom-0 left-0 right-0 ml-auto mr-auto w-5/6 rounded-t-lg bg-gray-700 shadow-sm'>
				<hr
					className='my-1.5 ml-auto mr-auto w-40 rounded-full border-2 border-zinc-400'
					onClick={handleCollapse}
				/>

				{!collapse && <TripScreens />}
			</div>
		</>
	)
}

export function Matching() {
	// Onload: Listener for dispatch event, save dispatch event (previous comp mustn't use)
	const [, setScreen] = useRecoilState(screenAtom)
	const nextScreen = () => setScreen('dispatch')

	return (
		<>
			{/* Waiting Visual */}
			{/* Cancel */}
		</>
	)
}

export function Dispatch() {
	// Onload: Listener for locator event, simulated movement, ETA countdown
	const [, setScreen] = useRecoilState(screenAtom)
	const nextScreen = () => setScreen('trip')

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
	const [, setScreen] = useRecoilState(screenAtom)
	const nextScreen = () => setScreen('arrival')

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
