import { addMarker } from '@/components/common/addMarker';

// Loads the nearest N taxis onto the map
export const loadTaxis = (map, N = 10, _callback = () => {}) => {
	fetch('https://api.data.gov.sg/v1/transport/taxi-availability')
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			const coordinates = data.features[0].geometry.coordinates;
			const distances = [];
			const coord = map.current?.getSource('from')._data.features[0].geometry.coordinates;

			coordinates.forEach(([a, b]) => distances.push([
				Math.pow(a - coord[0], 2) + Math.pow(b - coord[1], 2),
				a,
				b,
			])
			);
			distances.sort();
			for (let i = 0; i < N; i++) {
				addMarker(map, distances[i].slice(1, 3), 'taxis' + i);
				_callback()
			}
		});
};
