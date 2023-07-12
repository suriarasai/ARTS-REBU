import { GoogleMap, LoadScriptNext } from '@react-google-maps/api'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Locate } from '@/components/booking/Locate'
import ExpandSearch from '@/components/booking/expandSearch'
import { RideConfirmation } from '@/components/booking/RideConfirmation'
import TogglePOI from '@/components/booking/togglePoiButton'
import { CoordinateToAddress, getDirections } from '@/server'
import { LocationSearch } from '../components/booking/LocationSearch'
import setMarkerVisibility from '@/utils/setMarkerVisibility'
import mapStyles from '@/utils/noPoi'
import { loadTaxis } from '@/server'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import BottomNav from '@/components/ui/bottom-nav'
import { loadNearbyTaxiStops } from '@/components/booking/loadNearbyTaxiStops'
import { useRecoilState } from 'recoil'
import {
	bookingAtom,
	destinationAtom,
	originAtom,
	searchTypeAtom,
	userAtom,
} from '@/utils/state'

let marks = {
	home: null,
	work: null,
	saved: [],
	user: null,
	origin: null,
	destination: null,
}

const libraries = ['places', 'geometry']

function Booking() {
	const [user, setUser] = useRecoilState(userAtom)

	const [map, setMap] = useState(/** @type google.maps.Map */ null)
	const [route, setRoute] = useState(null)
	const [validInput, isValidInput] = useState(false)
	const [poi, setPoi] = useState(true)
	const [taxis, setTaxis] = useState([])
	const [nearbyTaxiStops, setNearbyTaxiStops] = useState([])
	const [polyline, setPolyline] = useState(null)

	// Tracks which input box to trigger
	// 0 = None selected, 1 = Origin, 2 = Destination, 3 = Origin (select on map), 4 = Dest (select on map)
	const [searchType, setSearchType] = useRecoilState(searchTypeAtom)
	const [userLocation, setUserLocation] = useState<any>({
		placeID: null,
		lat: null,
		lng: null,
		postcode: null,
		address: null,
		placeName: null,
	})

	const [origin, setOrigin] = useRecoilState(originAtom)
	const [destination, setDestination] = useRecoilState(destinationAtom)

	/** @type React.MutableRefObject<HTMLInputElement> */
	const originRef = useRef(null) // Tracks input value of origin box
	/** @type React.MutableRefObject<HTMLInputElement> */
	const destinationRef = useRef(null) // Tracks input value of destination box

	const [hideUI, setHideUI] = useState(false)

	// Set origin address after clicking a saved location
	useEffect(() => {
		if (origin.lat) {
			originRef.current.value = origin.placeName

			if (!marks.origin) {
				marks.origin = mark(
					map,
					origin,
					'https://www.svgrepo.com/show/375834/location.svg'
				)
			} else {
				marks.origin.setPosition(origin)
			}
			map.panTo(origin)
			if (!poi) {
				setMarkerVisibility(nearbyTaxiStops)
				loadNearbyTaxiStops(map, [origin.lng, origin.lat], setNearbyTaxiStops)
			}
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
					url: 'https://www.svgrepo.com/show/115216/pointer-inside-a-circle.svg',
					scaledSize: new google.maps.Size(30, 30),
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

	// Retrieve and render the route to the destination
	async function calculateRoute() {
		if (!destination.lat) {
			isValidInput(false)
			return
		}

		await loadTaxis(
			map,
			origin.lat
				? [origin.lng, origin.lat]
				: [userLocation.lng, userLocation.lat],
			5,
			setTaxis
		)

		mapStyles(map, poi)

		// Removing directions polyline if a polyline already exists
		if (polyline) {
			setMarkerVisibility(polyline)
			setPolyline(null)
		}

		await getDirections(
			map,
			origin.lat ? origin : userLocation,
			destination,
			setRoute,
			setPolyline,
			() => {
				setSearchType(0)
				isValidInput(true)
				setHideUI(true)
				marks.home.setMap(null)
				marks.work.setMap(null)
				setMarkerVisibility(marks.saved)
			}
		)
	}

	function clearRoute() {
		if (marks.origin) {
			marks.origin.setMap(null)
			marks.origin = null
		}

		marks.destination.setMap(null)
		marks.destination = null

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
		if (polyline !== null) {
			setMarkerVisibility(polyline)
			setPolyline(null)
		}
		setMarkerVisibility(taxis)
		setMarkerVisibility(nearbyTaxiStops)

		// Reshow saved locations
		marks.home.setMap(map)
		marks.work.setMap(map)

		setMarkerVisibility(marks.saved, map)
		setRoute(null)
	}

	function setLocationViaClick(e) {
		if (searchType === 3) {
			CoordinateToAddress([e.latLng.lat(), e.latLng.lng()], setOrigin)
		} else if (searchType === 4) {
			CoordinateToAddress([e.latLng.lat(), e.latLng.lng()], setDestination)
		}
	}

	return (
		<LoadScriptNext
			googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
			loadingElement={<LoadingScreen />}
			// @ts-ignore
			libraries={libraries}
		>
			<div className='relative h-screen w-screen'>
				{/* Google Maps screen */}
				<div
					className={`absolute left-0 top-0 h-full w-full ${
						[0, 3, 4].includes(searchType) ? '' : 'hidden'
					}`}
				>
					<GoogleMap
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
				{!hideUI && (
					<LocationSearch
						originRef={originRef}
						isValidInput={isValidInput}
						destinationRef={destinationRef}
						calculateRoute={calculateRoute}
						validInput={validInput}
					/>
				)}

				{/* If the user is not searching... */}
				{[0, 3, 4].includes(searchType) ? (
					// If the input is valid, then begin the booking confirmation procedure
					taxis.length > 1 && route ? (
						<RideConfirmation
							map={map}
							taxis={taxis}
							user={user}
							distance={route.distanceMeters}
							duration={Number(route.duration.match(/\d+/)[0])}
							origin={origin.lat ? origin : userLocation}
							destination={destination}
							onCancel={clearRoute}
							tripPolyline={google.maps.geometry.encoding.decodePath(
								route.polyline.encodedPolyline
							)}
						/>
					) : (
						// If the input is invalid, then continue to show them the map controls
						<>
							<Locate map={map} />
							<TogglePOI
								map={map}
								poi={poi}
								setPoi={setPoi}
								origin={origin.lat ? origin : userLocation}
								setNearbyTaxiStops={setNearbyTaxiStops}
								nearbyTaxiStops={nearbyTaxiStops}
							/>
							<BottomNav />
						</>
					)
				) : (
					// If the user is searching, then show them the expanded search UI
					<>
						<ExpandSearch
							mode={searchType}
							location={searchType === 1 ? origin : destination}
							setLocation={searchType === 1 ? setOrigin : setDestination}
						/>
					</>
				)}
			</div>
		</LoadScriptNext>
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
			scaledSize: new google.maps.Size(30, 30),
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

	marks.home = mark(
		map,
		user.home,
		'https://www.svgrepo.com/show/375801/door.svg'
	)
	marks.work = mark(
		map,
		user.work,
		'https://www.svgrepo.com/show/375762/briefcase.svg'
	)
	listener(marks.home, infoWindow)
	listener(marks.work, infoWindow)

	user.savedLocations.map((location, index) => {
		marks.saved.push(
			mark(map, location, 'https://www.svgrepo.com/show/375878/ribbon.svg')
		)
		listener(marks.saved[index], infoWindow)
	})
}
