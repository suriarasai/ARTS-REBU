export const getCoords = (map: mapboxgl.Map | any, label: string) => {
	return map.current?.getSource(label)._data.features[0].geometry.coordinates;
};
