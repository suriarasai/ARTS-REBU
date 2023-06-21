import { getAddress } from '@/utils/getAddress'
import { Autocomplete } from '@react-google-maps/api'
import { useState } from 'react'
import { FaCircle } from 'react-icons/fa'

export const InputCurrentLocation = ({
	setExpandSearch,
	originRef,
	setOrigin,
	isValidInput,
}) => {
	const [originAutocomplete, setOriginAutocomplete] = useState(null)
	return (
		<div>
			<Autocomplete
				onLoad={(e) => setOriginAutocomplete(e)}
				onPlaceChanged={() => {
					setExpandSearch(0)
					setOrigin(getAddress(originAutocomplete.getPlace()))
				}}
				options={{ componentRestrictions: { country: 'sg' } }}
				fields={['address_components', 'geometry', 'formatted_address']}
			>
				<input
					type='text'
					className='border-none bg-white px-3 py-3 pl-10 leading-tight shadow-none'
					placeholder='Current Location'
					ref={originRef}
					onChange={(e) => {
						isValidInput(false)
						if (e.target.value === '') {
							setExpandSearch(1)
						} else {
							setExpandSearch(0)
						}
					}}
					onClick={() => setExpandSearch(1)}
				/>
			</Autocomplete>
			<FaCircle className='absolute -mt-7 ml-3 text-xs text-zinc-500' />
		</div>
	)
}
