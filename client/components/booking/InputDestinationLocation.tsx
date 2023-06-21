import { getAddress } from '@/utils/getAddress'
import { Autocomplete } from '@react-google-maps/api'
import { useState } from 'react'
import { FaCircle } from 'react-icons/fa'

export const InputDestinationLocation = ({
	setExpandSearch,
	destinationRef,
	setDestination,
	isValidInput,
}) => {
	const [destinationAutocomplete, setDestinationAutocomplete] = useState(null)

	return (
		<div className='destination'>
			<Autocomplete
				onLoad={(e) => setDestinationAutocomplete(e)}
				onPlaceChanged={() => {
					setExpandSearch(0)
					isValidInput(true)
					setDestination(getAddress(destinationAutocomplete.getPlace()))
				}}
				options={{ componentRestrictions: { country: 'sg' } }}
				fields={['address_components', 'geometry', 'formatted_address']}
			>
				<input
					type='text'
					className='border-none bg-white px-3 py-3 pl-10 leading-tight shadow-none'
					placeholder='Where to?'
					ref={destinationRef}
					onChange={(e) => {
						isValidInput(false)
						if (e.target.value === '') {
							setExpandSearch(1)
						} else {
							setExpandSearch(0)
						}
					}}
					onClick={() => setExpandSearch(2)}
				/>
			</Autocomplete>
			<FaCircle className='absolute -mt-7 ml-3 text-xs text-green-600' />
		</div>
	)
}
