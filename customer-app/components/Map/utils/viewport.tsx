import { polylineTrafficColors } from '@/constants'

export function rescaleMap(map: google.maps.Map, polyline: []) {
	let bounds = new google.maps.LatLngBounds()
	for (let i = 0; i < polyline.length; i++) {
		bounds.extend(polyline[i])
	}
	map.fitBounds(bounds)
	map.setZoom(map.getZoom() - 1)
}

export const renderDirections = async (
	map: google.maps.Map,
	encodedPath: any,
	setPolyline: any
) => {
	const path = google.maps.geometry.encoding.decodePath(
		encodedPath.polyline.encodedPolyline
	)

	const intervals = encodedPath.travelAdvisory.speedReadingIntervals
	let routePolyline: google.maps.Polyline[] = []

	intervals.map((segment: any) => {
		const segmentPolyline = new google.maps.Polyline({
			path: path.slice(
				segment.startPolylinePointIndex,
				segment.endPolylinePointIndex + 1
			),
			strokeColor: (polylineTrafficColors as any)[segment.speed],
			strokeOpacity: 1,
			strokeWeight: 6,
		})
		segmentPolyline.setMap(map)

		routePolyline.push(segmentPolyline)
	})

	setPolyline(routePolyline)
}
