import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api'
import { useEffect, useRef, useState, useContext, useCallback } from 'react'
import { UserContext } from '@/context/UserContext'
import { Locate } from '@/components/booking/Locate'
import ExpandSearch from '@/components/booking/expandSearch'
import { RideConfirmation } from '@/components/booking/RideConfirmation'
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

let marks = {
	home: null,
	work: null,
	saved: [],
	user: null,
	origin: null,
	destination: null,
}

const libraries = ['places']

function Booking() {
	const { user, setUser } = useContext(UserContext)
	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
		// @ts-ignore
		libraries: libraries,
	})

	const [map, setMap] = useState(/** @type google.maps.Map */ null)
	const [distance, setDistance] = useState<number>(null)
	const [duration, setDuration] = useState<number>(null)
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
					url: 'https://www.svgrepo.com/show/258041/pin-maps-and-location.svg',
					scaledSize: new google.maps.Size(30, 30)
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

			if (!marks.origin) {
				marks.origin = mark(map, origin, 'https://www.svgrepo.com/show/375834/location.svg')
			} else {
				marks.origin.setPosition(origin)
			}
			map.panTo(origin)
		}
	}, [origin])

	// Set destination address after clicking a saved location
	useEffect(() => {
		if (destination.lat) {
			isValidInput(true)
			destinationRef.current.value = destination.placeName

			if (!marks.destination) {
				marks.destination = mark(
					map,
					destination,
					'https://www.svgrepo.com/show/375810/flag.svg'
				)
			} else {
				marks.destination.setPosition(destination)
			}
			map.panTo(destination)
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

		if (origin.lat) {
			await loadTaxis(map, [origin.lng, origin.lat], 5, setTaxis)
		} else {
			await loadTaxis(map, [userLocation.lng, userLocation.lat], 5, setTaxis)
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
		directionsDisplay = new google.maps.DirectionsRenderer({
			polylineOptions: {
				strokeColor: '#65a30d',
				strokeOpacity: 1,
				strokeWeight: 6,
			},
			suppressMarkers: true,
		})

		// Setting the coordinates of the directions polyline
		const routePolyline = await directionsService.route({
			origin: origin.lat ? origin : userLocation,
			destination: destination,
			// eslint-disable-next-line no-undef
			travelMode: google.maps.TravelMode.DRIVING,
		})

		setDistance(routePolyline.routes[0].legs[0].distance.value)
		setDuration(routePolyline.routes[0].legs[0].duration.value)
		directionsDisplay.setMap(map) // Binding polyline to the map
		directionsDisplay.setDirections(routePolyline) // Setting the coords

		// UI Updates
		isValidInput(true)
		setHideUI(true)
		marks.home.setMap(null)
		marks.work.setMap(null)
		setMarkerVisibility(marks.saved)
	}

	function clearRoute() {

		if (marks.origin) {
			marks.origin.setMap(null)
			marks.origin = null
		}
		
		marks.destination.setMap(null)
		marks.destination = null

		setDistance(null)
		setDuration(null)
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
		}
		setMarkerVisibility(taxis)

		// Reshow saved locations
		marks.home.setMap(map)
		marks.work.setMap(map)

		setMarkerVisibility(marks.saved, map)
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
			{!hideUI &&
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
				)}

			{/* If the user is not searching... */}
			{[0, 3, 4].includes(expandSearch) ? (
				// If the input is valid, then begin the booking confirmation procedure
				taxis.length > 1 && distance ? (
					<RideConfirmation
						map={map}
						taxis={taxis}
						user={user}
						distance={distance}
						duration={duration}
						origin={origin.lat ? origin : userLocation}
						destination={destination}
						onCancel={clearRoute}
						tripPolyline={directionsDisplay.directions.routes[0].overview_path}
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

function mark(map, place, image) {
	return new google.maps.Marker({
		position: { lat: place.lat, lng: place.lng },
		map: map,
		title: place.placeName + ', ' + 'Singapore ' + place.postcode,
		icon: {
			url: image,
			scaledSize: new google.maps.Size(30, 30)
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

	marks.home = mark(map, user.home, 'https://www.svgrepo.com/show/375801/door.svg')
	marks.work = mark(map, user.work, 'https://www.svgrepo.com/show/375762/briefcase.svg')
	listener(marks.home, infoWindow)
	listener(marks.work, infoWindow)

	user.savedLocations.map((location, index) => {
		marks.saved.push(mark(map, location, 'https://www.svgrepo.com/show/375878/ribbon.svg'))
		listener(marks.saved[index], infoWindow)
	})
}
