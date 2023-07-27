import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { MARKERS } from '@/constants'
import { Location, User } from '@/types'
import {
	bookingAtom,
	destInputAtom,
	destinationAtom,
	originAtom,
	originInputAtom,
	screenAtom,
	searchTypeAtom,
	selectedCardAtom,
	taxiETAAtom,
	tripStatsAtom,
	userAtom,
	userLocationAtom,
	validInputAtom,
} from '@/utils/state'
import { GoogleMap, LoadScriptNext } from '@react-google-maps/api'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { mark, placeLocationMarkers } from '@/components/Map/utils/markers'
import { MapInterface } from '@/components/Map/Interface'
import { MapControls } from '@/components/Map/Controls'
import { loadNearbyTaxiStands } from '@/components/Map/utils/markers'
import { LocationInputs } from '@/components/Map/LocationInput'
import {
	FaAngleDown,
	FaCar,
	FaCarAlt,
	FaCreditCard,
	FaDollarSign,
	FaMoneyBill,
	FaTimesCircle,
} from 'react-icons/fa'
import computeFare from '@/utils/computeFare'
import {
	GetPaymentMethod,
	getDirections,
	produceKafkaBookingEvent,
} from '@/server'
import SelectPaymentMethod from '@/components/payment/SelectPaymentMethod'
import Image from 'next/image'
import setMarkerVisibility from '@/utils/setMarkerVisibility'
import { renderDirections } from '@/utils/renderDirections'

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
				{/* <Header /> */}

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

function toggleMarkers(map = null) {
	setMarkerVisibility(markers.stands, map)
	setMarkerVisibility(markers.saved, map)
	markers.home?.setMap(map)
	markers.work?.setMap(map)
	markers.user.setMap(map)

	if (map) {
		markers.origin?.setMap(null)
		markers.origin = null
		markers.dest.setMap(null)
		markers.dest = null
	}
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
			<CancelTripButton map={map} polyline={polyline} />
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

function setOriginToUserLocation(map: google.maps.Map, userLocation: Location) {
	if (markers.origin) {
		markers.origin.setPosition(
			new google.maps.LatLng(userLocation.lat, userLocation.lng)
		)
	} else {
		markers.origin = mark(map, userLocation, MARKERS.ORIGIN, true)
	}
}

function RouteDetails() {
	const origin = useRecoilValue(originAtom)
	const destination = useRecoilValue(destinationAtom)
	const userLocation = useRecoilValue(userLocationAtom)

	return (
		<div className='absolute left-0 right-0 top-0 ml-auto mr-auto mt-20 w-5/6 max-w-screen-md space-y-4 rounded-lg bg-gray-700 p-4'>
			<div className='flex items-center rounded-sm bg-gray-600 text-sm text-zinc-100'>
				<label className='my-0 mr-3 w-12 bg-gray-500 p-2 text-zinc-100'>
					From
				</label>
				{origin.address
					? origin.placeName + ', ' + origin.postcode
					: userLocation.placeName + ', ' + userLocation.postcode}
			</div>
			<div className='flex items-center rounded-sm bg-gray-600 text-sm text-zinc-100'>
				<label className='my-0 mr-3 w-12 bg-gray-500 p-2 text-zinc-100'>
					To
				</label>
				{destination.placeName + ', ' + destination.postcode}
			</div>
		</div>
	)
}

function TripScreens() {
	const screen = useRecoilValue(screenAtom)
	return (
		<>
			{screen === 'select' ? (
				<TaxiSelection />
			) : screen === 'match' ? (
				<Matching />
			) : screen === 'dispatch' ? (
				<Dispatch />
			) : screen === 'trip' ? (
				<LiveTrip />
			) : screen === 'arrival' ? (
				<Arrival />
			) : null}
		</>
	)
}

function CancelTripButton({ map, polyline = null }) {
	const [, setIsValidInput] = useRecoilState(validInputAtom)
	const [, setOrigin] = useRecoilState<Location>(originAtom)
	const [, setDest] = useRecoilState<Location>(destinationAtom)
	const [, setOriginInput] = useRecoilState(originInputAtom)
	const [, setDestInput] = useRecoilState(destInputAtom)
	const [, setTripStats] = useRecoilState(tripStatsAtom)
	const userLocation = useRecoilValue(userLocationAtom)

	const handleTripCancellation = () => {
		toggleMarkers(map)

		setIsValidInput(false)
		polyline && setMarkerVisibility(polyline)

		const clearLocation: Location = {
			placeID: null,
			lat: null,
			lng: null,
			address: null,
			placeName: null,
		}
		setOrigin(clearLocation)
		setDest(clearLocation)
		setOriginInput('')
		setDestInput('')
		setTripStats({ distance: null, duration: null })
		map.panTo(new google.maps.LatLng(userLocation.lat, userLocation.lng))
	}

	return (
		<button
			className='absolute left-0 top-0 ml-8 rounded-b-2xl bg-gray-700 p-3 shadow-md'
			onClick={handleTripCancellation}
		>
			<FaTimesCircle className='text-3xl text-red-400' />
		</button>
	)
}

function rescaleMap(map: google.maps.Map, polyline: []) {
	let bounds = new google.maps.LatLngBounds()
	for (let i = 0; i < polyline.length; i++) {
		bounds.extend(polyline[i])
	}
	map.fitBounds(bounds)
	// map.setZoom(16)
}

function TaxiSelection() {
	const user = useRecoilValue<User>(userAtom)
	const origin = useRecoilValue(originAtom)
	const dest = useRecoilValue(destinationAtom)
	const userLocation = useRecoilValue(userLocationAtom)
	const [, setBooking] = useRecoilState(bookingAtom)
	const [taxiETA, setTaxiETA] = useRecoilState(taxiETAAtom)

	const [selectedTaxi, setSelectedTaxi] = useState<string>('regular')
	const [selectedCard, setSelectedCard] = useRecoilState(selectedCardAtom)
	const [selectPaymentMethod, setSelectPaymentMethod] = useState(false)
	const handleShowPaymentMethod = () => setSelectPaymentMethod(true)
	const handleChangeSelection = () =>
		setSelectedTaxi(selectedTaxi === 'regular' ? 'plus' : 'regular')
	const tripStats = useRecoilValue(tripStatsAtom)
	const [options, setOptions] = useState(null)

	useEffect(() => {
		// Finding the default payment method
		GetPaymentMethod(
			user.customerID!,
			(data: any) =>
				data?.length > 0 &&
				data.map((item: any) => {
					item.defaultPaymentMethod && setSelectedCard(item.cardNumber)
				})
		)
	}, [])

	useEffect(() => {
		if (!tripStats.distance) return

		setOptions({
			regular: {
				taxiType: 'regular',
				taxiPassengerCapacity: 4,
				fare: computeFare(
					'regular',
					dest.postcode.toString(),
					tripStats.distance,
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
					tripStats.distance,
					+new Date()
				),
				taxiETA: Math.round(taxiETA.plus / 60),
				icon: <FaCar />,
				desc: 'Better cars',
			},
		})
	}, [tripStats])

	if (!options || !tripStats.distance) {
		return <LoadingScreen />
	}

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
			distance: tripStats.distance,
			paymentMethod: selectedCard,
			eta: tripStats.duration,
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
		<div className='space-y-2 px-4 py-2'>
			{selectPaymentMethod ? (
				<SelectPaymentMethod set={setSelectPaymentMethod} />
			) : (
				<TaxiSelectionUI
					options={options}
					selectedTaxi={selectedTaxi}
					handleChangeSelection={handleChangeSelection}
					handleShowPaymentMethod={handleShowPaymentMethod}
				/>
			)}
		</div>
	)
}

