import { Dispatch } from './Dispatch'
import { Arrival } from './Arrival'
import { Matching } from './Matching'

import {
	arrivalAtom,
	bookingAtom,
	destinationAtom,
	originAtom,
	screenAtom,
	searchTypeAtom,
	tripStatsAtom,
	userLocationAtom,
} from '@/state'
import { useRecoilState, useRecoilValue } from 'recoil'
import { TaxiSelection } from './Selection'
import { CancelTripButton } from '@/components/Map/Controls/buttons'
import Receipt from '@/components/Map/TripScreens/Arrival/Receipt'
import { ETA } from '@/components/Map/TripScreens/Dispatch/ETA'
import { ProximityNotifications } from '@/components/Map/TripScreens/Dispatch/ProximityNotifications'
import { RouteDetails } from '@/components/Map/TripScreens/Selection/routeDetails'
import { setOriginToUserLocation } from '@/components/Map/utils/calculations'
import { toggleMarkers } from '@/components/Map/utils/markers'
import { renderDirections } from '@/components/Map/utils/viewport'
import { rescaleMap } from '@/components/Map/utils/viewport'
import { getDirections } from '@/server'
import { useEffect, useState } from 'react'

export function TripScreens({ map, polyline }) {
	const screen = useRecoilValue(screenAtom)
	return (
		<>
			{screen === 'select' ? (
				<TaxiSelection map={map} />
			) : screen === 'match' ? (
				<Matching />
			) : screen === 'dispatch' ? (
				<Dispatch map={map} />
			) : screen === 'arrival' ? (
				<Arrival map={map} polyline={polyline} />
			) : null}
		</>
	)
}
export function Trip({ map }) {
	const origin = useRecoilValue(originAtom)
	const userLocation = useRecoilValue(userLocationAtom)
	const dest = useRecoilValue(destinationAtom)
	const [polyline, setPolyline] = useState()
	const [, setTripStats] = useRecoilState(tripStatsAtom)
	const [, setSearchType] = useRecoilState(searchTypeAtom)
	const booking = useRecoilValue(bookingAtom)
	const arrived = useRecoilValue(arrivalAtom)
	const [screen, setScreen] = useRecoilState<string>(screenAtom) // 'select' | 'match' | 'dispatch' | 'arrival' | ''
	const [collapse, setCollapse] = useState(false)

	useEffect(() => {
		// Place the origin marker to the user's location if no origin was input
		!origin.address && setOriginToUserLocation(map, userLocation)

		// onLoad: Send location and request to TBS to locate nearby taxis
		// onLoad: Compute and render routes
		getDirections(origin.address ? origin : userLocation, dest, (res) => {
			setTripStats({
				distance: res.distanceMeters,
				duration: Number(res.duration.match(/\d+/)[0]),
				route: google.maps.geometry.encoding.decodePath(
					res.polyline.encodedPolyline
				),
			})
			rescaleMap(
				map,
				google.maps.geometry.encoding.decodePath(
					res.polyline.encodedPolyline
				) as []
			)
			renderDirections(map, res, setPolyline)
		})

		// onLoad: Hide/show the appropriate markers
		toggleMarkers()

		setScreen('select')
		setSearchType(0)
	}, [])

	const handleCollapse = () => setCollapse(!collapse)

	return (
		<>
			{!['receipt', 'arrival'].includes(screen) && (
				<CancelTripButton map={map} polyline={polyline} />
			)}
			{screen === 'select' && <RouteDetails />}
			<ProximityNotifications />
			{screen === 'dispatch' && !arrived && <ETA />}
			{screen === 'receipt' && (
				<Receipt
					bookingID={booking.bookingID}
					setScreen={() => setScreen('arrival')}
				/>
			)}

			<div className='w-screen-md-max absolute bottom-0 left-0 right-0 ml-auto mr-auto w-5/6 rounded-t-lg bg-gray-700 shadow-sm'>
				<hr
					className='my-1.5 ml-auto mr-auto w-40 rounded-full border-2 border-zinc-400'
					onClick={handleCollapse}
				/>
				<div className={collapse ? 'hidden' : ''}>
					<TripScreens map={map} polyline={polyline} />
				</div>
			</div>
		</>
	)
}
