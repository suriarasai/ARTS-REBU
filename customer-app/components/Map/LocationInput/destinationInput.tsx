import { getAddress } from "../utils/calculations"
import {
	destInputAtom,
	destinationAtom,
	searchTypeAtom,
	validInputAtom,
} from '@/state'
import { Autocomplete } from '@react-google-maps/api'
import { useState } from 'react'
import { FaCircle } from 'react-icons/fa'
import { useRecoilState } from 'recoil'

export function DestinationInput() {
	const [autocomplete, setAutocomplete] = useState<any>(null)
	const [dest, setDest] = useRecoilState(destinationAtom)
	const [, setSearchType] = useRecoilState(searchTypeAtom)
	const [, setIsValidInput] = useRecoilState(validInputAtom)
	const [destInput, setDestInput] = useRecoilState<string>(destInputAtom)

	const handleChange = (e) => {
		setIsValidInput(false)

		if (e.target.value === '') {
			setSearchType(1)
		} else {
			setSearchType(0)
		}

		if (dest.address) {
			setDest({
				placeID: null,
				lat: null,
				lng: null,
				postcode: null,
				address: null,
				placeName: null,
			})
		}

		setDestInput(e.target.value)
	}

	const onRetrieve = () => {
		const retrievedAddress = autocomplete.getPlace()
		setSearchType(0)
		setDest(getAddress(retrievedAddress))
		setDestInput(retrievedAddress.formatted_address)
	}

	return (
		<div className='relative'>
			<Autocomplete
				onLoad={setAutocomplete}
				onPlaceChanged={onRetrieve}
				options={{ componentRestrictions: { country: 'sg' } }}
				fields={['address_components', 'geometry', 'formatted_address']}
			>
				<input
					type='text'
					className='border-none bg-gray-700 hover:bg-gray-500 focus:bg-gray-500 text-green-100 px-3 py-3 pl-10 leading-tight shadow-none'
					placeholder='Where to?'
					value={destInput}
					onChange={handleChange}
					onClick={() => setSearchType(2)}
				/>
			</Autocomplete>
			<FaCircle className='absolute -mt-7 ml-3 text-xs text-green-400' />
		</div>
	)
}
