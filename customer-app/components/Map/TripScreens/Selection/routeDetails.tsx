import { originAtom, destinationAtom, userLocationAtom } from '@/state'
import { useRecoilValue } from 'recoil'

export function RouteDetails() {
	const origin = useRecoilValue(originAtom)
	const destination = useRecoilValue(destinationAtom)
	const userLocation = useRecoilValue(userLocationAtom)

	return (
		<div className='responsive absolute left-0 right-0 top-0 w-5/6 space-y-4 rounded-b-lg bg-gray-700 p-4'>
			<div className='flex items-center rounded-sm bg-gray-600 text-sm text-zinc-100'>
				<label className='my-0 mr-3 w-12 bg-gray-500 p-2 text-zinc-100'>
					From
				</label>
				{origin.address
					? origin.placeName + ', ' + origin.postcode
					: userLocation.placeName + ', ' + userLocation.postcode}
			</div>
			<div className='flex items-center rounded-sm bg-gray-600 text-sm text-zinc-100'>
				<label className='my-0 mr-3 w-12 bg-gray-500 p-2 text-zinc-100'>
					To
				</label>
				{destination.placeName + ', ' + destination.postcode}
			</div>
		</div>
	)
}
