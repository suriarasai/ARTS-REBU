import { FaPlusCircle, FaPlusSquare } from 'react-icons/fa'
import { BackButton } from '@/components/booking/backButton'
import { InputCurrentLocation } from './InputCurrentLocation'
import { InputDestinationLocation } from './InputDestinationLocation'
import { HideTaxis } from '@/utils/hideTaxis'

export function LocationSearch(
	setMarker,
	expandSearch: number,
	setExpandSearch,
	originRef,
	setOrigin,
	isValidInput,
	destinationRef,
	setDestination,
	calculateRoute
	// setOriginAutocomplete,
	// setDestinationAutocomplete
) {
	return (
		<div className='location-search-header'>
			{/* <div
				className='w-1/12'
				onClick={() => {
					setMarker(null);
					HideTaxis();
				}}
			>
				<BackButton
					expandSearch={expandSearch}
					setExpandSearch={setExpandSearch} />
			</div> */}
			<div className='relative w-full px-6 pt-2'>
				<div className='pr-12'>
					{/* Origin Search */}
					{InputCurrentLocation(
						setExpandSearch,
						originRef,
						setOrigin,
						isValidInput
					)}

					<hr className='mb-1 ml-auto mr-auto mt-1 bg-zinc-300' />

					{/* Destination Search */}
					{InputDestinationLocation(
						setExpandSearch,
						destinationRef,
						setDestination,
						isValidInput
					)}
				</div>
				<div className='absolute bottom-0 right-0 text-3xl mr-6 mb-2 text-green-600'>
					<FaPlusCircle onClick={() => {}} />
				</div>
			</div>
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
		</div>
	)
}
