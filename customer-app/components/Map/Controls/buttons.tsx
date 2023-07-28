import {
	destInputAtom,
	destinationAtom,
	originAtom,
	originInputAtom,
	poiAtom,
	screenAtom,
	tripStatsAtom,
	userLocationAtom,
	validInputAtom,
} from '@/state'
import { FaMapMarkedAlt, FaLocationArrow, FaTimesCircle } from 'react-icons/fa'
import { useRecoilState, useRecoilValue } from 'recoil'
import mapStyles from '../utils/poi'
import { toggleMarkers } from '../utils/markers'
import { Location } from '@/types'
import setMarkerVisibility from '../utils/markers'

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

export function CancelTripButton({ map, polyline = null }) {
	const [, setIsValidInput] = useRecoilState(validInputAtom)
	const [, setOrigin] = useRecoilState<Location>(originAtom)
	const [, setDest] = useRecoilState<Location>(destinationAtom)
	const [, setOriginInput] = useRecoilState(originInputAtom)
	const [, setDestInput] = useRecoilState(destInputAtom)
	const [, setTripStats] = useRecoilState(tripStatsAtom)
	const [, setScreen] = useRecoilState(screenAtom)
	const userLocation = useRecoilValue(userLocationAtom)

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

		setOrigin(clearLocation)
		setDest(clearLocation)
		setScreen('')
		setIsValidInput(false)
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
