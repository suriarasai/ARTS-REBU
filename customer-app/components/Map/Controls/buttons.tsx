import {
	arrivalAtom,
	bookingAtom,
	destInputAtom,
	destinationAtom,
	dispatchAtom,
	etaCounterAtom,
	originAtom,
	originInputAtom,
	poiAtom,
	screenAtom,
	tripStatsAtom,
	userLocationAtom,
	validInputAtom,
} from '@/state'
import {
	FaLocationArrow,
	FaTimesCircle,
	FaRegArrowAltCircleLeft,
	FaMapMarkedAlt,
} from 'react-icons/fa'
import { useRecoilState, useRecoilValue } from 'recoil'
import { toggleMarkers } from '../utils/markers'
import { DispatchEvent, Location, bookingEvent } from '@/types'
import { setMarkerVisibility } from '../utils/markers'
import { cancelBooking, produceKafkaChatEvent } from '@/server'
import { useRouter } from 'next/router'
import mapStyles from '../utils/poi'
import { markers } from '@/pages/map'

export function TogglePOI({ map }) {
	const [poi, setPoi] = useRecoilState<boolean>(poiAtom)

	const handleClick = () => {
		mapStyles(map, !poi)
		setPoi(!poi)
	}

	return (
		<div className='map-control-button' onClick={handleClick}>
			<FaMapMarkedAlt className='text-xl text-gray-700' />
		</div>
	)
}

export function PanToCurrentLocation({ map }) {
	const handleClick = () => {
		navigator.geolocation.getCurrentPosition((position) => {
			map.panTo({
				lat: position.coords.latitude,
				lng: position.coords.longitude,
			})
			map.setZoom(18)
		})
	}

	return (
		<div className='map-control-button' onClick={handleClick}>
			<FaLocationArrow className='text-xl text-gray-700' />
		</div>
	)
}

export function CancelTripButton({
	map,
	completeTrip = false,
	polyline = null,
}) {
	const [, setIsValidInput] = useRecoilState(validInputAtom)
	const [, setOrigin] = useRecoilState<Location>(originAtom)
	const [, setDest] = useRecoilState<Location>(destinationAtom)
	const [, setOriginInput] = useRecoilState(originInputAtom)
	const [, setDestInput] = useRecoilState(destInputAtom)
	const [, setTripStats] = useRecoilState(tripStatsAtom)
	const [screen, setScreen] = useRecoilState(screenAtom)
	const [, setETA] = useRecoilState(etaCounterAtom)
	const [, setArrived] = useRecoilState(arrivalAtom)
	const userLocation = useRecoilValue(userLocationAtom)
	const [dispatch, setDispatch] = useRecoilState(dispatchAtom)
	const [booking, setBooking] = useRecoilState(bookingAtom)

	const handleTripCancellation = () => {
		toggleMarkers(map)
		polyline && setMarkerVisibility(polyline)

		const clearLocation: Location = {
			placeID: null,
			lat: null,
			lng: null,
			address: null,
			placeName: null,
		}

		if (dispatch.driverID) {
			setDispatch({} as DispatchEvent)
			setBooking({} as bookingEvent)
			if (!(screen === 'arrival')) {
				cancelBooking(booking.bookingID)
				produceKafkaChatEvent(
					JSON.stringify({
						recipientID: 'd' + dispatch.driverID,
						type: 'cancelTrip',
					})
				)
			}
		}

		setOrigin(clearLocation)
		setDest(clearLocation)
		setScreen('')
		setIsValidInput(false)
		setOriginInput('')
		setDestInput('')
		setETA('-')
		setArrived(false)
		setMarkerVisibility(markers.nearbyTaxis)
		setTripStats({ distance: null, duration: null })
		map.panTo(new google.maps.LatLng(userLocation.lat, userLocation.lng))
	}

	return (
		<>
			{completeTrip ? (
				<button
					className='w-10/12 rounded-md bg-green-200 p-2'
					onClick={handleTripCancellation}
				>
					Finish
				</button>
			) : (
				<button
					className='absolute left-0 top-0 ml-8 rounded-b-2xl bg-gray-700 p-3 shadow-md'
					onClick={handleTripCancellation}
				>
					<FaTimesCircle className='text-3xl text-red-400' />
				</button>
			)}
		</>
	)
}
export const BackButton = ({
	searchType,
	setSearchType,
}: {
	searchType: number
	setSearchType: React.Dispatch<React.SetStateAction<number>>
}) => {
	const router = useRouter()
	return (
		<button
			className='p-2 text-2xl font-medium text-green-600'
			onClick={() =>
				searchType !== 0 ? setSearchType(0) : router.push('/home')
			}
		>
			<FaRegArrowAltCircleLeft />
		</button>
	)
}
