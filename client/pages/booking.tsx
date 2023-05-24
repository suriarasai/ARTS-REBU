// Main hub for booking rides, calls external location API

import React, { useRef, useEffect, useState, useContext } from 'react'
import Page from '@/components/page'
import Section from '@/components/section'
import mapboxgl from 'mapbox-gl'
import { SearchBox } from '@mapbox/search-js-react'
import SearchLocations from './searchLocations'
import { RideOptions } from '../components/RideOptions'
import * as turf from '@turf/turf'
import { addMarker, geojson } from '@/components/common/addMarker'
import { loadTaxis } from '@/components/common/loadTaxis'
import { UserContext } from '@/components/context/UserContext'

mapboxgl.accessToken =
	'pk.eyJ1IjoiaXNzdjM3NCIsImEiOiJjbGhpdnRwbnAwYzA5M2pwNTN3ZzE1czk3In0.tfjsg4-ZXDxsMDuoyu_-SQ'

// Main function
const Booking = () => {
	const { user, setUser } = useContext(UserContext)
	const mapContainer = useRef(null)
	const map = useRef(null)
	const [lng, setLng] = useState<number>(103.7729178)
	const [lat, setLat] = useState<number>(1.2981255)
	const [zoom, setZoom] = useState(14)
	const [distance, setDistance] = useState(0)

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
			style: 'mapbox://styles/issv374/clhymkicc003e01rbarxs6ryv',
			zoom: zoom,
		})
	})

	// Function to create a directions request and draws the path between 2 points
	async function getRoute(map, start, end) {
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
		// Sets the distance of the route for fare calculation
		setDistance(
			turf.length(
				turf.lineString(
					map.current?.getSource('route')._data.features[0].geometry.coordinates
				),
				{ units: 'kilometers' }
			)
		)
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
				map,
				map.current?.getSource('from')._data.features[0].geometry.coordinates,
				coords
			)
			setShowRides(true)
		})

		loadTaxis(map)
	})

	// Set the current or destination location ('to')
	const setLocation = (coords, label) => {
		if (label === 'to') {
			// for setting destination
			addMarker(map, coords, label) // add the pin
			getRoute(map, [lng, lat], coords) // get the path
			setShowRides(true) // show ride options
		} else {
			setLng(coords[0])
			setLat(coords[1])
			loadTaxis(map)
			addMarker(map, coords, label)
			if (map.current?.getLayer('to')) {
				getRoute(
					map,
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
				<div className='absolute flex w-11/12 flex-wrap lg:w-6/12'>
					<SearchField
						setLocation={setLocation}
						setSearchQueryVisible={setSearchQueryVisible}
						setToLocation={setFromLocation}
						setShowRides={setShowRides}
						searchQueryVisible={searchQueryVisible}
						fromLocation={toLocation}
						type='from'
						map={map}
					/>
					<SearchField
						setLocation={setLocation}
						setSearchQueryVisible={setSearchQueryVisible}
						setToLocation={setToLocation}
						setShowRides={setShowRides}
						searchQueryVisible={searchQueryVisible}
						fromLocation={fromLocation}
						type='to'
						map={map}
					/>
				</div>
			</Section>

			{/* Show search UI upon clicking the searchboxes*/}
			<Section>{searchQueryVisible ? <SearchLocations /> : null}</Section>

			{/* Show list of ride options upon selecting a location */}
			<Section>
				{showRides === true ? (
					<RideOptions map={map} addr={address} distance={distance} />
				) : null}
			</Section>
		</Page>
	)
}

const SearchField = (props) => (
	<>
		<div className={`${props.fromLocation ? 'hidden' : null} w-2/12 pt-1 pr-3`}>
			{!props.searchQueryVisible ? (
				<div className='flex h-8 flex-wrap rounded-full bg-white p-2'>
					{props.type === 'from' ? (
						<InsertSVG
							color='#30D5C8'
							text='From'
							stroke='currentColor'
							strokeLinecap='square'
							d='M7.5.5v14m7-7.005H.5m13 0a6.006 6.006 0 01-6 6.005c-3.313 0-6-2.694-6-6.005a5.999 5.999 0 016-5.996 6 6 0 016 5.996z'
						/>
					) : (
						<InsertSVG
							color='#8B0000'
							text='To'
							fill='currentColor'
							d='M12.5 6.5l.224.447a.5.5 0 00.033-.876L12.5 6.5zm-10-6l.257-.429A.5.5 0 002 .5h.5zm10.257 5.571l-10-6-.514.858 10 6 .514-.858zM2 .5v11h1V.5H2zm.724 11.447l10-5-.448-.894-10 5 .448.894zM3 15v-3.5H2V15h1z'
						/>
					)}
				</div>
			) : (
				<button
					className='red-button mt-1 text-sm'
					onClick={() => {
						props.setSearchQueryVisible(false)
						props.setToLocation(false)
					}}
				>
					Cancel
				</button>
			)}
		</div>
		<div
			className={`${props.fromLocation ? 'hidden' : null} w-10/12`}
			onFocus={() => {
				props.setSearchQueryVisible(true),
					props.setToLocation(true),
					props.setShowRides(false)
			}}
		>
			{/* TODO: Placeholder values? */}
			<SearchBox
				accessToken={mapboxgl.accessToken}
				options={{ language: 'en', country: 'SG' }}
				value={props.type === 'to' ? 'Choose a destination' : 'Your location'}
				map={props.map.current}
				onRetrieve={(e) => {
					props.setLocation(e.features[0].geometry.coordinates, 'to')
					props.setSearchQueryVisible(false)
					props.setToLocation(false)
				}}
				onChange={(e) => props.setShowRides(false)}
				popoverOptions={{ offset: 110 }}
			/>
		</div>
	</>
)

const InsertSVG = ({
	color,
	text,
	d,
	fill = null,
	stroke = null,
	strokeLinecap = null,
}) => (
	<>
		<svg
			viewBox='0 0 15 15'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			width='15'
			height='15'
			color={color}
			className='w-1/3'
		>
			<path
				d={d}
				fill={fill}
				stroke={stroke}
				strokeLinecap={strokeLinecap}
			></path>
		</svg>
		<p className='-ml-1 w-1/3 pl-2 text-center text-xs'>{text}</p>
	</>
)

export default Booking
