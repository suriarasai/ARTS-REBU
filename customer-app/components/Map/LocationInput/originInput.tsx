import { getAddress } from "../utils/calculations"
import {
	originAtom,
	originInputAtom,
	searchTypeAtom,
	validInputAtom,
} from '@/state'
import { Autocomplete } from '@react-google-maps/api'
import { useState } from 'react'
import { FaCircle } from 'react-icons/fa'
import { useRecoilState } from 'recoil'

export function OriginInput() {
	const [autocomplete, setAutocomplete] = useState<any>(null)
	const [origin, setOrigin] = useRecoilState(originAtom)
	const [, setSearchType] = useRecoilState(searchTypeAtom)
	const [, setIsValidInput] = useRecoilState(validInputAtom)
	const [originInput, setOriginInput] = useRecoilState<string>(originInputAtom)

	const onRetrieve = () => {
		const retrievedAddress = autocomplete.getPlace()
		setSearchType(0)
		setOrigin(getAddress(retrievedAddress))
		setOriginInput(retrievedAddress.formatted_address)
	}

	const handleChange = (e) => {
		setIsValidInput(false)

		if (e.target.value === '') {
			setSearchType(1)
		} else {
			setSearchType(0)
		}

		if (origin.address) {
			setOrigin({
				placeID: null,
				lat: null,
				lng: null,
				postcode: null,
				address: null,
				placeName: null,
			})
		}

		setOriginInput(e.target.value)
	}

	const onClick = () => {
		setSearchType(1)
	}

	return (
		<div className='relative'>
			<Autocomplete
				onLoad={(e) => setAutocomplete(e)}
				onPlaceChanged={onRetrieve}
				options={{ componentRestrictions: { country: 'sg' } }}
				fields={['address_components', 'geometry', 'formatted_address']}
			>
				<input
					type='text'
					className='border-none bg-gray-700 hover:bg-gray-500 focus:bg-gray-500 text-green-100 px-3 py-3 pl-10 leading-tight shadow-none'
					placeholder='Current Location'
					onChange={handleChange}
					onClick={onClick}
					value={originInput}
				/>
			</Autocomplete>
			<FaCircle className='absolute -mt-7 ml-3 text-xs text-zinc-300' />
		</div>
	)
}
