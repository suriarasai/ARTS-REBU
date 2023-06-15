export function noPoi(visible) {
	/* Google Maps custom styling to hide/show points of interest
	 * Used by: togglePoiButton, Booking
	 *
	 * @param visible	: toggle the visibility of POIs
	 */
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
	]
}
