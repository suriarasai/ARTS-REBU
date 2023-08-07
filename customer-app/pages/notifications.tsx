import { setMarkerVisibility } from '@/components/Map/utils/markers'
import Page from '@/components/ui/page'
import { GoogleMap, LoadScriptNext } from '@react-google-maps/api'
import { useCallback, useEffect, useState } from 'react'

export default function Notifications() {
	const [isLoading, setIsLoading] = useState(true)
	const [map, setMap] = useState(null)
	const [userLoc, setUserLoc] = useState(null)
	const [taxiMarkers, setTaxiMarkers] = useState(null)

	useEffect(() => {
		if (!isLoading) {
			computeNearbyTaxis(
				userLoc ? userLoc : new google.maps.LatLng(1.315, 103.67923),
				map, 
				setTaxiMarkers
			)
		}
	}, [isLoading, userLoc])

	const loadMap = useCallback(function callback(map: google.maps.Map) {
		navigator.geolocation.getCurrentPosition((position) => {
			const taxiLocation = new google.maps.LatLng(
				position.coords.latitude,
				position.coords.longitude
			)

			map.panTo(taxiLocation)
			map.setZoom(18)

			setIsLoading(false)
			setMap(map)
		})
	}, [])

	const updateUserLoc = (e) => {
		setUserLoc(e.latLng)
		setMarkerVisibility(taxiMarkers)
	}

	return (
		<LoadScriptNext
			googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
		>
			<div className='relative h-screen w-screen'>
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
					onLoad={loadMap}
					onClick={(e) => updateUserLoc(e)}
				/>
			</div>
		</LoadScriptNext>
	)
}

function computeNearbyTaxis(coord: google.maps.LatLng, map: google.maps.Map, set) {
	fetch('https://api.data.gov.sg/v1/transport/taxi-availability')
		.then(function (response) {
			return response.json()
		})
		.then(function (data) {
			const coordinates = data.features[0].geometry.coordinates

			const distances: Array<{
				distance: number
				lng: number
				lat: number
				index: number
			}> = []

			// Calculating the Euclidean distance
			coordinates.forEach(([a, b]: number[], index: number) =>
				distances.push({
					distance: Math.pow(a - coord.lng(), 2) + Math.pow(b - coord.lat(), 2),
					lng: a,
					lat: b,
					index: index + 1,
				})
			)

			// Sorting the distances in ascending order
			distances.sort((a, b) => a.distance - b.distance)

			let newTaxi
			let nearbyTaxiMarkers = []

			// Saving the marker to the state variable
			for (let i = 0; i < 6; i++) {
				newTaxi = new google.maps.Marker({
					map: map,
					title: distances[i].index.toString(),
					position: { lat: distances[i].lat, lng: distances[i].lng },
					icon: {
						url: 'https://www.svgrepo.com/show/375911/taxi.svg',
						scaledSize: new google.maps.Size(30, 30),
					},
				})
				nearbyTaxiMarkers.push(newTaxi)
			}
			set(nearbyTaxiMarkers)
		})
}
