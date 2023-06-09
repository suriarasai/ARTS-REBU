import { FaCrosshairs, FaFontAwesomeFlag, FaPlusSquare } from 'react-icons/fa'

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

function Booking() {
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
	const [taxiLocation, setTaxiLocation] = useState([])
	// const [originAutocomplete, setOriginAutocomplete] = useState(null)
	// const [destinationAutocomplete, setDestinationAutocomplete] = useState(null)
	const [taxiMarker, setTaxiMarker] = useState(null)

	// Tracks which input box to trigger
	// 0 = None selected, 1 = Origin, 2 = Destination, 3 = Origin (select on map), 4 = Dest (select on map)
	const [expandSearch, setExpandSearch] = useState(0)

	const [origin, setOrigin] = useState('') // Address of the origin location
	const [destination, setDestination] = useState('') // Address of the destination location

	/** @type React.MutableRefObject<HTMLInputElement> */
	const originRef = useRef(null) // Tracks input value of origin box
	/** @type React.MutableRefObject<HTMLInputElement> */
	const destinationRef = useRef(null) // Tracks input value of destination box

	const [marker, setMarker] = useState([])

	const [hideUI, setHideUI] = useState(false)

	useEffect(() => {
		if (marker?.length == 0) {
			const markerFacade = []

			user.favoriteLocations?.map((location) =>
				markerFacade.push({
					lat: location.coordinates[0],
					lng: location.coordinates[1],
				})
			)
			if (user.savedLocations?.work) {
				markerFacade.push({
					lat: user.savedLocations?.work[0],
					lng: user.savedLocations?.work[1],
				})
			}
			if (user.savedLocations?.home) {
				markerFacade.push({
					lat: user.savedLocations?.home[0],
					lng: user.savedLocations?.home[1],
				})
			}
			setMarker(markerFacade)
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// Set origin address after clicking a saved location
	useEffect(() => {
		if (origin !== '' && origin !== null) {
			if (typeof origin === 'object' && originRef.current) {
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

	// useEffect(() => {
	// 	console.log(taxiLocation)
	// 	console.log('taxiLocation' + Date.now())
	// 	console.log(marker)
	// }, [taxiLocation, marker])

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

		// const line = results.routes[0].overview_path

		// console.log(line)

		// for (var i = 0; i < line.length; i++) {
		// 	setTimeout(function (n) {
		// 		// {line[i]} might work
		// 		// taxiMarker.setPosition({lat: line[i].lat(), lng: line[i].lng()})
		// 		console.log(n)
		// 	}, 500 * i)
		// }

		// const currCoords = originAutocomplete?.getPlace().geometry?.location

		// Input is in lngLat form instead of the default latLng
		// loadTaxis([currCoords.lng(), currCoords.lat()], setTaxiLocation)

		isValidInput(true)
		setHideUI(true)
	}

	function clearRoute() {
		setDirectionsResponse(null)
		setDistance('')
		setDuration('')
		setOrigin('')
		setDestination('')
	}

	function setLocationViaClick(e) {
		if (expandSearch === 3) {
			CoordinateToAddress([e.latLng.lat(), e.latLng.lng()], setOrigin)
		} else if (expandSearch === 4) {
			CoordinateToAddress([e.latLng.lat(), e.latLng.lng()], setDestination)
		}
	}

	return (
		<div className='relative h-screen w-screen'>
			{/* Google Maps screen */}
			<div
				className={`absolute left-0 top-0 h-full w-full ${
					[0, 3, 4].includes(expandSearch) ? '' : 'hidden'
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
						minZoom: 3,
						maxZoom: 18,
					}}
					onClick={(e) => setLocationViaClick(e)}
					onLoad={(map) => setMap(map)}
				>
					{marker?.length !== 0 &&
						marker?.map((location, index) => (
							<Marker
								key={index}
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

					{/* {taxiLocation?.length !== 0 && ( */}
					{/* <Marker
						key={'taxiLocation'}
						// onLoad={setTaxiMarker}
						// position={{ lat: taxiLocation[1], lng: taxiLocation[0] }}
						position={{ lat: 1.2966058, lng: 103.772875 }}
						icon={{
							path: 'M.5 3.498L7.5.5l7 2.998m-14 0l7 2.998m-7-2.998V3.5m14-.002l-7 2.998m7-2.998V11.5l-7 3m7-11.002L7.5 6.5v8m0-8.004V14.5m0-8.004L.5 3.5m7 11l-7-3v-8',
							fillColor: 'purple',
							fillOpacity: 0.9,
							scale: 1,
							strokeColor: 'purple',
							strokeWeight: 2,
						}}
					/> */}
					{/* )} */}
				</GoogleMap>
			</div>

			{/* Search elements */}
			{!hideUI ? (
				LocationSearch(
					setMarker,
					expandSearch,
					setExpandSearch,
					originRef,
					setOrigin,
					isValidInput,
					destinationRef,
					setDestination
					// setOriginAutocomplete,
					// setDestinationAutocomplete
				)
			) : (
				<button
					className='cancel-button absolute top-0 left-0 z-10 m-5'
					onClick={() => {
						setHideUI(false)
						clearRoute()
						isValidInput(false)
						if (directionsDisplay != null) {
							directionsDisplay.set('directions', null)
							directionsDisplay.setMap(null)
							directionsDisplay = null
						}
					}}
				>
					Cancel
				</button>
			)}

			{[0, 3, 4].includes(expandSearch) ? (
				validInput ? (
					// Confirmation procedure
					<RideConfirmation
						distance={parseFloat(distance.match(/\d+/)[0])}
						origin={originRef.current?.value.split(',')}
						destination={destinationRef.current?.value.split(',')}
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
				<div>
					{/* Expanded search UI with saved locations */}
					<ExpandSearch
						mode={expandSearch}
						setExpandSearch={setExpandSearch}
						location={expandSearch === 1 ? origin : destination}
						setLocation={expandSearch === 1 ? setOrigin : setDestination}
					/>
				</div>
			)}
		</div>
	)
}

export default Booking

function LocationSearch(
	setMarker,
	expandSearch: number,
	setExpandSearch,
	originRef,
	setOrigin,
	isValidInput,
	destinationRef,
	setDestination
	// setOriginAutocomplete,
	// setDestinationAutocomplete
) {
	return (
		<div className='sticky top-0 z-10 flex w-screen flex-wrap bg-white p-2 shadow-md'>
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
					// setOriginAutocomplete
				)}

				{/* Destination Search */}
				{InputDestinationLocation(
					setExpandSearch,
					destinationRef,
					setDestination,
					isValidInput
					// setDestinationAutocomplete
				)}
			</div>
			<div className='justify-bottom flex w-1/12 items-end p-3 pb-2 text-2xl text-green-500'>
				<FaPlusSquare onClick={() => {}} />
			</div>
		</div>
	)
}

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

async function PlaceIDToAddress(id, setLocation) {
	await fetch(
		`https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
	)
		.then(function (response) {
			return response.json()
		})
		.then(function (data) {})
}

function InputDestinationLocation(
	setExpandSearch,
	destinationRef,
	setDestination,
	isValidInput
	// setDestinationAutocomplete
) {
	return (
		<div className='destination'>
			<Autocomplete
				// onLoad={(e) => setDestinationAutocomplete(e)}
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
	// setOriginAutocomplete
) {
	return (
		<div>
			<Autocomplete
				className='origin'
				// onLoad={(e) => setOriginAutocomplete(e)}
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

// Loads the nearest N taxis onto the map
// export const loadTaxis = (coord, setTaxiLocation, N = 1) => {
// 	fetch('https://api.data.gov.sg/v1/transport/taxi-availability')
// 		.then(function (response) {
// 			return response.json()
// 		})
// 		.then(function (data) {
// 			const coordinates: [number, number] =
// 				data.features[0].geometry.coordinates
// 			const distances: [number, number, number][] = []

// 			// Calculating the Euclidean distance
// 			coordinates.forEach(([a, b]: any) =>
// 				distances.push([
// 					Math.pow(a - coord[0], 2) + Math.pow(b - coord[1], 2),
// 					a,
// 					b,
// 				])
// 			)

// 			// Sorting the distances
// 			distances.sort()

// 			// Saving the marker to the state variable
// 			for (let i = 0; i < N; i++) {
// 				setTaxiLocation(distances[i].slice(1, 3))
// 			}
// 		})
// }
