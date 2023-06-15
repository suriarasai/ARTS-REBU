import { Autocomplete } from '@react-google-maps/api';
import { FaFontAwesomeFlag } from 'react-icons/fa';

export function InputDestinationLocation(
	setExpandSearch,
	destinationRef,
	setDestination,
	isValidInput
	// setDestinationAutocomplete
) {
	return (
		<div className='destination'>
			<Autocomplete
				// onLoad={(e) => setDestinationAutocomplete(e)}
				onPlaceChanged={() => setExpandSearch(0)}
				options={{ componentRestrictions: { country: 'sg' } }}
				fields={['address_components', 'geometry', 'formatted_address']}
			>
				<input
					type='text'
					className='rounded-sm border-none bg-zinc-100 px-3 py-2 pl-10 leading-tight shadow-none'
					placeholder='Destination'
					ref={destinationRef}
					// value={destination}
					onChange={(e) => {
						setDestination(e.target.value);
						isValidInput(false);
					}}
					onClick={() => setExpandSearch(2)} />
			</Autocomplete>
			<FaFontAwesomeFlag className='absolute -mt-7 ml-2 text-xl text-green-500' />
		</div>
	);
}
