import { FaMapMarkedAlt } from 'react-icons/fa'
import mapStyles from '@/utils/noPoi'

export function togglePOI(map: any, poi: boolean, setPoi) {
	return (
		<div
			className='absolute bottom-0 right-0 z-50 m-8 mb-48 flex h-12 w-12 items-center justify-center rounded-full bg-green-600 shadow-lg'
			onClick={() => {
				mapStyles(map, !poi)
				setPoi(!poi)
			}}
		>
			<FaMapMarkedAlt className='text-xl text-white' />
		</div>
	)
}
