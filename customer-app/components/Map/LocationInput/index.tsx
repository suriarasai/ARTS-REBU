import {
	destinationAtom,
	searchTypeAtom,
	userAtom,
	validInputAtom,
} from '@/utils/state'
import { useRouter } from 'next/router'
import { FaPlusCircle, FaRegArrowAltCircleLeft } from 'react-icons/fa'
import { useRecoilState, useRecoilValue } from 'recoil'
import { OriginInput } from './originInput'
import { DestinationInput } from './destinationInput'
import { ExpandSearch } from './expandSearch'

export function LocationInputs() {
	const searchType = useRecoilValue(searchTypeAtom)

	return (
		<>
			<SearchMenu />
			{(searchType === 1 || searchType === 2) && <ExpandSearch />}
		</>
	)
}

function SearchMenu() {
	const dest = useRecoilValue(destinationAtom)
	return (
		<div className='absolute left-0 right-0 top-0 z-50 ml-auto mr-auto flex w-full max-w-screen-md flex-wrap rounded-b-3xl bg-white p-2 shadow-md'>
			<div className='w-1/12'>
				<BackButton />
			</div>

			<div className='w-10/12 space-y-2'>
				<OriginInput />
				<hr className='mb-1 ml-auto mr-auto mt-1 bg-zinc-300' />
				<DestinationInput />
			</div>

			<div className='mt-16 flex w-1/12 justify-center text-3xl text-green-600'>
				<FaPlusCircle onClick={() => {}} />
			</div>

			{dest.lat && <ConfirmInputsButton />}
		</div>
	)
}

function ConfirmInputsButton() {
	const [, setIsValidInput] = useRecoilState(validInputAtom)

	const handleClick = () => setIsValidInput(true)

	return (
		<div className='flex w-full justify-center px-6 py-3'>
			<button className='directions-button' onClick={handleClick}>
				<p className='font-normal'>Calculate Routes</p>
			</button>
		</div>
	)
}

function BackButton() {
	const [searchType, setSearchType] = useRecoilState(searchTypeAtom)
	const router = useRouter()

	const handleClick = () => {
		if (searchType !== 0) {
			setSearchType(0)
		} else {
			router.push('/home')
		}
	}

	return (
		<button
			className='p-2 text-2xl font-medium text-green-600'
			onClick={handleClick}
		>
			<FaRegArrowAltCircleLeft />
		</button>
	)
}
