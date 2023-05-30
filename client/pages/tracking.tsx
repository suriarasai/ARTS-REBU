// Tracking page for post-confirmation process (ride tracking)
// TODO: The taxiLocator tracks the closest taxi, which can change

import React, { useState, useEffect, useRef, useContext } from 'react'
import mapboxgl from 'mapbox-gl'
import { UserContext } from '@/components/context/UserContext'
import { useRouter } from 'next/router'
import { addMarker, geojson } from '@/components/booking/addMarker'
import { loadTaxis } from '@/components/booking/loadTaxis'
import { getCoords } from '@/components/booking/getCoords'

const Tracking = () => {
	const mapContainer = useRef(null)
	const map = useRef<any>(null)
	const [lng, setLng] = useState<number>(103.7729178)
	const [lat, setLat] = useState<number>(1.2981255)
	const [zoom, setZoom] = useState<number>(14)
	const [collapsed, setCollapsed] = useState<boolean>(false)
	const { user, setUser } = useContext(UserContext)
	const router = useRouter()
	let taxiLocator: number | null = null

	mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY as string

	useEffect(() => {
		if (map.current) return // initialize map only once

		// Centers map on current location
		navigator.geolocation.getCurrentPosition((position) => {
			setLng(position.coords.longitude)
			setLat(position.coords.latitude)
		})

		// Creates the map object
		map.current = new mapboxgl.Map({
			container: mapContainer.current!,
			style: 'mapbox://styles/issv374/clhymkicc003e01rbarxs6ryv',
			zoom: zoom,
		})
	})

	// Add starting point to the map
	map.current?.on('load', () => {
		map.current?.setCenter([lng, lat])
		// addMarker(map, [lng, lat], 'current') // Current location
		addMarker(map, user.temp![0], 'from') // Starting location
		addMarker(map, [lng, lat], 'to') // Destination location
		getRoute(user.temp![0], user.temp![1], 'toDestination', '#000000')
		loadTaxis(map, 1, function () {
			getRoute(user.temp![0], getCoords(map, 'taxis0'), 'toUser', '#BC544B')
		})

		taxiLocator = window.setInterval(function () {
			loadTaxis(map, 1, function () {
				getRoute(user.temp![0], getCoords(map, 'taxis0'), 'toUser', '#BC544B')
			})
			console.log('Updated')
		}, 45000)
	})

	async function getRoute(
		start: Array<number>,
		end: Array<number>,
		id: string,
		color: string
	) {
		const query = await fetch(
			`https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
			{ method: 'GET' }
		)
		const json = await query.json()

		if (map.current?.getSource(id)) {
			map.current
				?.getSource(id)
				.setData(geojson(json.routes[0].geometry.coordinates, 'LineString'))
		} else {
			map.current?.addLayer({
				id: id,
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
					'line-color': color,
					'line-width': 3,
					'line-opacity': 0.75,
				},
			})
		}
	}

	const handleCancel = () => {
		window.clearInterval(taxiLocator!)
		router.push('/booking')
	}

	return (
		<main className='mx-auto max-w-screen-md'>
			<div ref={mapContainer} className={'map-container'} />
			<div className='absolute bottom-0 w-full bg-white md:pb-4 lg:w-7/12 lg:pb-4'>
				<div className='p-7'>
					<div
						className='flex flex-initial'
						onClick={() => setCollapsed(!collapsed)}
					>
						<label className='w-8/12 md:w-5/6'>Ride Confirmed!</label>
						<div className='w-3/12 text-sm md:w-1/6'>
							{new Date(user.tripInfo!.dropoff).toLocaleTimeString('en-US', {
								hour: 'numeric',
								minute: 'numeric',
							})}{' '}
							ETA
						</div>
						<svg
							viewBox='0 0 15 15'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
							width='15'
							height='15'
							className='w-1/12'
						>
							<path
								d='M10 1.5h3.5m0 0V5m0-3.5l-4 4m-8 4.5v3.5m0 0H5m-3.5 0l4-4'
								stroke='currentColor'
							></path>
						</svg>
					</div>

					<div className={collapsed ? 'hidden' : ''}>
						<div className='w-full'>
							Pickup at <b>{user.addr![0]}</b>
						</div>
						
						<div className='flex flex-wrap pt-3 pb-3'>
							<div className='h-auto w-3/5 text-sm md:w-3/4 lg:w-3/4'>
								<input placeholder='Pickup Notes' />
							</div>
							<div className='blue-button ml-2 h-1/5 text-center'>
								<button>Done</button>
							</div>
							<div className='blue-button ml-2 h-1/5 text-center'>
								{/* Done/Edit toggle */}
								<button>Phone</button>
							</div>
						</div>

						<div className='mt-3 w-full'>
							<label>Driver Information</label>
						</div>
						<div className='w-full'>
							Name: <b>{'Mr. Driver'}</b>
						</div>
						<div className='w-full'>
							License Plate: <b>{'SG 1234 5678'}</b>
						</div>
						<div className='flex flex-wrap'>
							<div className='w-4/5'>
								Car Description: <b>{'Black Honda Civic'}</b>
							</div>
							<button
								className='red-button float-right w-1/5'
								onClick={() => handleCancel()}
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}

export default Tracking
