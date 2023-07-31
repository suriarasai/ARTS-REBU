import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { MARKERS, NOTIF } from '@/constants'
import { Location, User } from '@/types'
import {
	arrivalAtom,
	bookingAtom,
	destinationAtom,
	dispatchAtom,
	etaCounterAtom,
	notificationAtom,
	originAtom,
	screenAtom,
	searchTypeAtom,
	statusAtom,
	taxiETAAtom,
	taxiLocationAtom,
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
import {
	completeBooking,
	getDirections,
	produceKafkaChatEvent,
	taxiArrived,
} from '@/server'
import setMarkerVisibility from '@/components/Map/utils/markers'
import { renderDirections } from '@/components/Map/utils/viewport'
import { CancelTripButton } from '@/components/Map/Controls/buttons'
import { rescaleMap } from '@/components/Map/utils/viewport'
import { RouteDetails } from '@/components/Map/TripScreens/Selection/routeDetails'
import { setOriginToUserLocation } from '@/components/Map/utils/calculations'
import { toggleMarkers } from '@/components/Map/utils/markers'
import { TripScreens } from '@/components/Map/TripScreens'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { Popup } from '@/components/ui/Popup'
import Rating from '@/components/booking/Rating'
import {
	DriverInformation,
	RouteInformation,
	TripInformation,
} from '@/components/Map/TripScreens/Dispatch/tripInformation'
import { RateTrip } from '@/components/Map/TripScreens/Dispatch/tripInformation'
import { FaFileAlt, FaThumbsUp } from 'react-icons/fa'
import Receipt from '@/components/Map/TripScreens/Arrival/Receipt'

export const markers = {
	origin: null,
	dest: null,
	user: null,
	home: null,
	taxi: null,
	work: null,
	saved: [],
	stands: [],
}

const libraries = ['places', 'geometry']
let taxiRoute = null

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
	var a = Math
	var r = ((lat2 - lat1) * a.PI) / 180
	var c = ((lon2 - lon1) * a.PI) / 180

	var e =
		a.sin(r / 2) * a.sin(r / 2) +
		a.cos((lat1 * a.PI) / 180) *
			a.cos((lat2 * a.PI) / 180) *
			a.sin(c / 2) *
			a.sin(c / 2)

	return 2 * a.atan2(a.sqrt(e), a.sqrt(1 - e)) * 6371
}

export function Trip({ map }) {
	const origin = useRecoilValue(originAtom)
	const userLocation = useRecoilValue(userLocationAtom)
	const dest = useRecoilValue(destinationAtom)
	const [polyline, setPolyline] = useState()
	const [, setTripStats] = useRecoilState(tripStatsAtom)
	const [, setSearchType] = useRecoilState(searchTypeAtom)
	const booking = useRecoilValue(bookingAtom)
	const arrived = useRecoilValue(arrivalAtom)

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
		setSearchType(0)
	}, [])

	// Global State: Screen
	// 'select' | 'match' | 'dispatch' | 'arrival' | ''
	const [screen, setScreen] = useRecoilState<string>(screenAtom)
	const [collapse, setCollapse] = useState(false)

	const handleCollapse = () => setCollapse(!collapse)

	return (
		<>
			{!['receipt', 'arrival'].includes(screen) && (
				<CancelTripButton map={map} polyline={polyline} />
			)}
			{screen === 'select' && <RouteDetails />}
			<ProximityNotifications />
			{screen === 'dispatch' && !arrived && <ETA type={booking.taxiType} />}
			{screen === 'receipt' && (
				<Receipt
					bookingID={booking.bookingID}
					setScreen={() => setScreen('arrival')}
				/>
			)}

			<div className='w-screen-md-max absolute bottom-0 left-0 right-0 ml-auto mr-auto w-5/6 rounded-t-lg bg-gray-700 shadow-sm'>
				<hr
					className='my-1.5 ml-auto mr-auto w-40 rounded-full border-2 border-zinc-400'
					onClick={handleCollapse}
				/>
				<div className={collapse ? 'hidden' : ''}>
					<TripScreens map={map} polyline={polyline} />
				</div>
			</div>
		</>
	)
}

