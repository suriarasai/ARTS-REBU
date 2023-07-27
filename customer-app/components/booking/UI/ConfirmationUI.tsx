import { Location, option, optionsInterface } from '@/types'
import { clickedOptionAtom } from '@/state'
import { FaCrosshairs, FaFontAwesomeFlag } from 'react-icons/fa'
import { useRecoilState } from 'recoil'

export const RouteConfirmation = ({
	data,
}: {
	data: { origin: Location; destination: Location }
}) => (
	<table className='mb-5'>
		<tbody className='mb-3 pb-2 pl-2'>
			<tr className='flex items-center'>
				<th className='p-1 text-right'>
					<FaCrosshairs className='text-xl text-green-500' />
				</th>
				<th className='text-left'>
					<p className='p-2 text-sm'>
						<b>{data.origin.placeName}</b>, Singapore {data.origin.postcode}
					</p>
				</th>
			</tr>
			<tr className='flex items-center'>
				<th className='p-1 text-right'>
					<FaFontAwesomeFlag className='text-xl text-green-500' />
				</th>
				<th className='text-left'>
					<p className='p-2 text-sm'>
						<b>{data.destination.placeName}</b>, Singapore{' '}
						{data.destination.postcode}
					</p>
				</th>
			</tr>
		</tbody>
	</table>
)

export const ShowOption = ({
	option,
	disabled = false,
}: {
	option: option
	disabled?: boolean
}) => {
	const [, setClickedOption] = useRecoilState<number | null>(clickedOptionAtom)
	return (
		/*
		option				: the ride option
	*/
		<div
			className={`ride-option ${disabled ? 'pointer-events-none' : ''}`}
			key={option.id}
			onClick={() => setClickedOption(option.id)}
		>
			<div className='float-left items-center p-2 pr-4 text-2xl text-green-500'>
				{/* @ts-ignore */}
				{option.icon}
			</div>
			<div className='float-left'>
				<b>{option.taxiType}</b>
				<p className='text-sm'>
					{/* @ts-ignore */}
					1-{option.taxiPassengerCapacity} seats ({option.desc})
				</p>
			</div>
			<div className='float-right mr-8'>
				<b className='text-lg'>${option.fare}</b>
				<p className='text-sm'>
					<span className='float-right'>
						{option.taxiETA}
						{' min.'}
					</span>
				</p>
			</div>
		</div>
	)
}
