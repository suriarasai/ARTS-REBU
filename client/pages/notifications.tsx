// Notifications page for informing the user

import React, { useState, useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import api from '@/api/axiosConfig'
import { UserContext } from '@/components/context/UserContext'
import { useRouter } from 'next/router'
import { addMarker, geojson } from '@/components/common/addMarker'
import { loadTaxis } from '@/components/common/loadTaxis'

import Page from '@/components/page'
import Section from '@/components/section'

const Notifications = () => {
	const mapContainer = useRef(null)
	const map = useRef(null)
	const [lng, setLng] = useState<number>(103.7729178)
	const [lat, setLat] = useState<number>(1.2981255)
	const [zoom, setZoom] = useState<number>(14)
	const [taxiLocation, setTaxiLocation] = useState<Array<number>>(null)

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
		loadTaxis(map, 1, getRoute)
	})

	async function getRoute() {
		const coord =
			map.current?.getSource('taxis0')._data.features[0].geometry.coordinates
		// console.log(coord)
		const query = await fetch(
			`https://api.mapbox.com/directions/v5/mapbox/driving/${lng},${lat};${coord[0]},${coord[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
			{ method: 'GET' }
		)
		const json = await query.json()

		map.current?.addLayer({
			id: 'route',
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
				'line-color': '#000',
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

export default Notifications
