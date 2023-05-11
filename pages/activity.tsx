// Displays user activity (ex. booked rides, reviews)

import React, { useRef, useEffect, useState } from 'react'
import Page from '@/components/page'
import Section from '@/components/section'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken =
	'pk.eyJ1IjoiaXNzdjM3NCIsImEiOiJjbGhpdnRwbnAwYzA5M2pwNTN3ZzE1czk3In0.tfjsg4-ZXDxsMDuoyu_-SQ'

const Activity = () => {
	const mapContainer = useRef(null)
	const map = useRef(null)
	const [lng, setLng] = useState(103.776958)
	const [lat, setLat] = useState(1.29368)
	const [zoom, setZoom] = useState(12)

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
		<Page title='Activity'>
			<Section>
				<div ref={mapContainer} className='map-container' />
				<div className='absolute lg:w-6/12 w-11/12'>
					{/* Search Bar input fields */}
					<input
						className='mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-200 py-3 px-4 leading-tight text-gray-700 shadow-xl focus:bg-white focus:outline-none'
						type='text'
						placeholder='Your location'
					/>
					<input
						className='mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-200 py-3 px-4 leading-tight text-gray-700 shadow-xl focus:bg-white focus:outline-none'
						type='text'
						placeholder='Choose a destination...'
					/>
				</div>
			</Section>
		</Page>
	)
}

export default Activity
