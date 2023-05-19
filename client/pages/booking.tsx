// Main hub for booking rides, calls external location API

import React, { useRef, useEffect, useState } from 'react'
import Page from '@/components/page'
import Section from '@/components/section'
import mapboxgl from 'mapbox-gl'
import { SearchBox } from '@mapbox/search-js-react'
import SearchLocations from './searchLocations'

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
					'line-color': '#0891b2',
					'line-width': 5,
					'line-opacity': 0.75,
				},
			})
		}
		map.current?.resize()
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
					'circle-radius': 10,
					'circle-color': label === 'from' ? '#0891b2' : '#f30',
				},
			})
			// If the label already exists, then overwrite itF
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
			<Section>{showRides === true ? <RideOptions /> : null}</Section>
		</Page>
	)
}

export default Booking

// TODO: Limit to 3 options
// Shows options of rides to choose from
const RideOptions = () => {
	const [showModal, setShowModal] = useState(false) // UI for confirming the ride

	const options = [
		{
			id: 0,
			type: 'RebuX',
			people: 4,
			price: 7.0,
			dropoff: '7:00 PM',
		},
		{
			id: 1,
			type: 'RebuPool',
			people: 2,
			price: 12.0,
			dropoff: '6:30 PM',
		},
		{
			id: 2,
			type: 'Rebu SUV',
			people: 1,
			price: 18.0,
			dropoff: '6:00 PM',
		},
	]

	return (
		<div className='absolute bottom-0 w-11/12 bg-white pb-16 opacity-80 md:pb-4 lg:w-6/12 lg:pb-4'>
			<div className='p-4'>
				{!showModal ? (
					<div>
						<label>Options</label>
						{options.map((option) => (
							<ShowOption
								option={option}
								setShowModal={setShowModal}
								key={option.id}
							/>
						))}
					</div>
				) : (
					<div>
						<label>Confirm Details</label>

						<ShowOption
							option={options[0]}
							setShowModal={setShowModal}
							key={options[0].id}
						/>

						<label className='mt-2'>Pickup Location</label>

						<div className='mb-4 p-2'>
							<b>National University of Singapore, ISS</b>
							<br />
							25 Heng Mui Keng Terrace, Singapore 129959
						</div>

						<div className='flex items-center justify-center gap-5'>
							<button
								className='grey-button w-1/4'
								onClick={() => setShowModal(false)}
							>
								Go Back
							</button>
							<button className='blue-button w-3/4 bg-cyan-600'>
								<div className='text-white' key='logout'>
									Confirm
								</div>
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

// helper component to show rides
const ShowOption = ({ option, setShowModal }) => (
	/*
		option			: the ride option
		setShowModal	: whether to show the modal
	*/
	<div
		className='flow-root p-2 hover:bg-zinc-100'
		key={option.id}
		onClick={() => setShowModal(true)}
	>
		<div className='float-left mt-2'>
			<b>{option.type}</b> - {option.people} people
		</div>
		<div className='float-right mr-8'>
			<b>${option.price}</b> <br />
			{option.dropoff} ETA
		</div>
	</div>
)
