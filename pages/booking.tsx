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

const Booking = () => {
	const mapContainer = useRef(null)
	const map = useRef(null)
	const [lng, setLng] = useState(103.776958)
	const [lat, setLat] = useState(1.29368)
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
			center: [lng, lat],
			zoom: zoom,
		})
	})

	const start = [103.773869, 1.299151]

	// create a function to make a directions request
	async function getRoute(end) {
		// make a directions request using cycling profile
		// an arbitrary start will always be the same
		// only the end or destination will change
		const query = await fetch(
			`https://api.mapbox.com/directions/v5/mapbox/cycling/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
			{ method: 'GET' }
		)
		const json = await query.json()
		const data = json.routes[0]
		const route = data.geometry.coordinates
		const geojson = {
			type: 'Feature',
			properties: {},
			geometry: {
				type: 'LineString',
				coordinates: route,
			},
		}
		// if the route already exists on the map, we'll reset it using setData
		if (map.current?.getSource('route')) {
			map.current?.getSource('route').setData(geojson)
		}
		// otherwise, we'll make a new request
		else {
			map.current?.addLayer({
				id: 'route',
				type: 'line',
				source: {
					type: 'geojson',
					data: geojson,
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
		// add turn instructions here at the end
	}

	map.current?.on('load', () => {
		// make an initial directions request that
		// starts and ends at the same location
		getRoute(start)

		// Add starting point to the map
		map.current?.addLayer({
			id: 'point',
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
								type: 'Point',
								coordinates: start,
							},
						},
					],
				},
			},
			paint: {
				'circle-radius': 10,
				'circle-color': '#3887be',
			},
		})
		
		// Adds a marker where the user clicks on the map
		map.current?.on('click', (event) => {
			const coords = Object.keys(event.lngLat).map((key) => event.lngLat[key])
			const end = {
				type: 'FeatureCollection',
				features: [
					{
						type: 'Feature',
						properties: {},
						geometry: {
							type: 'Point',
							coordinates: coords,
						},
					},
				],
			}
			if (map.current?.getLayer('end')) {
				map.current?.getSource('end').setData(end)
			} else {
				map.current?.addLayer({
					id: 'end',
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
										type: 'Point',
										coordinates: coords,
									},
								},
							],
						},
					},
					paint: {
						'circle-radius': 10,
						'circle-color': '#f30',
					},
				})
			}
			getRoute(coords)
		})
	})

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
							// onFocus={() => {
							// 	setSearchQueryVisible(true), setFromLocation(true)
							// }}
							// onBlur={() => {
							// 	setSearchQueryVisible(false), setFromLocation(false)
							// }}
						/>
					</div>
					<div className={`map-search-box ${fromLocation ? 'hidden' : null}`}>
						<SearchBox
							accessToken={mapboxgl.accessToken}
							options={{ language: 'en', country: 'SG' }}
							value='Choose a destination'
							map={map.current}
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
