import { Autocomplete } from '@react-google-maps/api';
import { FaCrosshairs } from 'react-icons/fa';

export function InputCurrentLocation(
	setExpandSearch,
	originRef,
	setOrigin,
	isValidInput
	// setOriginAutocomplete
) {
	return (
		<div>
			<Autocomplete
				// onLoad={(e) => setOriginAutocomplete(e)}
				onPlaceChanged={() => setExpandSearch(0)}
				options={{ componentRestrictions: { country: 'sg' } }}
				fields={['address_components', 'geometry', 'formatted_address']}
			>
				<input
					type='text'
					className='mb-2 rounded-sm border-none bg-zinc-100 px-3 py-2 pl-10 leading-tight shadow-none'
					placeholder='Origin'
					ref={originRef}
					// value={origin}
					onChange={(e) => {
						setOrigin(e.target.value);
						isValidInput(false);
					}}
					onClick={() => setExpandSearch(1)} />
			</Autocomplete>
			<FaCrosshairs className='absolute -mt-9 ml-2 text-xl text-green-500' />
		</div>
	);
}
