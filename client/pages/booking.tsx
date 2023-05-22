// Main hub for booking rides, calls external location API

import React, { useRef, useEffect, useState } from 'react'
import Page from '@/components/page'
import Section from '@/components/section'
import mapboxgl from 'mapbox-gl'
import { SearchBox } from '@mapbox/search-js-react'
import SearchLocations from './searchLocations'
import { RideOptions } from '../components/RideOptions'

mapboxgl.accessToken =
	'pk.eyJ1IjoiaXNzdjM3NCIsImEiOiJjbGhpdnRwbnAwYzA5M2pwNTN3ZzE1czk3In0.tfjsg4-ZXDxsMDuoyu_-SQ'

// Function to overlay a coordinate layer on the map (ex. map pins)
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

// Main function
const Booking = () => {
	const mapContainer = useRef(null)
	const map = useRef(null)
	const [lng, setLng] = useState<number>(103.7729178)
	const [lat, setLat] = useState<number>(1.2981255)
	const [zoom, setZoom] = useState(14)

	const [toLocation, setToLocation] = useState(false) // where you want to go
	const [fromLocation, setFromLocation] = useState(false) // where you currently are
	const [searchQueryVisible, setSearchQueryVisible] = useState(false)
	const [showRides, setShowRides] = useState(false) // show the ride options
	const [address, setAddress] = useState('') // Store the address of the seleted starting point

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

	// Function to create a directions request and draws the path between 2 points
	async function getRoute(start, end) {
		const query = await fetch(
			`https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
			{ method: 'GET' }
		)
		const json = await query.json()
		const data = json.routes[0]
		const route = data.geometry.coordinates

		// If a route already exists in the map, then overwrite it
		if (map.current?.getSource('route')) {
			map.current?.getSource('route').setData(geojson(route, 'LineString'))
		}
		// otherwise make a new request
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
					'line-color': '#000',
					'line-width': 3,
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
			setShowRides(true)
		})

		map.current?.addLayer({
			id: 'testmarker',
			type: 'circle',
			source: {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: [
						{
							type: 'Feature',
							properties: {},
							geometry: {
								type: 'MultiPoint',
								coordinates: [
									[103.62839, 1.29349],
									[103.62961, 1.27449],
									[103.63752, 1.30034],
									[103.64113, 1.33568],
									[103.65717, 1.30671],
									[103.66382, 1.32378],
									[103.66601, 1.32676],
									[103.66848, 1.32845],
									[103.67287, 1.32241],
									[103.67465, 1.33123],
									[103.67594, 1.33064],
									[103.67889, 1.31364],
									[103.67926, 1.33032],
									[103.68227, 1.32285],
									[103.68642, 1.3126],
									[103.68815, 1.3423],
									[103.68996, 1.35657],
									[103.69219, 1.34],
									[103.692543833333, 1.34214716666667],
									[103.69288, 1.34857],
									[103.6946, 1.35726],
									[103.69586, 1.33815],
									[103.696689516667, 1.35017843333333],
									[103.696689516667, 1.35017843333333],
								],
							},
						},
					],
				},
			},
		})
	})

	// Add a location pin on the map
	const addMarker = (coords, label) => {
		/*
			coords	: the [longitude, latitude] to place the pin
			label	: the layer ID (must be unique)
		*/
		if (!map.current?.getLayer(label)) {
			map.current?.addLayer({
				id: label,
				type: 'circle',
				source: {
					type: 'geojson',
					data: geojson(coords),
				},
				paint: {
					'circle-radius': 4,
					'circle-color': label === 'from' ? '#0891b2' : '#f30',
				},
			})
			// If the label already exists, then overwrite it
		} else {
			map.current?.getSource(label).setData(geojson(coords))
		}
	}

	// Set the current or destination location ('to')
	const setLocation = (coords, label) => {
		if (label === 'to') {
			// for setting destination
			addMarker(coords, label) // add the pin
			getRoute([lng, lat], coords) // get the path
			setShowRides(true) // show ride options
		} else {
			setLng(coords[0])
			setLat(coords[1])
			addMarker(coords, label)
			if (map.current?.getLayer('to')) {
				getRoute(
					coords,
					map.current?.getSource('to')._data.features[0].geometry.coordinates
				)
				setShowRides(true)
			}
		}
		const coordinates =
			map.current?.getSource('from')._data.features[0].geometry.coordinates

		// Reverse Geolocator: Convert the coordinates to an address
		fetch(
			`https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?types=address&access_token=${mapboxgl.accessToken}`
		)
			.then(function (response) {
				return response.json()
			})
			.then(function (data) {
				setAddress(data.features[0].place_name)
			})
	}

	return (
		<Page title='Booking'>
			{/* Show map API by default but hide it if the search buttons are clicked */}
			<Section>
				<div
					ref={mapContainer}
					className={`map-container ${searchQueryVisible ? 'hidden' : null}`}
				/>
			</Section>

			{/* Search Bar input fields */}
			<Section>
				<div className='absolute w-11/12 lg:w-6/12'>
					<div className={`${toLocation ? 'hidden' : null}`}>
						<SearchBox
							accessToken={mapboxgl.accessToken}
							options={{ language: 'en', country: 'SG' }}
							value='Your location'
							map={map.current}
							onRetrieve={(e) =>
								setLocation(e.features[0].geometry.coordinates, 'from')
							}
							onChange={(e) => setShowRides(false)}
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
							onChange={(e) => setShowRides(false)}
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

			{/* Show search UI on click */}
			<Section>{searchQueryVisible ? <SearchLocations /> : null}</Section>

			{/* Show list of ride options */}
			<Section>
				{showRides === true ? <RideOptions addr={address} /> : null}
			</Section>
		</Page>
	)
}

export default Booking


