import Styles from '@/styles/maps.json'

function noPoi(visible) {
	/* Google Maps custom styling to hide/show points of interest
	 * Used by: togglePoiButton, Booking
	 *
	 * @param visible	: toggle the visibility of POIs
	 */
	return [
		...Styles,
		{
			featureType: 'poi',
			elementType: 'labels',
			stylers: [
				{
					visibility: visible ? 'on' : 'off',
				},
			],
		},
		{
			"featureType": "all",
			"elementType": "labels.text",
			"stylers": [
				{
					"color": "#878787"
				}
			]
		},
		{
			"featureType": "all",
			"elementType": "labels.text.stroke",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
	]
}

export default function mapStyles(map, poi) {
	map.setOptions({
		styles: noPoi(!poi),
		zoomControl: false,
		streetViewControl: false,
		mapTypeControl: false,
		fullscreenControl: false,
		minZoom: 3,
	})
}
