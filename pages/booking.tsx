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
	const [zoom, setZoom] = useState(11)

	const [toLocation, setToLocation] = useState(false)
	const [fromLocation, setFromLocation] = useState(false)
	const [searchQueryVisible, setSearchQueryVisible] = useState(false)

	useEffect(() => {
		if (map.current) return // initialize map only once
		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: 'mapbox://styles/mapbox/light-v11',
			center: [lng, lat],
			zoom: zoom,
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
							// map={mapContainer}
							// theme={{
							// 	variables: {
							// 		padding: '0.75rem 0.75rem 1rem 1rem',
							// 		spacing: '0.75rem',
							// 		colorBackground: '#E5E7EB',
							// 		colorText: '#374151',
							// 		lineHeight: '1.25',
							// 		borderRadius: '0.25rem',
							// 		border: '1px #E5E7EB',
							// 		boxShadow:
							// 			'0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
							// 	},
							// }}
							// className='location-search-button'
							value='Your location'
							// onFocus={() => {
							// 	setSearchQueryVisible(true), setFromLocation(true)
							// }}
							// onBlur={() => {
							// 	setSearchQueryVisible(false), setFromLocation(false)
							// }}
						/>
					</div>
					<div className={`map-search-box ${fromLocation ? 'hidden' : null}`}>
						<input
							key='location-search-button'
							type='text'
							autoComplete='street-address'
							placeholder='Choose a destination...'
							onFocus={() => {
								setSearchQueryVisible(true), setToLocation(true)
							}}
							onBlur={() => {
								setSearchQueryVisible(false), setToLocation(false)
							}}
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
