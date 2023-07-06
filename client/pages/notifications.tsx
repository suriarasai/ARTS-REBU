import { LoadingScreen } from '@/components/ui/LoadingScreen'
import BottomNav from '@/components/ui/bottom-nav'
import mapStyles from '@/utils/noPoi'
import {
	GoogleMap,
	LoadScriptNext,
	useJsApiLoader,
} from '@react-google-maps/api'
import { useCallback, useState } from 'react'

const libraries = ['places', 'geometry']
let directionsDisplay

const Notifications = () => {
	const [map, setMap] = useState(/** @type google.maps.Map */ null)

	const loadMap = useCallback(function callback(map) {
		setMap(map)
		mapStyles(map, false)
		renderDirections(
			map,
			{ lat: 1.2929767719001972, lng: 103.85036111494576 },
			{ lat: 1.30383257124474, lng: 103.86183489944777 }
		)
	}, [])

	return (
		<>
			<div className='absolute left-0 top-0 h-full w-full'>
				<LoadScriptNext
					googleMapsApiKey='AIzaSyB47Udo8JGZJC7kIphClxu1SqHCEEVuw5s'
					loadingElement={<LoadingScreen />}
					// @ts-ignore
					libraries={libraries}
				>
					<GoogleMap
						center={{ lat: 1.2952078, lng: 103.773675 }}
						zoom={15}
						mapContainerStyle={{ width: '100%', height: '100%' }}
						options={{
							zoomControl: false,
							streetViewControl: false,
							mapTypeControl: false,
							fullscreenControl: false,
							minZoom: 3,
						}}
						onLoad={loadMap}
					></GoogleMap>
				</LoadScriptNext>
			</div>
			<BottomNav />
		</>
	)
}

const getDirections = (origin, destination) => {
	return fetch(
		`https://routes.googleapis.com/directions/v2:computeRoutes/json?origin=${origin}&destination=${destination}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
	).then((res) => res.json())
}

enum polylineTrafficColors {
	NORMAL = "#22c55e",
	SLOW = "#fcd34d",
	TRAFFIC_JAM = "#ef4444"
}

export const renderDirections = async (map, origin, destination) => {
	const path = google.maps.geometry.encoding.decodePath(
		'uo~Fq}|xRpBS`AO^Md@SJMnBkAx@g@r@]rDsBt@g@f@]PAZCHJb@j@xAhB^d@~@nA`A|AV`@n@dAtAlCVd@Tb@l@_@tAy@RWBS?QeIiMqDaGqImO_GmKi@{AYsAKuASiIQeFOcAK]OYUc@MQQM[_@e@[}Ao@Hm@xBiHvAoFt@}BZw@n@gAd@o@`@q@Ve@PWz@iA\\i@v@y@`AiAjBiBhBeAx@]pAUx@GvASREhC_BVMZYj@Kj@CvHRfABjC?bAFV?r@DrCBrF??XPjAXfAAxIHtFRpK^pJFfAPl@Xl@d@v@f@f@`@ZpAl@dBj@hCl@fALr@B|@HdA@z@E~@OrCy@hB{@`@SpCwBbDkC|@q@t@e@|Am@pA]`BUpAErAFhALhARbBf@bBx@rAdAzAbBtCxD~AdCh\\bg@|C|EjIhN~LtRtBrDpChFRn@Jd@\\lCDbAAz@IvAWfB]nAcA|BcF~IwC|Eu@xAU\\g@vA_@dBMrAAjABhAL|@Pt@`AvChBjEXlAL`BA|@o@|IGbC@hG'
	)
	console.log('Path length', path.length)
	const intervals = route.routes[0].travelAdvisory.speedReadingIntervals
	let routePolyline = []

	intervals.map((segment, index) => {
		const segmentPolyline = new google.maps.Polyline({
			path: path.slice(segment.startPolylinePointIndex, segment.endPolylinePointIndex+1),
			strokeColor: polylineTrafficColors[segment.speed],
			strokeOpacity: 1,
			strokeWeight: 6,
		})
		segmentPolyline.setMap(map)

		routePolyline.push(segmentPolyline)
	})
}

const route = {
	routes: [
		{
			distanceMeters: 11631,
			duration: '855s',
			polyline: {
				encodedPolyline:
					'uo~Fq}|xRpBS`AO^Md@SJMnBkAx@g@r@]rDsBt@g@f@]PAZCHJb@j@xAhB^d@~@nA`A|AV`@n@dAtAlCVd@Tb@l@_@tAy@RWBS?QeIiMqDaGqImO_GmKi@{AYsAKuASiIQeFOcAK]OYUc@MQQM[_@e@[}Ao@Hm@xBiHvAoFt@}BZw@n@gAd@o@`@q@Ve@PWz@iA\\i@v@y@`AiAjBiBhBeAx@]pAUx@GvASREhC_BVMZYj@Kj@CvHRfABjC?bAFV?r@DrCBrF??XPjAXfAAxIHtFRpK^pJFfAPl@Xl@d@v@f@f@`@ZpAl@dBj@hCl@fALr@B|@HdA@z@E~@OrCy@hB{@`@SpCwBbDkC|@q@t@e@|Am@pA]`BUpAErAFhALhARbBf@bBx@rAdAzAbBtCxD~AdCh\\bg@|C|EjIhN~LtRtBrDpChFRn@Jd@\\lCDbAAz@IvAWfB]nAcA|BcF~IwC|Eu@xAU\\g@vA_@dBMrAAjABhAL|@Pt@`AvChBjEXlAL`BA|@o@|IGbC@hG',
			},
			travelAdvisory: {
				speedReadingIntervals: [
					{
						startPolylinePointIndex: 0,
						endPolylinePointIndex: 10,
						speed: 'NORMAL',
					},
					{
						startPolylinePointIndex: 10,
						endPolylinePointIndex: 14,
						speed: 'SLOW',
					},
					{
						startPolylinePointIndex: 14,
						endPolylinePointIndex: 16,
						speed: 'NORMAL',
					},
					{
						startPolylinePointIndex: 16,
						endPolylinePointIndex: 19,
						speed: 'SLOW',
					},
					{
						startPolylinePointIndex: 19,
						endPolylinePointIndex: 20,
						speed: 'NORMAL',
					},
					{
						startPolylinePointIndex: 20,
						endPolylinePointIndex: 23,
						speed: 'SLOW',
					},
					{
						startPolylinePointIndex: 23,
						endPolylinePointIndex: 24,
						speed: 'NORMAL',
					},
					{
						startPolylinePointIndex: 24,
						endPolylinePointIndex: 25,
						speed: 'SLOW',
					},
					{
						startPolylinePointIndex: 25,
						endPolylinePointIndex: 41,
						speed: 'NORMAL',
					},
					{
						startPolylinePointIndex: 41,
						endPolylinePointIndex: 47,
						speed: 'SLOW',
					},
					{
						startPolylinePointIndex: 47,
						endPolylinePointIndex: 55,
						speed: 'NORMAL',
					},
					{
						startPolylinePointIndex: 55,
						endPolylinePointIndex: 56,
						speed: 'SLOW',
					},
					{
						startPolylinePointIndex: 56,
						endPolylinePointIndex: 59,
						speed: 'NORMAL',
					},
					{
						startPolylinePointIndex: 59,
						endPolylinePointIndex: 60,
						speed: 'SLOW',
					},
					{
						startPolylinePointIndex: 60,
						endPolylinePointIndex: 157,
						speed: 'NORMAL',
					},
				],
			},
		},
	],
}

export default Notifications
