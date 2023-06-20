import { FaLocationArrow } from 'react-icons/fa'

export function Locate({ map }) {
	return (
		<div
			className='absolute bottom-0 right-0 m-8 mb-28 flex h-12 w-12 items-center shadow-lg justify-center rounded-full bg-green-600'
			onClick={() => {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						map.panTo({
							lat: position.coords.latitude,
							lng: position.coords.longitude,
						})
						map.setZoom(18)
					},
					() => null
				)
			}}
		>
			<FaLocationArrow className='text-xl text-white' />
		</div>
	)
}
