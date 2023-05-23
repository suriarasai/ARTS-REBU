export const getCoords = (map, label) => {
	return map.current?.getSource(label)._data.features[0].geometry.coordinates;
};
