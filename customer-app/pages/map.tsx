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
import { Autocomplete, LoadScriptNext } from '@react-google-maps/api'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { mark, placeLocationMarkers } from '@/components/Map/utils/markers'
import { MapInterface } from '@/components/Map/Interface'
import { MapControls } from '@/components/Map/Controls'
import { loadNearbyTaxiStands } from '@/components/Map/utils/markers'
import { useRouter } from 'next/router'
import { FaCircle, FaPlusCircle, FaRegArrowAltCircleLeft } from 'react-icons/fa'
import { getAddress } from '@/utils/getAddress'

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
		if (user.customerID && userLocation.placeID) {
			placeLocationMarkers(user, map)
			loadNearbyTaxiStands(map, userLocation)
		}
	}, [user.customerID, userLocation.placeID])

	// Re-place origin marker and nearby taxi stands on change
	useEffect(() => {
		if (!map) return

		// If the user clears their origin location, default to their current location
		if (!origin.placeID) {
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

export function LocationInputs() {
	const [, setIsValidInput] = useRecoilState(validInputAtom)
	const user = useRecoilValue(userAtom)
	const searchType = useRecoilValue(searchTypeAtom)

	return (
		<>
			<SearchMenu />
			{(searchType === 1 || searchType === 2) && <ExpandSearch />}
		</>
	)
}

function SearchMenu() {
	const dest = useRecoilValue(destinationAtom)
	return (
		<div className='absolute left-0 right-0 top-0 z-50 ml-auto mr-auto flex w-full max-w-screen-md flex-wrap rounded-b-3xl bg-white p-2 shadow-md'>
			<div className='w-1/12'>
				<BackButton />
			</div>

			<div className='w-10/12 space-y-2'>
				<OriginInput />
				<hr className='mb-1 ml-auto mr-auto mt-1 bg-zinc-300' />
				<DestinationInput />
			</div>

			<div className='mt-16 flex w-1/12 justify-center text-3xl text-green-600'>
				<FaPlusCircle onClick={() => {}} />
			</div>

			{dest.placeID && <ConfirmInputsButton />}
		</div>
	)
}

function BackButton() {
	const [searchType, setSearchType] = useRecoilState(searchTypeAtom)
	const router = useRouter()

	const handleClick = () => {
		if (searchType !== 0) {
			setSearchType(0)
		} else {
			router.push('/home')
		}
	}

	return (
		<button
			className='p-2 text-2xl font-medium text-green-600'
			onClick={handleClick}
		>
			<FaRegArrowAltCircleLeft />
		</button>
	)
}

function OriginInput() {
	const [autocomplete, setAutocomplete] = useState<any>(null)
	const [, setOrigin] = useRecoilState(originAtom)
	const [, setSearchType] = useRecoilState(searchTypeAtom)
	const [, setIsValidInput] = useRecoilState(validInputAtom)
	return (
		<div className='relative'>
			<Autocomplete
				onLoad={(e) => setAutocomplete(e)}
				onPlaceChanged={() => {
					setSearchType(0)
					setOrigin(getAddress(autocomplete.getPlace()) as any)
				}}
				options={{ componentRestrictions: { country: 'sg' } }}
				fields={['address_components', 'geometry', 'formatted_address']}
			>
				<input
					type='text'
					className='border-none bg-white px-3 py-3 pl-10 leading-tight shadow-none'
					placeholder='Current Location'
					onChange={(e) => {
						setIsValidInput(false)
						if (e.target.value === '') {
							setSearchType(1)
						} else {
							setSearchType(0)
						}
					}}
					onClick={() => setSearchType(1)}
				/>
			</Autocomplete>
			<FaCircle className='absolute -mt-7 ml-3 text-xs text-zinc-500' />
		</div>
	)
}

function DestinationInput() {
	const [autocomplete, setAutocomplete] = useState<any>(null)
	const [, setDest] = useRecoilState(destinationAtom)
	const [, setSearchType] = useRecoilState(searchTypeAtom)
	const [, setIsValidInput] = useRecoilState(validInputAtom)

	return (
		<div className='relative'>
			<Autocomplete
				onLoad={(e) => setAutocomplete(e)}
				onPlaceChanged={() => {
					setSearchType(0)
					setIsValidInput(true)
					setDest(getAddress(autocomplete.getPlace()) as any)
				}}
				options={{ componentRestrictions: { country: 'sg' } }}
				fields={['address_components', 'geometry', 'formatted_address']}
			>
				<input
					type='text'
					className='border-none bg-white px-3 py-3 pl-10 leading-tight shadow-none'
					placeholder='Where to?'
					onChange={(e) => {
						setIsValidInput(false)
						if (e.target.value === '') {
							setSearchType(1)
							setDest({
								placeID: null,
								lat: null,
								lng: null,
								postcode: null,
								address: null,
								placeName: null,
							})
						} else {
							setSearchType(0)
						}
					}}
					onClick={() => setSearchType(2)}
				/>
			</Autocomplete>
			<FaCircle className='absolute -mt-7 ml-3 text-xs text-green-600' />
		</div>
	)
}

function ExpandSearch() {
	return (
		<div className='pt-32 px-4 absolute top-0 left-0 w-full h-full bg-zinc-50'>
			{/* Home */}
			{/* SetLocationOnMap */}
			{/* Work */}
			{/* SavedLocations */}
		</div>
	)
}



function ConfirmInputsButton() {
	return <></>
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
