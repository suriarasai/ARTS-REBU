import { HREF } from '@/constants'
import { Location } from '@/types'
import {
	userAtom,
	searchTypeAtom,
	originAtom,
	destinationAtom,
	originInputAtom,
	destInputAtom,
} from '@/state'
import { useRouter } from 'next/router'
import {
	FaHouseUser,
	FaSuitcase,
	FaSearchLocation,
	FaStar,
} from 'react-icons/fa'
import { useRecoilValue, useRecoilState } from 'recoil'

export function ExpandSearch() {
	const dest = useRecoilValue(destinationAtom)

	return (
		<div
			className={`transparent-dark absolute left-0 top-0 z-20 h-full w-full space-y-2 overflow-y-hidden ${
				dest.lat ? 'pt-48' : 'pt-32'
			}`}
		>
			<div className='responsive'>
				<div className='flex'>
					<FavouriteLocation type='home' />
					<FavouriteLocation type='work' />
				</div>
				<SetLocationOnMap />
				<SavedLocations />
			</div>
		</div>
	)
}

function FavouriteLocation({ type }) {
	const user = useRecoilValue(userAtom)
	const [searchType, setSearchType] = useRecoilState(searchTypeAtom)
	const [, setOrigin] = useRecoilState<Location>(originAtom)
	const [, setDest] = useRecoilState<Location>(destinationAtom)
	const [, setOriginInput] = useRecoilState<string>(originInputAtom)
	const [, setDestInput] = useRecoilState<string>(destInputAtom)
	const router = useRouter()

	const handleClick = () => {
		if (user[type]) {
			if (searchType === 1) {
				setOrigin(user[type])
				setOriginInput(user[type].placeName)
			} else {
				setDest(user[type])
				setDestInput(user[type].placeName)
			}
			setSearchType(0)
		} else {
			router.push(HREF.LOCATIONS)
		}
	}

	return (
		<div
			className='flex w-1/2 flex-wrap items-center justify-center bg-zinc-600 p-3'
			onClick={handleClick}
		>
			<div className='mr-5 text-2xl text-green-200'>
				{type === 'home' ? <FaHouseUser /> : <FaSuitcase />}
			</div>
			<div className='pr-5'>
				<b className='text-sm text-zinc-100'>
					{type[0].toUpperCase() + type.slice(1)}
				</b>
				<h5 className='text-zinc-50'>
					{user[type] ? user[type].placeName : 'Set Location'}
				</h5>
			</div>
		</div>
	)
}

function SetLocationOnMap() {
	const [searchType, setSearchType] = useRecoilState(searchTypeAtom)

	const handleClick = () => setSearchType(searchType === 1 ? 3 : 4)

	return (
		<div
			className='my-2 flex flex-wrap bg-zinc-600 p-3 px-5'
			onClick={handleClick}
		>
			<FaSearchLocation className='mr-6 text-xl text-green-200' />
			<b className='text-sm text-zinc-100'>{'Set Location on Map'}</b>
		</div>
	)
}

function SavedLocations() {
	const user = useRecoilValue(userAtom)
	const [searchType, setSearchType] = useRecoilState(searchTypeAtom)
	const [, setOrigin] = useRecoilState<Location>(originAtom)
	const [, setDest] = useRecoilState<Location>(destinationAtom)
	const [, setOriginInput] = useRecoilState<string>(originInputAtom)
	const [, setDestInput] = useRecoilState<string>(destInputAtom)

	const handleClick = (place: Location) => {
		if (searchType === 1) {
			setOrigin(place)
			setOriginInput(place.placeName)
		} else {
			setDest(place)
			setDestInput(place.placeName)
		}
		setSearchType(0)
	}
	return (
		<div className='bg-zinc-600 p-5'>
			<div className='flex flex-wrap'>
				<FaStar className='mr-6 text-xl text-green-200' />
				<b className='mb-4 text-sm text-zinc-100'>Saved Locations</b>
			</div>
			<div className='overflow-x-hidden h-72 overflow-y-auto'>
				{user.savedLocations && user.savedLocations.length > 0 ? (
					user.savedLocations?.map((item: Location, index: number) => (
						<div
							className='mb-3 ml-11 w-full text-zinc-50'
							key={index}
							onClick={() => handleClick(item)}
						>
							<p className='font-normal'>{item.placeName}</p>
							<h5>Singapore {item.postcode}</h5>
						</div>
					))
				) : (
					<p className='ml-11 w-full'>No saved locations</p>
				)}
			</div>
		</div>
	)
}
