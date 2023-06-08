import {
	FaCrosshairs,
	FaFontAwesomeFlag,
	FaPlusCircle,
	FaPlusSquare,
	FaTimes,
} from 'react-icons/fa'

import {
	useJsApiLoader,
	GoogleMap,
	Marker,
	Autocomplete,
} from '@react-google-maps/api'
import { useEffect, useRef, useState, useContext } from 'react'
import { UserContext } from '@/components/context/UserContext'
import { BackButton } from '@/components/booking/backButton'
import { Locate } from '@/components/booking/Locate'
import ExpandSearch from '@/components/booking/expandSearch'
import { RideConfirmation } from '@/components/booking/RideConfirmation'

const center = { lat: 1.2952078, lng: 103.773675 }
var directionsDisplay

const libraries = ['places']

function App() {
	const { user, setUser } = useContext(UserContext)
	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
		// @ts-ignore
		libraries: libraries,
	})

	const [map, setMap] = useState(/** @type google.maps.Map */ null)
	const [directionsResponse, setDirectionsResponse] = useState(null)
	const [distance, setDistance] = useState('')
	const [duration, setDuration] = useState('')
	const [validInput, isValidInput] = useState(false)

	const [expandSearch, setExpandSearch] = useState(0)

	const [origin, setOrigin] = useState('')
	const [destination, setDestination] = useState('')

	/** @type React.MutableRefObject<HTMLInputElement> */
	const originRef = useRef(null)
	/** @type React.MutableRefObject<HTMLInputElement> */
	const destinationRef = useRef(null)

	const [marker, setMarker] = useState([])

	useEffect(() => {
		if (marker?.length == 0) {
			const markerFacade = []

			user.favoriteLocations.map((location) =>
				markerFacade.push({
					lat: location.coordinates[0],
					lng: location.coordinates[1],
				})
			)
			if (user.savedLocations.work) {
				markerFacade.push({
					lat: user.savedLocations.work[0],
					lng: user.savedLocations.work[1],
				})
			}
			if (user.savedLocations.home) {
				markerFacade.push({
					lat: user.savedLocations.home[0],
					lng: user.savedLocations.home[1],
				})
			}
			setMarker(markerFacade)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// Set origin address after clicking a saved location
	useEffect(() => {
		if (origin !== '' || null) {
			if (typeof origin === 'object') {
				CoordinateToAddress(origin, setOrigin)
			} else {
				originRef.current.value = origin
			}
			isValidInput(false)
		}
	}, [origin, originRef])

	// Set destination address after clicking a saved location
	useEffect(() => {
		if (destination !== '' || null) {
			if (typeof destination === 'object') {
				CoordinateToAddress(destination, setDestination)
			} else {
				destinationRef.current.value = destination
			}
			isValidInput(false)
		}
	}, [destination, destinationRef])

	if (!isLoaded) {
		return 'loading'
	}

	async function calculateRoute() {
		if (origin === '' || destination === '') {
			isValidInput(false)
			return
		}
		// eslint-disable-next-line no-undef
		const directionsService = new google.maps.DirectionsService()

		if (directionsDisplay != null) {
			directionsDisplay.set('directions', null)
			directionsDisplay.setMap(null)
			directionsDisplay = null
		}

		directionsDisplay = new google.maps.DirectionsRenderer()

		const results = await directionsService.route({
			origin: origin,
			destination: destination,
			// eslint-disable-next-line no-undef
			travelMode: google.maps.TravelMode.DRIVING,
		})
		setDirectionsResponse(results)
		setDistance(results.routes[0].legs[0].distance.text)
		setDuration(results.routes[0].legs[0].duration.text)

		directionsDisplay.setMap(map)
		directionsDisplay.setDirections(results)

		isValidInput(true)
	}

	function clearRoute() {
		setDirectionsResponse(null)
		setDistance('')
		setDuration('')
		setOrigin('')
		setDestination('')
	}

	return (
		<div className='relative h-screen w-screen'>
			{/* Google Maps screen */}
			<div
				className={`absolute left-0 top-0 h-full w-full ${
					expandSearch === 0 ? '' : 'hidden'
				}`}
			>
				<GoogleMap
					center={center}
					zoom={15}
					mapContainerStyle={{ width: '100%', height: '100%' }}
					options={{
						zoomControl: false,
						streetViewControl: false,
						mapTypeControl: false,
						fullscreenControl: false,
					}}
					onLoad={(map) => setMap(map)}
				>
					{marker?.length !== 0 &&
						marker?.map((location, index) => (
							<Marker
								key={index + '-' + location.lat + '-' + location.lng}
								position={location}
								icon={{
									path: 'M8 12l-4.7023 2.4721.898-5.236L.3916 5.5279l5.2574-.764L8 0l2.3511 4.764 5.2574.7639-3.8043 3.7082.898 5.236z',
									fillColor: 'yellow',
									fillOpacity: 0.9,
									scale: 1,
									strokeColor: 'gold',
									strokeWeight: 2,
								}}
							/>
						))}
				</GoogleMap>
			</div>

			{/* Search elements */}
			<div className='absolute z-20 flex w-screen flex-wrap bg-white p-2 shadow-md'>
				<div
					className='w-1/12'
					onClick={() => {
						setMarker(null)
					}}
				>
					<BackButton
						expandSearch={expandSearch}
						setExpandSearch={setExpandSearch}
					/>
				</div>
				<div className='w-10/12'>
					{/* Origin Search */}
					{InputCurrentLocation(
						setExpandSearch,
						originRef,
						setOrigin,
						isValidInput
					)}

					{/* Destination Search */}
					{InputDestinationLocation(
						setExpandSearch,
						destinationRef,
						setDestination,
						isValidInput
					)}
				</div>
				<div className='justify-bottom flex w-1/12 items-end p-3 pb-2 text-2xl text-green-500'>
					<FaPlusSquare onClick={() => {}} />
				</div>
			</div>

			{expandSearch === 0 ? (
				validInput ? (
					// Confirmation procedure
					<RideConfirmation
						distance={parseFloat(distance.match(/\d+/)[0])}
						origin={originRef.current.value.split(',')}
						destination={destinationRef.current.value.split(',')}
					/>
				) : (
					// Prompt to calculate route
					<>
						<div className='absolute bottom-0 z-50 flex w-full justify-center py-5'>
							<button
								className='w-10/12 rounded bg-green-500 py-2 px-4 text-white'
								type='submit'
								onClick={calculateRoute}
							>
								Calculate Route
							</button>
						</div>

						<Locate map={map} />
					</>
				)
			) : (
				<div className='pt-16'>
					{/* Expanded search UI with saved locations */}
					<ExpandSearch
						setExpandSearch={setExpandSearch}
						location={expandSearch === 1 ? origin : destination}
						setLocation={expandSearch === 1 ? setOrigin : setDestination}
					/>
				</div>
			)}

			{/* <div className='justify-space m-4'>
				<p>Distance: {distance} </p>
				<p>Duration: {duration} </p>
			</div> */}
			{/* <div aria-label='center back' onClick={clearRoute}>
					{<FaTimes />}
				</div> */}
		</div>
	)
}

export default App

async function CoordinateToAddress(coordinates, setLocation) {
	await fetch(
		`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates[0]},${coordinates[1]}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
	)
		.then(function (response) {
			return response.json()
		})
		.then(function (data) {
			setLocation(data.results[0].formatted_address)
		})
}

function InputDestinationLocation(
	setExpandSearch,
	destinationRef,
	setDestination,
	isValidInput
) {
	return (
		<div>
			<Autocomplete
				onPlaceChanged={() => setExpandSearch(0)}
				options={{ componentRestrictions: { country: 'sg' } }}
				fields={['address_components', 'geometry', 'formatted_address']}
			>
				<input
					type='text'
					className='rounded-sm border-none bg-zinc-100 py-2 px-3 pl-10 leading-tight shadow-none'
					placeholder='Destination'
					ref={destinationRef}
					// value={destination}
					onChange={(e) => {
						setDestination(e.target.value)
						isValidInput(false)
					}}
					onClick={() => setExpandSearch(2)}
				/>
			</Autocomplete>
			<FaFontAwesomeFlag className='absolute -mt-7 ml-2 text-xl text-green-500' />
		</div>
	)
}

function InputCurrentLocation(
	setExpandSearch,
	originRef,
	setOrigin,
	isValidInput
) {
	return (
		<div>
			<Autocomplete
				onPlaceChanged={() => setExpandSearch(0)}
				options={{ componentRestrictions: { country: 'sg' } }}
				fields={['address_components', 'geometry', 'formatted_address']}
			>
				<input
					type='text'
					className='mb-2 rounded-sm border-none bg-zinc-100 py-2 px-3 pl-10 leading-tight shadow-none'
					placeholder='Origin'
					ref={originRef}
					// value={origin}
					onChange={(e) => {
						setOrigin(e.target.value)
						isValidInput(false)
					}}
					onClick={() => setExpandSearch(1)}
				/>
			</Autocomplete>
			<FaCrosshairs className='absolute -mt-9 ml-2 text-xl text-green-500' />
		</div>
	)
}
