import { FaPlusCircle } from 'react-icons/fa'
import { BackButton } from '@/components/booking/backButton'
import { InputCurrentLocation } from './InputCurrentLocation'
import { InputDestinationLocation } from './InputDestinationLocation'
import { searchTypeAtom } from '@/state'
import { useRecoilState } from 'recoil'

export const LocationSearch = ({
	originRef,
	isValidInput,
	destinationRef,
	calculateRoute,
	validInput,
}: {
	originRef: React.Ref<HTMLInputElement>
	isValidInput: React.Dispatch<React.SetStateAction<boolean>>
	destinationRef: React.Ref<HTMLInputElement>
	calculateRoute: React.MouseEventHandler<HTMLButtonElement>
	validInput: boolean
}) => {
	const [searchType, setSearchType] = useRecoilState(searchTypeAtom)
	return (
		<div className='location-search-header'>
			{searchType !== 0 && (
				<div className='absolute left-0 top-0 z-50 ml-1 mt-5'>
					<BackButton searchType={searchType} setSearchType={setSearchType} />
				</div>
			)}
			<div className='relative w-full px-6 pl-10 pt-2'>
				<div className='pr-12'>
					{/* Origin Search */}
					<InputCurrentLocation
						originRef={originRef}
						isValidInput={isValidInput}
					/>

					<hr className='mb-1 ml-auto mr-auto mt-1 bg-zinc-300' />

					{/* Destination Search */}
					<InputDestinationLocation
						destinationRef={destinationRef}
						isValidInput={isValidInput}
					/>
				</div>
				<div className='absolute bottom-0 right-0 mb-2 mr-6 text-3xl text-green-600'>
					<FaPlusCircle onClick={() => {}} />
				</div>
			</div>

			{validInput && (
				<div className='w-full px-6 py-3'>
					<div className='flex w-full justify-center'>
						<button
							className='directions-button'
							type='submit'
							onClick={calculateRoute}
						>
							<p className='font-normal'>Calculate Routes</p>
						</button>
					</div>
				</div>
			)}
		</div>
	)
}
