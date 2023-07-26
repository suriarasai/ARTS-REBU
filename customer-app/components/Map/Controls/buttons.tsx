import { poiAtom } from '@/utils/state';
import { FaMapMarkedAlt, FaLocationArrow } from 'react-icons/fa';
import { useRecoilState } from 'recoil';
import mapStyles from '../utils/poi';


export function TogglePOI({ map }) {
	const [poi, setPoi] = useRecoilState<boolean>(poiAtom)

	const handleClick = () => {
		mapStyles(map, !poi)
		setPoi(!poi)
	}

	return (
		<div className='map-control-button' onClick={handleClick}>
			<FaMapMarkedAlt className='text-xl text-white' />
		</div>
	)
}
export function PanToCurrentLocation({ map }) {
	const handleClick = () => {
		navigator.geolocation.getCurrentPosition((position) => {
			map.panTo({
				lat: position.coords.latitude,
				lng: position.coords.longitude,
			})
			map.setZoom(18)
		})
	}

	return (
		<div className='map-control-button' onClick={handleClick}>
			<FaLocationArrow className='text-xl text-white' />
		</div>
	)
}
