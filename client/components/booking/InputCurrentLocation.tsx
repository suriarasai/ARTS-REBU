import { Autocomplete } from '@react-google-maps/api'
import { FaCircle } from 'react-icons/fa'

export function InputCurrentLocation(
	setExpandSearch,
	originRef,
	setOrigin,
	isValidInput
) {
	return (
		<div>
			<Autocomplete
				onPlaceChanged={() => setExpandSearch(0)}
				options={{ componentRestrictions: { country: 'sg' } }}
				fields={['address_components', 'geometry', 'formatted_address']}
			>
				<input
					type='text'
					className='border-none bg-white px-3 py-3 pl-10 leading-tight shadow-none'
					placeholder='Current Location'
					ref={originRef}
					onChange={(e) => {
						setOrigin(e.target.value)
						isValidInput(false)
					}}
					onClick={() => setExpandSearch(1)}
				/>
			</Autocomplete>
			<FaCircle className='absolute -mt-7 ml-3 text-xs text-zinc-500' />
		</div>
	)
}
