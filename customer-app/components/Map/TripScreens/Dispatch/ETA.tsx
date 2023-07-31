import { etaCounterAtom } from '@/state';
import { useRecoilValue } from 'recoil';


export function ETA() {
	const etaCounter = useRecoilValue(etaCounterAtom)

	return (
		<div className='absolute left-0 right-0 top-0 ml-auto mr-auto flex w-1/2 items-center rounded-b-md bg-gray-700 p-2'>
			<p className='pl-4 text-zinc-100'>Taxi is arriving in </p>
			<div className='!ml-auto h-12 w-12 items-center justify-center rounded-md bg-green-200 p-2 text-center text-gray-700'>
				<b>{etaCounter}</b>
				<p className='-mt-1 text-xs font-normal text-zinc-400'>min</p>
			</div>
		</div>
	)
}
