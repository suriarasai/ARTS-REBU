import { polylineTrafficColors } from "@/redux/types/constants";


export const renderDirections = async (map, encodedPath, setPolyline) => {
	const path = google.maps.geometry.encoding.decodePath(encodedPath.polyline.encodedPolyline);

	const intervals = encodedPath.travelAdvisory.speedReadingIntervals;
	let routePolyline = [];

	intervals.map((segment) => {
		const segmentPolyline = new google.maps.Polyline({
			path: path.slice(
				segment.startPolylinePointIndex,
				segment.endPolylinePointIndex + 1
			),
			strokeColor: polylineTrafficColors[segment.speed],
			strokeOpacity: 1,
			strokeWeight: 6,
		});
		segmentPolyline.setMap(map);

		routePolyline.push(segmentPolyline);
	});

	setPolyline(routePolyline)
};
