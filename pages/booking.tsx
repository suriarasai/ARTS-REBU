// Main hub for booking rides

// Displays user activity (ex. booked rides, reviews)

import React, { useRef, useEffect, useState } from 'react'
import Page from '@/components/page'
import Section from '@/components/section'
import mapboxgl from 'mapbox-gl'
import { AddressAutofill, SearchBox } from '@mapbox/search-js-react'
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
			map.current = new mapboxgl.Map({
				container: mapContainer.current,
				style: 'mapbox://styles/mapbox/light-v11',
				center: [position.coords.longitude, position.coords.latitude],
				zoom: zoom,
			})
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
