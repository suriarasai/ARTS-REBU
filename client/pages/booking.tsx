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
import setMarkerVisibility from '@/utils/setMarkerVisibility'
import mapStyles from '@/utils/noPoi'
import { icon } from '@/redux/types/constants'
import { loadTaxis } from '@/server'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import BottomNav from '@/components/ui/bottom-nav'

const center = { lat: 1.2952078, lng: 103.773675 }
let directionsDisplay
let taxiRouteDisplay

let marks = {
	home: null,
	work: null,
	saved: [],
	user: null,
}

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
	const [distance, setDistance] = useState('')
	const [duration, setDuration] = useState('')
	const [validInput, isValidInput] = useState(false)
	const [poi, setPoi] = useState(true)
	const [taxis, setTaxis] = useState([])

	// Tracks which input box to trigger
	// 0 = None selected, 1 = Origin, 2 = Destination, 3 = Origin (select on map), 4 = Dest (select on map)
	const [expandSearch, setExpandSearch] = useState(0)
	const [userLocation, setUserLocation] = useState<any>({
		placeID: null,
		lat: null,
		lng: null,
		postcode: null,
		address: null,
		placeName: null,
	})
	const [rideConfirmed, setRideConfirmed] = useState(false)

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

	const [hideUI, setHideUI] = useState(false)

	// On map load
	const loadMap = useCallback(function callback(map) {
		mapStyles(map, poi)
		setMap(map)

		// Center to current location
		navigator.geolocation.getCurrentPosition((position) => {
			CoordinateToAddress(
				[position.coords.latitude, position.coords.longitude],
				setUserLocation
			)
			map.panTo({
				lat: position.coords.latitude,
				lng: position.coords.longitude,
			})
			marks.user = new google.maps.Marker({
				position: {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				},
				map: map,
				icon: {
					path: icon.crosshairs,
					fillColor: '#67e8f9',
					fillOpacity: 1,
					scale: 0.05,
					strokeColor: '#67e8f9',
					strokeWeight: 0.2,
				},
			})

			map.setZoom(18)
		})

		// Adding markers to the map after the user object has loaded
		const loggedInUser = localStorage.getItem('user')
		if (loggedInUser && !user.customerName) {
			setUser(JSON.parse(loggedInUser))
			setMarkers(map, JSON.parse(loggedInUser))
		} else if (user.customerName) {
			setMarkers(map, user)
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

	// useEffect(() => {
	// 	drawTaxiRoute()
	// }, [taxis])

	async function drawTaxiRoute(N = 0) {
		if (taxiRouteDisplay != null) {
			taxiRouteDisplay.set('directions', null)
			taxiRouteDisplay.setMap(null)
			taxiRouteDisplay = null
		}

		taxiRouteDisplay = new google.maps.DirectionsRenderer({
			polylineOptions: { strokeColor: '#65a30d', strokeWeight: 5 },
			suppressMarkers: true,
		})

		if (taxis.length > 0) {
			const directionsService = new google.maps.DirectionsService()
			const taxiPolyline = await directionsService.route({
				origin: taxis[N].getPosition(),
				destination: origin.lat ? origin : userLocation,
				travelMode: google.maps.TravelMode.DRIVING,
			})
			taxiRouteDisplay.setMap(map)
			taxiRouteDisplay.setDirections(taxiPolyline)
		}
	}

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

		if (origin.lat) {
			loadTaxis(map, [origin.lng, origin.lat], 5, setTaxis)
		} else {
			loadTaxis(map, [userLocation.lng, userLocation.lat], 5, setTaxis)
		}

		// eslint-disable-next-line no-undef
		const directionsService = new google.maps.DirectionsService()

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
		const routePolyline = await directionsService.route({
			origin: origin.lat ? origin : userLocation,
			destination: destination,
			// eslint-disable-next-line no-undef
			travelMode: google.maps.TravelMode.DRIVING,
		})

		setDistance(routePolyline.routes[0].legs[0].distance.text)
		setDuration(routePolyline.routes[0].legs[0].duration.text)
		console.log(duration)
		directionsDisplay.setMap(map) // Binding polyline to the map
		directionsDisplay.setDirections(routePolyline) // Setting the coords

		const route = routePolyline.routes[0].overview_path // Polyline coords

		// const expandedArray = expandArray(route, 100)

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

		// moveToStep(taxiMarker, expandedArray, 0, 30)

		// UI Updates
		isValidInput(true)
		setHideUI(true)
	}

	function clearRoute() {
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
		setHideUI(false)
		isValidInput(false)
		mapStyles(map, poi)
		if (directionsDisplay != null) {
			directionsDisplay.set('directions', null)
			directionsDisplay.setMap(null)
			directionsDisplay = null
			taxiRouteDisplay.set('directions', null)
			taxiRouteDisplay.setMap(null)
			taxiRouteDisplay = null
		}
		setRideConfirmed(false)
		setMarkerVisibility(taxis)
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
					}}
					onClick={(e) => setLocationViaClick(e)}
					onLoad={loadMap}
				></GoogleMap>
			</div>

			{/* Search elements */}
			{!hideUI
				? LocationSearch(
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
				: !rideConfirmed && (
						<button
							className='cancel-button absolute left-0 top-0 z-10 m-5'
							onClick={() => clearRoute()}
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
						origin={origin.lat ? origin : userLocation}
						destination={destination}
						setRideConfirmed={setRideConfirmed}
						onCancel={clearRoute}
						drawTaxiRoute={drawTaxiRoute}
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

function mark(map, place, image, fill, stroke) {
	return new google.maps.Marker({
		position: { lat: place.lat, lng: place.lng },
		map: map,
		title: place.placeName + ', ' + 'Singapore ' + place.postcode,
		icon: {
			path: image,
			fillColor: fill,
			fillOpacity: 1,
			scale: 0.03,
			strokeColor: stroke,
			strokeWeight: 0.5,
		},
	})
}

function listener(marker, info) {
	marker.addListener('click', () => {
		info.close()
		info.setContent(marker.getTitle())
		info.open(marker.getMap(), marker)
	})
}

function setMarkers(map, user) {
	const infoWindow = new google.maps.InfoWindow()

	marks.home = mark(map, user.home, icon.houseMarker, '#06b6d4', '#155e75')
	marks.work = mark(map, user.work, icon.workMarker, '#06b6d4', '#155e75')
	listener(marks.home, infoWindow)
	listener(marks.work, infoWindow)

	user.savedLocations.map((location, index) => {
		marks.saved.push(mark(map, location, icon.saved, 'Yellow', 'Gold'))
		listener(marks.saved[index], infoWindow)
	})
}
