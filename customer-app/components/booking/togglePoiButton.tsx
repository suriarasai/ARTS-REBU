import { FaMapMarkedAlt } from 'react-icons/fa'
import mapStyles from '@/utils/noPoi'
import setMarkerVisibility from '@/utils/setMarkerVisibility'
import { loadNearbyTaxiStops } from './loadNearbyTaxiStops'
import { Location } from '@/types'

const TogglePOI = ({
	map,
	poi,
	setPoi,
	origin,
	setNearbyTaxiStops,
	nearbyTaxiStops,
}: {
	map: google.maps.Map
	poi: boolean
	setPoi: React.Dispatch<React.SetStateAction<boolean>>
	origin: Location
	setNearbyTaxiStops: Function
	nearbyTaxiStops: Array<google.maps.Marker>
}) => {
	function handleClick() {
		mapStyles(map, !poi)
		setPoi(!poi)
		setMarkerVisibility(nearbyTaxiStops)
		poi &&
			loadNearbyTaxiStops(map, [origin.lng!, origin.lat!], setNearbyTaxiStops)
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
