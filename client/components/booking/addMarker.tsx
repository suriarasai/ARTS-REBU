import mapboxgl from 'mapbox-gl'

// Add a location pin on the map
export const addMarker = (
	map: mapboxgl.Map | any,
	coords: Array<number>,
	label: string,
	type = 'Point'
) => {
	/*
		coords	: the [longitude, latitude] to place the pin
		label	: the layer ID (must be unique)
	*/
	if (!map.current?.getLayer(label)) {
		map.current?.addLayer({
			id: label,
			type: 'circle',
			source: {
				type: 'geojson',
				data: geojson(coords, type),
			},
			paint: {
				'circle-radius': 4,
				'circle-color':
					label === 'from' ? '#0891b2' : label === 'to' ? '#f30' : '#000',
			},
		})
		// If the label already exists, then overwrite it
	} else {
		map.current?.getSource(label).setData(geojson(coords))
	}
	const marker = new mapboxgl.Marker({color: "#FFFFFF"}).setLngLat([103.7636757, 1.2988975]).addTo(map.current)
}

// Function to overlay a coordinate layer on the map (ex. map pins)
export const geojson = (coords: Array<number>, type = 'Point') => {
	return {
		type: 'FeatureCollection',
		features: [
			{
				type: 'Feature',
				properties: {},
				geometry: {
					type: type,
					coordinates: coords,
				},
			},
		],
	}
}
