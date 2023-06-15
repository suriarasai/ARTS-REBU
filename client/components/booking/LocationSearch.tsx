import { FaPlusSquare } from 'react-icons/fa';
import { BackButton } from '@/components/booking/backButton';
import { InputCurrentLocation } from './InputCurrentLocation';
import { InputDestinationLocation } from './InputDestinationLocation';
import { HideTaxis } from '@/utils/hideTaxis';

export function LocationSearch(
	setMarker,
	expandSearch: number,
	setExpandSearch,
	originRef,
	setOrigin,
	isValidInput,
	destinationRef,
	setDestination
	// setOriginAutocomplete,
	// setDestinationAutocomplete
) {
	return (
		<div className='sticky top-0 z-10 flex w-screen flex-wrap bg-white p-2 shadow-md'>
			<div
				className='w-1/12'
				onClick={() => {
					setMarker(null);
					HideTaxis();
				}}
			>
				<BackButton
					expandSearch={expandSearch}
					setExpandSearch={setExpandSearch} />
			</div>
			<div className='w-10/12'>
				{/* Origin Search */}
				{InputCurrentLocation(
					setExpandSearch,
					originRef,
					setOrigin,
					isValidInput
					// setOriginAutocomplete
				)}

				{/* Destination Search */}
				{InputDestinationLocation(
					setExpandSearch,
					destinationRef,
					setDestination,
					isValidInput
					// setDestinationAutocomplete
				)}
			</div>
			<div className='justify-bottom flex w-1/12 items-end p-3 pb-2 text-2xl text-green-500'>
				<FaPlusSquare onClick={() => { }} />
			</div>
		</div>
	);
}
