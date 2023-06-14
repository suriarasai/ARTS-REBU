// TODO: Button to route to Booking and set a route to that place

import { useContext, useEffect, useRef, useState } from 'react'
import Page from '@/components/ui/page'
import Section from '@/components/ui/section'
import { UserContext } from '@/components/context/UserContext'
import { AddPlaceAPI, RemovePlaceAPI, SetHome, SetWork } from '@/server'
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api'
import {
	FaEdit,
	FaHome,
	FaRegTimesCircle,
	FaSearchLocation,
	FaSuitcase,
} from 'react-icons/fa'

const libraries = ['places']

const SavedPlaces = () => {
	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
		// @ts-ignore
		libraries: libraries,
	})

	const { user, setUser } = useContext(UserContext)

	const [autoComplete, setAutoComplete] = useState(null)
	const [valueObserver, setValueObserver] = useState('')

	/** @type React.MutableRefObject<HTMLInputElement> */
	const searchRef = useRef(null)

	const addPlace = async () => {
		const [placeName, address, lat, lng, postcode, place_id] = getAddress(
			autoComplete.getPlace()
		)
		const data = {
			lat: lat,
			lng: lng,
			postcode: postcode,
			address: address,
			placeName: placeName,
			placeID: place_id
		}
		await AddPlaceAPI(user.customerID, {
			lat: lat,
			lng: lng,
			postcode: postcode,
			address: address,
			placeName: placeName,
			placeID: place_id
		})
		setUser({
			...user,
			savedLocations: [...user.savedLocations, data],
		})
	}

	if (!isLoaded) {
		return 'loading'
	}

	return (
		<Page title='Saved Locations'>
			<Section>
				{/* <button className='grey-button' onClick={() => router.push('/settings')}>Go Back</button> */}

				<Autocomplete
					onPlaceChanged={() => {
						addPlace()
						searchRef.current.value = ''
						setValueObserver('')
					}}
					onLoad={(e) => setAutoComplete(e)}
					fields={['address_components', 'geometry', 'formatted_address', 'place_id']}
					options={{ componentRestrictions: { country: 'sg' } }}
				>
					<input
						type='text'
						className='rounded-sm border-none bg-zinc-50 px-3 py-2 pl-10 leading-tight shadow-none focus:bg-white'
						placeholder='Add a place'
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
							place={user.home.placeName}
						/>

						<SavedLocation
							user={user}
							setUser={setUser}
							label={'Work'}
							place={user.work.placeName}
						/>

						<label className='pt-5'>Saved Places</label>
						{user.savedLocations.length === 0 ? (
							<div className='pt-5'>{'No saved places'}</div>
						) : (
							user.savedLocations.map((location, index) => (
								<Location
									location={location}
									setUser={setUser}
									user={user}
									key={index}
								/>
							))
						)}
					</>
				) : (
					''
				)}
			</Section>
		</Page>
	)
}

const SavedLocation = ({ user, setUser, label, place }) => {
	const [editLocation, updateEditLocation] = useState<boolean>(false)
	const [autoComplete, setAutoComplete] = useState(null)

	/** @type React.MutableRefObject<HTMLInputElement> */
	const searchRef = useRef(null)

	const editEntry = async () => {
		const [placeName, address, lat, lng, postcode, place_id] = getAddress(
			autoComplete.getPlace()
		)
		if (label === 'Home') {
			await SetHome(user.customerID, {
				placeID: place_id,
				lat: lat,
				lng: lng,
				postcode: postcode,
				address: address,
				placeName: placeName,
			})
			setUser({
				...user,
				home: {
					placeID: place_id,
					lat: lat,
					lng: lng,
					postcode: postcode,
					address: address,
					placeName: placeName,
				},
			})
		} else {
			await SetWork(user.customerID, {
				placeID: place_id,
				lat: lat,
				lng: lng,
				postcode: postcode,
				address: address,
				placeName: placeName,
			})
			setUser({
				...user,
				work: {
					placeID: place_id,
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
					<div>
						<Autocomplete
							onPlaceChanged={() => editEntry()}
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
								placeholder='Enter a new address'
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
						<h5>{place ? place : 'Set Location'}</h5>
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

const Location = ({ location, setUser, user }) => {
	function removeEntry() {
		RemovePlaceAPI(user.customerID, location.placeID)
		setUser({
			...user,
			savedLocations: [
				...user.savedLocations.filter(
					(item) => item.placeID !== location.placeID
				),
			],
		})
	}

	return (
		<div className='ml-5 flex flex-wrap pt-3'>
			<div className='w-5/6'>
				<b className='text-sm font-medium'>{location.placeName}</b>
				<h5>{location.address}, Singapore {location.postcode}</h5>
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

// TODO: PlaceName
function getAddress(place) {
	let PlaceName = ''
	let Postcode = ''

	for (const component of place.address_components as google.maps.GeocoderAddressComponent[]) {
		const componentType = component.types[0]

		switch (componentType) {
			case 'street_number': {
				PlaceName = `${component.long_name} ${PlaceName}`
				break
			}

			case 'route': {
				PlaceName += component.short_name
				break
			}

			case 'postal_code': {
				Postcode = component.long_name
				break
			}
		}
	}

	if (PlaceName === '') {
		PlaceName = place.formatted_address
	}

	return [
		PlaceName,
		PlaceName,
		place.geometry.location.lat(),
		place.geometry.location.lng(),
		Postcode,
		place.place_id,
	]
}
