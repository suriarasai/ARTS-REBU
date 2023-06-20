import { Autocomplete } from '@react-google-maps/api'
import { FaCircle } from 'react-icons/fa'

export function InputDestinationLocation(
	setExpandSearch,
	destinationRef,
	setDestination,
	isValidInput
) {
	return (
		<div className='destination'>
			<Autocomplete
				onPlaceChanged={() => setExpandSearch(0)}
				options={{ componentRestrictions: { country: 'sg' } }}
				fields={['address_components', 'geometry', 'formatted_address']}
			>
				<input
					type='text'
					className='border-none bg-white px-3 py-3 pl-10 leading-tight shadow-none'
					placeholder='Where to?'
					ref={destinationRef}
					onChange={(e) => {
						setDestination(e.target.value)
						isValidInput(false)
					}}
					onClick={() => setExpandSearch(2)}
				/>
			</Autocomplete>
			<FaCircle className='absolute -mt-7 ml-3 text-xs text-green-600' />
		</div>
	)
}
