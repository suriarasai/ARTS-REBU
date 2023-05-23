// Tracking page for post-confirmation process (ride tracking)

import React, { useState, useEffect, useRef, useContext } from 'react'
import mapboxgl from 'mapbox-gl'
import api from '@/api/axiosConfig'
import { UserContext } from '@/components/context/UserContext'
import { useRouter } from 'next/router'
import { addMarker, geojson } from '@/components/common/addMarker'
import { loadTaxis } from '@/components/common/loadTaxis'
import { getCoords } from '@/components/common/getCoords'

import Page from '@/components/page'
import Section from '@/components/section'

const Booking = () => {
	const mapContainer = useRef(null)
	const map = useRef(null)
	const [lng, setLng] = useState<number>(103.7729178)
	const [lat, setLat] = useState<number>(1.2981255)
	const [zoom, setZoom] = useState<number>(14)
	const { user, setUser } = useContext(UserContext)

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
		addMarker(map, [lng, lat], 'current') // Current location
        addMarker(map, user.temp[0], 'from') // Starting location
        addMarker(map, [lng, lat], 'to') // Destination location
		getRoute(user.temp[0], user.temp[1], 'toDestination', '#000000')
		loadTaxis(map, 1, function () {
			getRoute(user.temp[0], getCoords(map, 'taxis0'), 'toUser', '#BC544B')
		})
	})

	async function getRoute(start, end, id, color) {
		const query = await fetch(
			`https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
			{ method: 'GET' }
		)
		const json = await query.json()

		map.current?.addLayer({
			id: id,
			type: 'line',
			source: {
				type: 'geojson',
				data: geojson(json.routes[0].geometry.coordinates, 'LineString'),
			},
			layout: {
				'line-join': 'round',
				'line-cap': 'round',
			},
			paint: {
				'line-color': color,
				'line-width': 3,
				'line-opacity': 0.75,
			},
		})
	}

	return (
		<Page title='Notifications'>
			<Section>
				<div ref={mapContainer} className={'map-container'} />
			</Section>
		</Page>
	)
}

export default Booking
