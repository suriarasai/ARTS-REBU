import taxiStops from '@/resources/taxi-stops'

export function loadNearbyTaxiStops(
	map: google.maps.Map,
	position: number[],
	setNearbyTaxiStops: Function
) {
	const distances: [number, number, number][] = []

	taxiStops.forEach(([a, b]: any) =>
		distances.push([
			Math.pow(a - position[0], 2) + Math.pow(b - position[1], 2),
			a,
			b,
		])
	)

	// Sorting the distances
	distances.sort()
	let coords
	let newTaxi
	let nearbyTaxiStops = []

	for (let i = 0; i < 5; i++) {
		coords = distances[i].slice(1, 3)
		newTaxi = new google.maps.Marker({
			map: map,
			position: { lat: coords[1], lng: coords[0] },
			icon: {
				url: 'https://www.svgrepo.com/show/375861/pin2.svg',
				scaledSize: new google.maps.Size(20, 20),
			},
		})
		nearbyTaxiStops.push(newTaxi)
	}

	setNearbyTaxiStops(nearbyTaxiStops)
}