export function Dispatch({ map }) {
	// Onload: Listener for locator event, simulated movement, ETA countdown
	const [, setScreen] = useRecoilState(screenAtom)
	const [location, setLocation] = useRecoilState(taxiLocationAtom)

	const [taxiETA, setTaxiETA] = useRecoilState(taxiETAAtom)
	const [tripETA, setTripETA] = useState()
	const [status, setStatus] = useRecoilState(statusAtom)
	const [arrived, setArrived] = useRecoilState(arrivalAtom)
	const [showRatingForm, setShowRatingForm] = useState(false)
	const origin = useRecoilValue(originAtom)
	const userLocation = useRecoilValue(userLocationAtom)
	const [, setNotification] = useRecoilState(notificationAtom)
	const dispatch = useRecoilValue(dispatchAtom)
	const booking = useRecoilValue(bookingAtom)
	const [counter, setCounter] = useState(0)
	const [etaCounter, setETACounter] = useRecoilState(etaCounterAtom)
	const setETA = (newETA) =>
		setTaxiETA({ ...taxiETA, [booking.taxiType]: newETA })

	useEffect(() => {
		setStatus('dispatched')
		const userPos = origin.address ? origin : userLocation
		const socket = new SockJS('http://localhost:8080/ws')
		const client = Stomp.over(socket)
		let pos // taxi position
		let res // response from the chat websocket

		client.connect({}, () => {
			client.subscribe('/topic/taxiLocatorEvent', (message) => {
				pos = JSON.parse(message.body).currentPosition
				!arrived && setCounter((counter) => counter + 1)
				if (markers.taxi) {
					markers.taxi.setPosition(new google.maps.LatLng(pos.lat, pos.lng))
				} else {
					markers.taxi = mark(map, pos, MARKERS.TAXI, false)
					drawTaxiRoute(map, pos, userPos, (eta) => {
						setETA(eta)
						setETACounter(eta)
					})
				}
			})
			client.subscribe(
				'/user/c' + dispatch.customerID + '/queue/chatEvent',
				(message) => {
					res = JSON.parse(message.body)

					if (res.type === 'arrivedToUser') {
						setArrived(true)
						taxiRoute?.setMap(null)
						taxiRoute = null
						taxiArrived(booking.bookingID)
						console.log('Taxi arrived to User')
					} else if (res.type === 'arrivedToDestination') {
						setStatus('completed')
						completeBooking(booking.bookingID)
						console.log('Taxi arrived to Destination')
						setNotification('arrivedToDestination')
						setScreen('arrival')
					}
				}
			)
		})

		return () => {
			client.disconnect(() => console.log('Disconnected from server'))
			taxiRoute?.setMap(null)
			taxiRoute = null
			setNotification('')
		}
	}, [])

	useEffect(() => {
		if (taxiRoute && !arrived) {
			setETACounter(
				Math.round(
					taxiETA[booking.taxiType] *
						(1 - counter / taxiRoute.getPath().getLength())
				)
			)
		}
	}, [counter])

	useEffect(() => {
		if (taxiRoute && !arrived) {
			if (etaCounter === 2) {
				setNotification('arrivingSoon')
			} else if (etaCounter === 0) {
				setNotification('arrivedToUser')
			}
		}
	}, [etaCounter])

	return (
		<>
			{showRatingForm ? (
				<Rating closeModal={() => setShowRatingForm(false)} />
			) : (
				<>
					<DriverInformation />
					{arrived && <RateTrip setShowRatingForm={setShowRatingForm} />}
					<RouteInformation />
					<TripInformation />
				</>
			)}
		</>
	)
}

function drawTaxiRoute(map, origin, dest, setETA) {
	const directionsService = new google.maps.DirectionsService()
	directionsService.route(
		{
			origin: new google.maps.LatLng(origin.lat, origin.lng),
			destination: new google.maps.LatLng(dest.lat, dest.lng),
			travelMode: google.maps.TravelMode.DRIVING,
		},
		function (result, status) {
			if (status == 'OK') {
				taxiRoute = new google.maps.Polyline({
					path: result.routes[0].overview_path,
					strokeColor: '#16a34a',
					strokeOpacity: 1.0,
					strokeWeight: 4.0,
				})
				taxiRoute.setMap(map)
				setETA(Math.round(result.routes[0].legs[0].duration.value / 60))
			}
		}
	)
}

function ETA({ type }) {
	const etaCounter = useRecoilValue(etaCounterAtom)

	return (
		<div className='absolute left-0 right-0 top-0 ml-auto mr-auto flex w-1/2 items-center rounded-b-md bg-gray-700 p-2'>
			<p className='pl-4 text-zinc-100'>Taxi is arriving in </p>
			<div className='!ml-auto h-12 w-12 items-center justify-center rounded-md bg-green-200 p-2 text-center text-gray-700'>
				<b>{etaCounter}</b>
				<p className='-mt-1 text-xs font-normal text-zinc-400'>min</p>
			</div>
		</div>
	)
}

function ProximityNotifications() {
	const notification = useRecoilValue(notificationAtom)

	return (
		<>
			{notification === 'waiting' ? (
				<Popup msg={NOTIF.WAITING} />
			) : notification === 'arrivingSoon' ? (
				<Popup msg={NOTIF.ARRIVINGSOON} />
			) : notification === 'arrivedToUser' ? (
				<Popup msg={NOTIF.ARRIVEDTOUSER} />
			) : notification === 'arrivedToDestination' ? (
				<Popup msg={NOTIF.ARRIVEDTODEST} />
			) : null}
		</>
	)
}

export function Arrival({ map, polyline }) {
	const [showRatingForm, setShowRatingForm] = useState(false)

	return (
		<>
			{showRatingForm ? (
				<Rating closeModal={() => setShowRatingForm(false)} />
			) : (
				<>
					<label className='mb-0 border-b border-zinc-400 p-4 text-zinc-100'>
						You have arrived
					</label>
					<RouteInformation />
					<ArrivalController
						setShowRatingForm={setShowRatingForm}
						map={map}
						polyline={polyline}
					/>
				</>
			)}
		</>
	)
}

function ArrivalController({ setShowRatingForm, map, polyline }) {
	const [, setScreen] = useRecoilState(screenAtom)
	return (
		<div className='flex items-center space-x-3 p-4 px-6 text-sm'>
			<CancelTripButton map={map} completeTrip={true} polyline={polyline} />
			<button
				className='flex h-10 w-10 items-center justify-center rounded-full bg-green-200 p-2'
				onClick={() => setScreen('receipt')}
			>
				<FaFileAlt />
			</button>
			<button
				className='flex h-10 w-10 items-center justify-center rounded-full bg-green-200 p-2'
				onClick={() => setShowRatingForm(true)}
			>
				<FaThumbsUp />
			</button>
		</div>
	)
}
