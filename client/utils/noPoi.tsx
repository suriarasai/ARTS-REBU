
export function noPoi(visible) {
	return [
		{
			featureType: 'poi',
			elementType: 'labels',
			stylers: [
				{
					visibility: visible ? 'on' : 'off',
				},
			],
		},
	];
}
