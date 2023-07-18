import { useRef, useState } from 'react'
import Page from '@/components/ui/page'
import { AddPlaceAPI, RemovePlaceAPI, SetHome, SetWork } from '@/server'
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api'
import {
	FaEdit,
	FaHome,
	FaRegTimesCircle,
	FaSearchLocation,
	FaSuitcase,
} from 'react-icons/fa'
import { Input, Message, Title } from '@/constants'
import { getAddress } from '@/utils/getAddress'
import { useRecoilState } from 'recoil'
import { userAtom } from '@/utils/state'
import { Location, User } from '@/types'

const SavedPlaces = () => {
	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
		libraries: ['places'],
	})

	const [user, setUser] = useRecoilState(userAtom)

	const [autoComplete, setAutoComplete] = useState<any>(null)
	const [valueObserver, setValueObserver] = useState('')

	/** @type React.MutableRefObject<HTMLInputElement> */
	const searchRef = useRef(null)

	const addPlace = async () => {
		const { placeName, address, lat, lng, postcode, placeID } = getAddress(
			autoComplete.getPlace()
		)
		const data = {
			lat: lat,
			lng: lng,
			postcode: postcode,
			address: address,
			placeName: placeName,
			placeID: placeID,
		}
		await AddPlaceAPI(user.customerID!, {
			lat: lat,
			lng: lng,
			postcode: postcode,
			address: address,
			placeName: placeName,
			placeID: placeID,
		})
		setUser({
			...user,
			// @ts-ignore
			savedLocations: [...user.savedLocations, data],
		})
	}

	if (!isLoaded) {
		return 'loading'
	}

	return (
		<Page title={Title.LOCATIONS}>
			<div className='relative'>
				<Autocomplete
					onPlaceChanged={() => {
						addPlace()
						setValueObserver('')
						// @ts-ignore
						searchRef.current.value = ''
					}}
					onLoad={(e) => setAutoComplete(e)}
					fields={[
						'address_components',
						'geometry',
						'formatted_address',
						'place_id',
					]}
					options={{ componentRestrictions: { country: 'sg' } }}
				>
					<input
						type='text'
						className='rounded-sm border-none bg-zinc-50 px-3 py-2 pl-10 leading-tight shadow-none focus:bg-white'
						placeholder={Input.PLACE}
						ref={searchRef}
						onChange={(e) => setValueObserver(e.target.value)}
					/>
				</Autocomplete>
				<FaSearchLocation className='absolute -mt-7 ml-2 text-xl text-green-500' />
				{valueObserver === '' ? (
					<>
						<SavedLocation
							user={user}
							setUser={setUser}
							label={'Home'}
							place={user.home as Location}
						/>

						<SavedLocation
							user={user}
							setUser={setUser}
							label={'Work'}
							place={user.work as Location}
						/>

						<label className='pt-5'>{Message.SAVED_LOCATIONS}</label>
						{user.savedLocations?.length === 0 ? (
							<div className='pt-5'>{Message.NO_SAVED_LOCATIONS}</div>
						) : (
							user.savedLocations?.map((location, index) => (
								<Location location={location} key={index} />
							))
						)}
					</>
				) : (
					''
				)}
			</div>
		</Page>
	)
}

const SavedLocation = ({
	user,
	setUser,
	label,
	place,
}: {
	user: User
	setUser: React.Dispatch<React.SetStateAction<User>>
	label: string
	place: Location
}) => {
	const [editLocation, updateEditLocation] = useState<boolean>(false)
	const [autoComplete, setAutoComplete] = useState(null)

	/** @type React.MutableRefObject<HTMLInputElement> */
	const searchRef = useRef(null)

	const editEntry = async () => {
		const { placeName, address, lat, lng, postcode, placeID } = getAddress(
			(autoComplete as any).getPlace()
		)
		if (label === 'Home') {
			await SetHome(user.customerID!, {
				placeID: placeID,
				lat: lat,
				lng: lng,
				postcode: postcode,
				address: address,
				placeName: placeName,
			})
			setUser({
				...user,
				home: {
					placeID: placeID,
					lat: lat,
					lng: lng,
					postcode: postcode,
					address: address,
					placeName: placeName,
				},
			})
		} else {
			await SetWork(user.customerID!, {
				placeID: placeID,
				lat: lat,
				lng: lng,
				postcode: postcode,
				address: address,
				placeName: placeName,
			})
			setUser({
				...user,
				work: {
					placeID: placeID,
					lat: lat,
					lng: lng,
					postcode: postcode,
					address: address,
					placeName: placeName,
				},
			})
		}

		updateEditLocation(false)
	}

	return (
		<div className='flex flex-wrap pl-5 pt-3'>
			<div className='w-5/6'>
				{editLocation ? (
					<div className='relative'>
						<Autocomplete
							onPlaceChanged={() => editEntry()}
							onLoad={(e) => setAutoComplete(e as any)}
							className='relative'
							fields={[
								'address_components',
								'geometry',
								'formatted_address',
								'place_id',
							]}
							options={{ componentRestrictions: { country: 'sg' } }}
						>
							<input
								type='text'
								className='rounded-sm border-none bg-zinc-50 px-3 py-2 pl-10 leading-tight shadow-none focus:bg-white'
								placeholder={Input.ADDRESS}
								ref={searchRef}
							/>
						</Autocomplete>
						<div className='absolute -mt-7 ml-2 text-xl text-green-500'>
							{label === 'Home' && <FaHome />}
							{label === 'Work' && <FaSuitcase />}
						</div>
					</div>
				) : (
					<div>
						<b className='text-sm font-medium'>{label}</b>
						<h5>{place.placeName ? place.placeName : Message.SET_LOCATION}</h5>
					</div>
				)}
			</div>
			<div className='flex w-1/6 items-center justify-center'>
				{editLocation ? (
					<button
						className='red-button mb-3'
						onClick={() => updateEditLocation(false)}
					>
						Cancel
					</button>
				) : (
					<FaEdit
						onClick={() => {
							updateEditLocation(true)
						}}
						className='text-zinc-500'
					/>
				)}
			</div>
		</div>
	)
}

const Location = ({ location }: { location: Location }) => {
	const [user, setUser] = useRecoilState(userAtom)
	function removeEntry() {
		RemovePlaceAPI(user.customerID as number, location.placeID as string)
		setUser({
			...user,
			savedLocations: [
				...user.savedLocations!.filter(
					(item: Location) => item.placeID !== location.placeID
				),
			],
		})
	}

	return (
		<div className='ml-5 flex flex-wrap pt-3'>
			<div className='w-5/6'>
				<b className='text-sm font-medium'>{location.placeName}</b>
				<h5>
					{location.address}, Singapore {location.postcode}
				</h5>
			</div>
			<div
				className='flex w-1/6 items-center justify-center'
				onClick={() => removeEntry()}
			>
				<FaRegTimesCircle className='text-red-700' />
			</div>
		</div>
	)
}

export default SavedPlaces
