import Styles from '@/styles/maps.json'

function noPoi(hide: boolean) {
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
					visibility: hide ? 'off' : 'on',
				},
			],
		},
		{
			featureType: 'all',
			elementType: 'labels.text',
			stylers: [
				{
					color: '#878787',
				},
			],
		},
		{
			featureType: 'all',
			elementType: 'labels.text.stroke',
			stylers: [
				{
					visibility: 'off',
				},
			],
		},
	]
}

export default function mapStyles(map: google.maps.Map, poi: boolean) {
	map.setOptions({
		styles: noPoi(poi),
		zoomControl: false,
		streetViewControl: false,
		mapTypeControl: false,
		fullscreenControl: false,
		minZoom: 3,
	})
}
