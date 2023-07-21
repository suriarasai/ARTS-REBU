import { Location, option } from '@/types'
import { formatCreditCardNumber } from '@/utils/formatCreditCardNumber'
import { selectedCardAtom } from '@/utils/state'
import {
	FaDollarSign,
	FaSearchLocation,
	FaShare,
	FaShareAlt,
	FaShieldAlt,
	FaStar,
} from 'react-icons/fa'
import { useRecoilValue } from 'recoil'

export const LiveTripUI = ({
	data,
	option,
	onCancel,
	set,
}: {
	data: { destination: Location; origin: Location }
	option: option
	onCancel: Function
	set: Function
}): React.ReactNode => {
	const selectedCard = useRecoilValue(selectedCardAtom)
	return (
		<>
			<div className='flex items-center border-b border-zinc-200 pb-3 pt-3'>
				<FaSearchLocation className='mr-5 text-green-500' />
				<div className='flex flex-col'>
					<p className='font-medium'>{data.destination.address}</p>
				</div>
				<div className='ml-auto flex items-center text-green-500'>
					Add or Change
				</div>
			</div>
			<div className='flex items-center border-b border-zinc-200 pb-3 pt-3'>
				<FaStar className='mr-5 text-green-500' />
				How's your ride going?
				<div className='ml-auto flex items-center text-green-500'>
					Rate or tip
				</div>
			</div>
			<div className='flex items-center border-b border-zinc-200 pb-3 pt-3'>
				<FaDollarSign className='mr-5 text-green-500' />
				<div className='flex flex-col'>
					<p className='font-medium'>{option.fare}</p>
					<p className='text-sm'>
						{selectedCard === 'Cash'
							? 'Cash'
							: 'VISA ' + formatCreditCardNumber(selectedCard.toString())}
					</p>
				</div>
				<div
					className='ml-auto flex items-center text-green-500'
					onClick={() => set(true)}
				>
					Switch
				</div>
			</div>
			<div className='flex items-center border-b border-zinc-200 pb-3 pt-3'>
				<FaShare className='mr-5 text-green-500' />
				Sharing with someone?
				<div className='ml-auto flex items-center text-green-500'>
					Split Fare
				</div>
			</div>
			<div className='flex items-center border-b border-zinc-200 pb-3 pt-3'>
				<FaShareAlt className='mr-5 text-green-500' />
				Share trip status
				<div className='ml-auto flex items-center text-green-500'>Share</div>
			</div>
			<div className='inline-flex w-full'>
				<button
					className='w-1/2 border-r border-zinc-300 px-4 py-2 py-3 text-red-600 hover:text-red-800'
					onClick={() => onCancel(true)}
				>
					Cancel
				</button>
				<button className='flex w-1/2 items-center justify-center px-4 py-2 py-3 text-green-500 hover:text-green-800'>
					<FaShieldAlt className='mr-3' /> Safety
				</button>
			</div>
		</>
	)
}