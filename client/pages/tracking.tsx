// Post-confirmation screen to track ride location

import React, { useState, useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import api from '@/api/axiosConfig'
import { UserContext } from '@/components/context/UserContext'
import { useRouter } from 'next/router'
import { addMarker, geojson } from '@/components/common/addMarker'

const RideOptions = ({}) => {
	const mapContainer = useRef(null)
	const map = useRef(null)
	const [lng, setLng] = useState<number>(103.7729178)
	const [lat, setLat] = useState<number>(1.2981255)
	const [zoom, setZoom] = useState(14)

	mapboxgl.accessToken =
		'pk.eyJ1IjoiaXNzdjM3NCIsImEiOiJjbGhpdnRwbnAwYzA5M2pwNTN3ZzE1czk3In0.tfjsg4-ZXDxsMDuoyu_-SQ'

	useEffect(() => {
		if (map.current) return // initialize map only once

		// Centers map on current location
		navigator.geolocation.getCurrentPosition((position) => {
			setLng(position.coords.longitude)
			setLat(position.coords.latitude)
		})

		// Creates the map object
		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: 'mapbox://styles/issv374/clhymkicc003e01rbarxs6ryv',
			zoom: zoom,
		})
	})

	// Add starting point to the map
	map.current?.on('load', () => {
		map.current?.setCenter([lng, lat])
        addMarker(map, [lng, lat], 'from')
	})

	return (
		<main>
			<div ref={mapContainer} className={'map-container'} />
		</main>
	)
}

export default RideOptions