function TaxiSelectionUI({
	options,
	selectedTaxi,
	handleChangeSelection,
	handleShowPaymentMethod,
}) {
	const [, setScreen] = useRecoilState(screenAtom)
	const handleNextScreen = () => setScreen('match')

	return (
		<>
			<label className='!text-zinc-50'>Choose your taxi type</label>
			<div className='flex space-x-2 p-1 text-xs'>
				<RegularTaxi
					options={options.regular}
					handleChangeSelection={handleChangeSelection}
					selectedTaxi={selectedTaxi}
				/>
				<PlusTaxi
					options={options.plus}
					handleChangeSelection={handleChangeSelection}
					selectedTaxi={selectedTaxi}
				/>
			</div>
			<div className='flex w-full items-center space-x-2 p-1 text-xs text-zinc-50'>
				<PaymentOptions handleShowPaymentMethod={handleShowPaymentMethod} />
				<button
					className='!ml-auto w-fit rounded-md bg-green-200 p-1.5 text-gray-700'
					onClick={handleNextScreen}
				>
					Confirm
				</button>
			</div>
		</>
	)
}

function RegularTaxi({ options, handleChangeSelection, selectedTaxi }) {
	return (
		<div
			className={`relative w-1/2 rounded-md bg-gray-600 p-2 text-zinc-50 ${
				selectedTaxi === 'regular' ? 'border-2 border-green-200' : ''
			}`}
			onClick={handleChangeSelection}
		>
			<label className='text-zinc-50'>Regular</label>
			{/* fare, eta, seats */}
			<p>${options.fare}</p>
			<p>{options.taxiETA + ' min'}</p>
			<p>1-{options.taxiPassengerCapacity} ppl</p>
			<Image
				src='https://www.svgrepo.com/show/112781/car-rounded-shape-side-view.svg'
				alt='Regular'
				height='100'
				width='100'
				className='absolute right-0 top-0'
			/>
		</div>
	)
}

function PlusTaxi({ options, handleChangeSelection, selectedTaxi }) {
	return (
		<div
			className={`relative w-1/2 rounded-md bg-gray-600 p-2 text-zinc-50 ${
				selectedTaxi === 'plus' ? 'border-2 border-green-200' : ''
			}`}
			onClick={handleChangeSelection}
		>
			<label className='text-zinc-50'>Plus</label>
			<p>${options.fare}</p>
			<p>{options.taxiETA + ' min'}</p>
			<p>1-{options.taxiPassengerCapacity} ppl</p>
			<Image
				src='https://www.svgrepo.com/show/158793/racing-car-side-view-silhouette.svg'
				alt='Regular'
				height='100'
				width='100'
				className='absolute right-0 top-0'
			/>
		</div>
	)
}

function PaymentOptions({ handleShowPaymentMethod }) {
	const selectedCard = useRecoilValue(selectedCardAtom)

	return (
		<>
			<FaMoneyBill className='mr-2 text-lg text-green-100' />
			{selectedCard !== 'Cash'
				? '**** ' + selectedCard.toString().substring(12)
				: selectedCard}
			<FaAngleDown
				className='text-lg text-green-100'
				onClick={handleShowPaymentMethod}
			/>
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
