import { getAddress } from '@/utils/getAddress'
import { originAtom, searchTypeAtom } from '@/utils/state'
import { Autocomplete } from '@react-google-maps/api'
import { useState } from 'react'
import { FaCircle } from 'react-icons/fa'
import { useRecoilState } from 'recoil'

export const InputCurrentLocation = ({ originRef, isValidInput }) => {
	const [originAutocomplete, setOriginAutocomplete] = useState(null)
	const [, setOrigin] = useRecoilState(originAtom)
	const [, setSearchType] = useRecoilState(searchTypeAtom)

	return (
		<div>
			<Autocomplete
				onLoad={(e) => setOriginAutocomplete(e)}
				onPlaceChanged={() => {
					setSearchType(0)
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
							setSearchType(1)
						} else {
							setSearchType(0)
						}
					}}
					onClick={() => setSearchType(1)}
				/>
			</Autocomplete>
			<FaCircle className='absolute -mt-7 ml-3 text-xs text-zinc-500' />
		</div>
	)
}
