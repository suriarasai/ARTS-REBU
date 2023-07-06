import { FaMapMarkedAlt } from 'react-icons/fa'
import mapStyles from '@/utils/noPoi'
import setMarkerVisibility from '@/utils/setMarkerVisibility'
import { loadNearbyTaxiStops } from './loadNearbyTaxiStops'

const TogglePOI = ({
	map,
	poi,
	setPoi,
	origin,
	setNearbyTaxiStops,
	nearbyTaxiStops,
}) => {
	function handleClick() {
		mapStyles(map, !poi)
		setPoi(!poi)
		setMarkerVisibility(nearbyTaxiStops)
		poi && loadNearbyTaxiStops(map, [origin.lng, origin.lat], setNearbyTaxiStops)
	}

	return (
		<div
			className='absolute bottom-0 right-0 z-50 m-8 mb-48 flex h-12 w-12 items-center justify-center rounded-full bg-green-600 shadow-lg'
			onClick={handleClick}
		>
			<FaMapMarkedAlt className='text-xl text-white' />
		</div>
	)
}

export default TogglePOI


