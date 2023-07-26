import { MARKERS } from '@/constants'
import { CoordinateToAddress } from '@/server'
import { Location } from '@/types'
import mapStyles from '@/utils/noPoi'
import {
	destinationAtom,
	originAtom,
	searchTypeAtom,
	userLocationAtom,
} from '@/utils/state'
import { GoogleMap } from '@react-google-maps/api'
import { useCallback } from 'react'
import { useRecoilState } from 'recoil'
import { markers } from '../../../pages/map'
import { mark } from '../utils/markers'

export function MapInterface({
	setMap,
	poi,
}: {
	setMap: Function
	poi: boolean
}) {
	const [searchType] = useRecoilState<number>(searchTypeAtom)
	const [, setOrigin] = useRecoilState<Location>(originAtom)
	const [, setDest] = useRecoilState<Location>(destinationAtom)
	const [, setUserLocation] = useRecoilState<Location>(userLocationAtom)

	// Map onLoad: Styling, Pan to curent location, Location marker
	const loadMap = useCallback(function callback(map: google.maps.Map) {
		mapStyles(map, poi)
		setMap(map)

		navigator.geolocation.getCurrentPosition((position) => {
			const coords = {
				lat: position.coords.latitude,
				lng: position.coords.longitude,
			}

			const currentLocation = new google.maps.LatLng(coords)
			map.panTo(currentLocation)
			map.setZoom(18)

			CoordinateToAddress(currentLocation, setUserLocation)
			markers.user = mark(map, coords, MARKERS.USERLOCATION)
		})
	}, [])

	// Location Input: Set location by map click
	function handleMapClick(e: google.maps.MapMouseEvent) {
		if (searchType === 3) {
			CoordinateToAddress(e.latLng, setOrigin)
		} else if (searchType === 4) {
			CoordinateToAddress(e.latLng, setDest)
		}
	}

	return (
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
			onClick={(e) => handleMapClick(e)}
			onLoad={loadMap}
		/>
	)
}
