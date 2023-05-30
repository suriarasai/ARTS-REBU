// Notifications page for informing the user

import React, { useState, useEffect, useRef, useContext } from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'

const containerStyle = {
	width: '400px',
	height: '400px',
}

const center = {
	lat: 1.2981255,
	lng: 103.7729178,
}

import Page from '@/components/ui/page'
import Section from '@/components/ui/section'
// import { useSelector, useDispatch } from 'react-redux'
// import { decrement, increment } from '@/redux/reducers'

const Notifications = () => {
	// const count = useSelector((state: any) => state.counter.value)
	// const dispatch = useDispatch()

	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: 'AIzaSyBlLkgcqDfwG3deUqF0mNhNVXqK00n2e4c',
	})

	const [map, setMap] = React.useState(null)

	const onLoad = React.useCallback(function callback(map) {
		// This is just an example of getting and using the map instance!!! don't just blindly copy!
		const bounds = new window.google.maps.LatLngBounds(center)
		map.fitBounds(bounds)

		setMap(map)
	}, [])

	const onUnmount = React.useCallback(function callback(map) {
		setMap(null)
	}, [])

	return (
		<div title='Notifications'>
			{isLoaded ? (
				<div className='h-full w-full'>
					<GoogleMap
						mapContainerStyle={containerStyle}
						center={center}
						zoom={14}
						onLoad={onLoad}
						onUnmount={onUnmount}
						id='map-canvas'
					>
						{/* Child components, such as markers, info windows, etc. */}
						<></>
					</GoogleMap>
				</div>
			) : (
				<></>
			)}
		</div>
	)
}

export default React.memo(Notifications)
