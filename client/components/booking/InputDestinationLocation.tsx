import { getAddress } from '@/utils/getAddress'
import { destinationAtom, searchTypeAtom } from '@/utils/state'
import { Autocomplete } from '@react-google-maps/api'
import { useState } from 'react'
import { FaCircle } from 'react-icons/fa'
import { useRecoilState } from 'recoil'

export const InputDestinationLocation = ({ destinationRef, isValidInput }) => {
	const [destinationAutocomplete, setDestinationAutocomplete] = useState(null)
	const [, setDestination] = useRecoilState(destinationAtom)
	const [, setSearchType] = useRecoilState(searchTypeAtom)

	return (
		<div className='destination'>
			<Autocomplete
				onLoad={(e) => setDestinationAutocomplete(e)}
				onPlaceChanged={() => {
					setSearchType(0)
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
							setSearchType(1)
							setDestination({
								placeID: null,
								lat: null,
								lng: null,
								postcode: null,
								address: null,
								placeName: null,
							})
						} else {
							setSearchType(0)
						}
					}}
					onClick={() => setSearchType(2)}
				/>
			</Autocomplete>
			<FaCircle className='absolute -mt-7 ml-3 text-xs text-green-600' />
		</div>
	)
}
