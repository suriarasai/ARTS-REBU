import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api'
import { useEffect, useRef, useState, useContext, useCallback } from 'react'
import { UserContext } from '@/context/UserContext'
import { Locate } from '@/components/booking/Locate'
import ExpandSearch from '@/components/booking/expandSearch'
import { RideConfirmation } from '@/components/booking/RideConfirmation'
import { moveToStep } from '@/utils/moveTaxiMarker'
import { expandArray } from '@/utils/expandArray'
import { togglePOI } from '@/components/booking/togglePoiButton'
import { CoordinateToAddress } from '@/server'
import { LocationSearch } from '../components/booking/LocationSearch'
import { HideTaxis } from '../utils/hideTaxis'
import mapStyles from '@/utils/noPoi'
import { icon } from '@/redux/types/constants'
import { loadTaxis } from '@/server'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import BottomNav from '@/components/ui/bottom-nav'

const center = { lat: 1.2952078, lng: 103.773675 }
let directionsDisplay
let taxiMarker
export let nearbyTaxiMarkers = []

const libraries = ['places']

function Booking() {
	const { user, setUser } = useContext(UserContext)
	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
		// @ts-ignore
		libraries: libraries,
	})

	const [map, setMap] = useState(/** @type google.maps.Map */ null)
	const [, setDirectionsResponse] = useState(null)
	const [distance, setDistance] = useState('')
	const [, setDuration] = useState('')
	const [validInput, isValidInput] = useState(false)
	const [poi, setPoi] = useState(true)

	// Tracks which input box to trigger
	// 0 = None selected, 1 = Origin, 2 = Destination, 3 = Origin (select on map), 4 = Dest (select on map)
	const [expandSearch, setExpandSearch] = useState(0)
	const [userLocation, setUserLocation] = useState<any>([])

	const [origin, setOrigin] = useState({
		placeID: null,
		lat: null,
		lng: null,
		postcode: null,
		address: null,
		placeName: null,
	}) // Coordinates of the origin location
	const [destination, setDestination] = useState({
		placeID: null,
		lat: null,
		lng: null,
		postcode: null,
		address: null,
		placeName: null,
	}) // Coordinates of the origin location

	/** @type React.MutableRefObject<HTMLInputElement> */
	const originRef = useRef(null) // Tracks input value of origin box
	/** @type React.MutableRefObject<HTMLInputElement> */
	const destinationRef = useRef(null) // Tracks input value of destination box

	const [marker, setMarker] = useState([])

	const [hideUI, setHideUI] = useState(false)

	// On map load
	const loadMap = useCallback(function callback(map) {
		mapStyles(map, poi)
		setMap(map)
		loadTaxis(map, [103.773675, 1.2966058], 5)

		// Center to current location
		navigator.geolocation.getCurrentPosition((position) => {
			setUserLocation({
				lat: position.coords.latitude,
				lng: position.coords.longitude,
			})
			map.panTo({
				lat: position.coords.latitude,
				lng: position.coords.longitude,
			})
			map.setZoom(18)
		})

		// Load markers for saved locations
		if (marker?.length == 0) {
			const markerFacade = []

			user.savedLocations?.map((location) =>
				markerFacade.push({
					lat: location.lat,
					lng: location.lng,
				})
			)
			if (user.work) {
				markerFacade.push({
					lat: user.work.lat,
					lng: user.work.lng,
				})
			}
			if (user.home) {
				markerFacade.push({
					lat: user.home.lat,
					lng: user.home.lng,
				})
			}
			setMarker(markerFacade)
		}
	}, [])

	// Set origin address after clicking a saved location
	useEffect(() => {
		if (origin.lat) {
			originRef.current.value = origin.placeName
		}
	}, [origin])

	// Set destination address after clicking a saved location
	useEffect(() => {
		if (destination.lat) {
			isValidInput(true)
			destinationRef.current.value = destination.placeName
		}
	}, [destination])

	// Render a message until the map is finished loading
	if (!isLoaded) {
		return LoadingScreen
	}

	// Retrieve and render the route to the destination
	async function calculateRoute() {
		if (!destination.lat) {
			isValidInput(false)
			return
		}

		// eslint-disable-next-line no-undef
		const directionsService = new google.maps.DirectionsService()

		HideTaxis()
		mapStyles(map, poi)

		// Removing directions polyline if a polyline already exists
		if (directionsDisplay != null) {
			directionsDisplay.set('directions', null)
			directionsDisplay.setMap(null)
			directionsDisplay = null
		}

		// Initializing a new directions polyline
		directionsDisplay = new google.maps.DirectionsRenderer()

		// Setting the coordinates of the directions polyline
		const results = await directionsService.route({
			origin: origin.lat ? origin : userLocation,
			destination: destination,
			// eslint-disable-next-line no-undef
			travelMode: google.maps.TravelMode.DRIVING,
		})
		setDirectionsResponse(results)
		setDistance(results.routes[0].legs[0].distance.text)
		setDuration(results.routes[0].legs[0].duration.text)
		directionsDisplay.setMap(map) // Binding polyline to the map
		directionsDisplay.setDirections(results) // Setting the coords

		const line = results.routes[0].overview_path // Polyline coords

		// const expandedArray = expandArray(line, 100)

		// taxiMarker = new google.maps.Marker({
		// 	map: map,
		// 	position: { lat: 1.2966058, lng: 103.772875 },
		// 	icon: {
		// 		path: 'M6 1a1 1 0 0 0-1 1v1h-.181A2.5 2.5 0 0 0 2.52 4.515l-.792 1.848a.807.807 0 0 1-.38.404c-.5.25-.855.715-.965 1.262L.05 9.708a2.5 2.5 0 0 0-.049.49v.413c0 .814.39 1.543 1 1.997V14.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1.338c1.292.048 2.745.088 4 .088s2.708-.04 4-.088V14.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1.892c.61-.454 1-1.183 1-1.997v-.413c0-.165-.016-.329-.049-.49l-.335-1.68a1.807 1.807 0 0 0-.964-1.261.807.807 0 0 1-.381-.404l-.792-1.848A2.5 2.5 0 0 0 11.181 3H11V2a1 1 0 0 0-1-1H6ZM4.309 4h7.382a.5.5 0 0 1 .447.276l.956 1.913a.51.51 0 0 1-.497.731c-.91-.073-3.35-.17-4.597-.17-1.247 0-3.688.097-4.597.17a.51.51 0 0 1-.497-.731l.956-1.913A.5.5 0 0 1 4.309 4ZM4 10a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm10 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-9 0a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Z',
		// 		fillColor: 'MediumTurquoise',
		// 		fillOpacity: 0.9,
		// 		scale: 2,
		// 		strokeColor: 'MidnightBlue',
		// 		strokeWeight: 0.5,
		// 	},
		// })

		// Locates closest taxi from all available taxis
		// loadTaxis(map, [currCoords.lng(), currCoords.lat()])

		// moveToStep(taxiMarker, expandedArray, 0, 30)

		// UI Updates
		isValidInput(true)
		setHideUI(true)
	}

	function clearRoute() {
		setDirectionsResponse(null)
		setDistance('')
		setDuration('')
		setOrigin({
			placeID: null,
			lat: null,
			lng: null,
			postcode: null,
			address: null,
			placeName: null,
		}) // Coordinates of the origin location
		setDestination({
			placeID: null,
			lat: null,
			lng: null,
			postcode: null,
			address: null,
			placeName: null,
		}) // Coordinates of the origin location
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
						minZoom: 3
					}}
					onClick={(e) => setLocationViaClick(e)}
					onLoad={loadMap}
				>
					{marker?.length !== 0 &&
						marker?.map((location, index) => (
							<Marker
								key={index}
								position={location}
								icon={{
									path: icon.savedLocation,
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
			{!hideUI ? (
				LocationSearch(
					expandSearch,
					setExpandSearch,
					originRef,
					setOrigin,
					isValidInput,
					destinationRef,
					setDestination,
					calculateRoute,
					validInput
				)
			) : (
				<button
					className='cancel-button absolute left-0 top-0 z-10 m-5'
					onClick={() => {
						setHideUI(false)
						clearRoute()
						isValidInput(false)
						mapStyles(map, poi)
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

			{/* If the user is not searching... */}
			{[0, 3, 4].includes(expandSearch) ? (
				// If the input is valid, then begin the booking confirmation procedure
				distance !== '' ? (
					<RideConfirmation
						distance={parseFloat(distance.match(/\d+/)[0])}
						origin={originRef.current?.value.split(',')}
						destination={destinationRef.current?.value.split(',')}
					/>
				) : (
					// If the input is invalid, then continue to show them the map controls
					<>
						<Locate map={map} />
						{togglePOI(map, poi, setPoi)}
						<BottomNav />
					</>
				)
			) : (
				// If the user is searching, then show them the expanded search UI
				<>
					<ExpandSearch
						mode={expandSearch}
						setExpandSearch={setExpandSearch}
						location={expandSearch === 1 ? origin : destination}
						setLocation={expandSearch === 1 ? setOrigin : setDestination}
					/>
				</>
			)}
		</div>
	)
}

export default Booking
