// Main hub for booking rides

// Displays user activity (ex. booked rides, reviews)

import React, { useRef, useEffect, useState } from 'react'
import Page from '@/components/page'
import Section from '@/components/section'
import mapboxgl from 'mapbox-gl'
import { SearchBox } from '@mapbox/search-js-react'
import SearchLocations from './searchLocations'

mapboxgl.accessToken =
	'pk.eyJ1IjoiaXNzdjM3NCIsImEiOiJjbGhpdnRwbnAwYzA5M2pwNTN3ZzE1czk3In0.tfjsg4-ZXDxsMDuoyu_-SQ'

const geojson = (coords, type = 'Point') => {
	return {
		type: 'FeatureCollection',
		features: [
			{
				type: 'Feature',
				properties: {},
				geometry: {
					type: type,
					coordinates: coords,
				},
			},
		],
	}
}

const Booking = () => {
	const mapContainer = useRef(null)
	const map = useRef(null)
	const [lng, setLng] = useState<number>()
	const [lat, setLat] = useState<number>()
	const [zoom, setZoom] = useState(14)

	const [toLocation, setToLocation] = useState(false)
	const [fromLocation, setFromLocation] = useState(false)
	const [searchQueryVisible, setSearchQueryVisible] = useState(false)

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
			style: 'mapbox://styles/mapbox/light-v11',
			zoom: zoom,
		})
	})

	// create a function to make a directions request
	async function getRoute(start, end) {
		// make a directions request using cycling profile
		// an arbitrary start will always be the same
		// only the end or destination will change
		const query = await fetch(
			`https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
			{ method: 'GET' }
		)
		const json = await query.json()
		const data = json.routes[0]
		const route = data.geometry.coordinates
		// if the route already exists on the map, we'll reset it using setData
		if (map.current?.getSource('route')) {
			map.current?.getSource('route').setData(geojson(route, 'LineString'))
		}
		// otherwise, we'll make a new request
		else {
			map.current?.addLayer({
				id: 'route',
				type: 'line',
				source: {
					type: 'geojson',
					data: geojson(route, 'LineString'),
				},
				layout: {
					'line-join': 'round',
					'line-cap': 'round',
				},
				paint: {
					'line-color': '#3887be',
					'line-width': 5,
					'line-opacity': 0.75,
				},
			})
		}
	}

	// Add starting point to the map
	map.current?.on('load', () => {
		setLocation([lng, lat], 'from')
		map.current?.setCenter([lng, lat])

		// Adds a marker where the user clicks on the map
		map.current?.on('click', (event) => {
			// TODO: Set clicked location to be the SearchBox input
			const coords = Object.keys(event.lngLat).map((key) => event.lngLat[key])

			if (map.current?.getLayer('to')) {
				map.current?.getSource('to').setData(geojson(coords))
			} else {
				setLocation(coords, 'to')
			}
			getRoute(
				map.current?.getSource('from')._data.features[0].geometry.coordinates,
				coords
			)
		})
	})

	// Adds a location pin on the map
	const addMarker = (coords, label) => {
		if (!map.current?.getLayer(label)) {
			map.current?.addLayer({
				id: label,
				type: 'circle',
				source: {
					type: 'geojson',
					data: geojson(coords),
				},
				paint: {
					'circle-radius': 10,
					'circle-color': label === 'from' ? '#3887be' : '#f30',
				},
			})
		} else {
			map.current?.getSource(label).setData(geojson(coords))
		}
	}

	// Sets the current and destination location
	const setLocation = (coords, label) => {
		if (label === 'to') {
			addMarker(coords, label)
			getRoute([lng, lat], coords)
		} else {
			setLng(coords[0])
			setLat(coords[1])
			addMarker([lng, lat], label)
			if (map.current?.getLayer('to')) {
				getRoute(
					coords,
					map.current?.getSource('to')._data.features[0].geometry.coordinates
				)
			}
		}
	}

	return (
		<Page title='Booking'>
			<Section>
				{/* Show map API by default but hide it if the search buttons are clicked */}
				<div
					ref={mapContainer}
					className={`map-container ${searchQueryVisible ? 'hidden' : null}`}
				/>
			</Section>

			<Section>
				<div className='absolute w-11/12 lg:w-6/12'>
					{/* Search Bar input fields */}
					<div className={`${toLocation ? 'hidden' : null}`}>
						<SearchBox
							accessToken={mapboxgl.accessToken}
							options={{ language: 'en', country: 'SG' }}
							value='Your location'
							map={map.current}
							onRetrieve={(e) =>
								setLocation(e.features[0].geometry.coordinates, 'from')
							}
							// onFocus={() => {
							// 	setSearchQueryVisible(true), setFromLocation(true)
							// }}
							// onBlur={() => {
							// 	setSearchQueryVisible(false), setFromLocation(false)
							// }}
						/>
					</div>
					<div className={`map-search-box ${fromLocation ? 'hidden' : null}`}>
						{/* TODO: Placeholder values? */}
						<SearchBox
							accessToken={mapboxgl.accessToken}
							options={{ language: 'en', country: 'SG' }}
							value='Choose a destination'
							map={map.current}
							onRetrieve={(e) =>
								setLocation(e.features[0].geometry.coordinates, 'to')
							}
							// TODO: Fix the below code to render the search UI
							// onFocus={() => {
							// 	setSearchQueryVisible(true), setToLocation(true)
							// }}
							// onBlur={() => {
							// 	setSearchQueryVisible(false), setToLocation(false)
							// }}
						/>
					</div>
				</div>
			</Section>

			{/* Show search bar on click */}
			<Section>{searchQueryVisible ? <SearchLocations /> : null}</Section>
		</Page>
	)
}

export default Booking
