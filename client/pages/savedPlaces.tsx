// TODO: Button to route to Booking and set a route to that place

import { useContext, useRef, useState } from 'react'
import Page from '@/components/ui/page'
import Section from '@/components/ui/section'
import api from '@/api/axiosConfig'
import { UserContext } from '@/components/context/UserContext'
import { SearchBox } from '@mapbox/search-js-react'
import { AddPlaceAPI, RemovePlaceAPI, SetHome, SetWork } from '@/server'

const SavedPlaces = () => {
	const { user, setUser } = useContext(UserContext)
	const [searchBoxValue, setSearchBoxValue] = useState<string>('Add a place')

	const addPlace = async (e) => {
		// The API has an inconsitsent return type for large areas like the airport
		const country = e.properties.context.country?.name
			? e.properties.context.country?.name
			: e.properties.context.place.name
		const postcode = e.properties.context.postcode?.name
			? e.properties.context.postcode?.name
			: ''
		const name = e.properties.address ? e.properties.address : e.properties.name

		const data = {
			id: user.id,
			coordinates: e.geometry.coordinates,
			name: name,
			address: country + ' ' + postcode,
		}
		await AddPlaceAPI(data)
		setUser({
			...user,
			favoriteLocations: [...user.favoriteLocations, data],
		})
		setSearchBoxValue('Add a place')
	}

	return (
		<Page title='Saved Locations'>
			<Section>
				{/* <button className='grey-button' onClick={() => router.push('/settings')}>Go Back</button> */}
				<div
					onFocus={() => {
						searchBoxValue === 'Add a place'
							? setSearchBoxValue('')
							: searchBoxValue
					}}
				>
					<SearchBox
						accessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY as string}
						options={{ language: 'en', country: 'SG' }}
						onRetrieve={(e) => addPlace(e.features[0])}
						value={searchBoxValue}
						onChange={(e) => setSearchBoxValue(e)}
					/>
				</div>

				<SavedLocation
					user={user}
					setUser={setUser}
					label={'Home'}
					place={user.savedLocations.homeName}
				/>

				<SavedLocation
					user={user}
					setUser={setUser}
					label={'Work'}
					place={user.savedLocations.workName}
				/>

				<label className='pt-5'>Saved Places</label>
				{user.favoriteLocations.length == 0 ? (
					<div className='pt-5'>{'No saved places'}</div>
				) : (
					user.favoriteLocations.map((location, index) => (
						<Location
							location={location}
							setUser={setUser}
							user={user}
							key={index}
						/>
					))
				)}
			</Section>
		</Page>
	)
}

const SavedLocation = ({ user, setUser, label, place }) => {
	const [editLocation, updateEditLocation] = useState<boolean>(false)
	const [value, setValue] = useState<string>('Enter a new address')

	const editEntry = async (e) => {
		const name = e.properties.address ? e.properties.address : e.properties.name
		const coordinates = e.geometry.coordinates

		if (label === 'Home') {
			await SetHome(coordinates, name, user.id)
			setUser({
				...user,
				savedLocations: {
					...user.savedLocations,
					home: coordinates,
					homeName: name,
				},
			})
		} else {
			await SetWork(coordinates, name, user.id)
			setUser({
				...user,
				savedLocations: {
					...user.savedLocations,
					work: coordinates,
					workName: name,
				},
			})
		}

		updateEditLocation(false)
	}

	return (
		<div className='flex flex-wrap pl-5 pt-3'>
			<div className='w-5/6'>
				{editLocation ? (
					<div
						onFocus={() =>
							value === 'Enter a new address' ? setValue('') : value
						}
					>
						<SearchBox
							accessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY as string}
							options={{ language: 'en', country: 'SG' }}
							onRetrieve={(e) => editEntry(e.features[0])}
							value={value}
							onChange={(e) => setValue(e)}
						/>
					</div>
				) : (
					<div>
						<p>{label}</p>
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
					<svg
						viewBox='0 0 15 15'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
						width='15'
						height='15'
						onClick={() => {
							updateEditLocation(true)
						}}
					>
						<path
							d='M.5 9.5l-.354-.354L0 9.293V9.5h.5zm9-9l.354-.354a.5.5 0 00-.708 0L9.5.5zm5 5l.354.354a.5.5 0 000-.708L14.5 5.5zm-9 9v.5h.207l.147-.146L5.5 14.5zm-5 0H0a.5.5 0 00.5.5v-.5zm.354-4.646l9-9-.708-.708-9 9 .708.708zm8.292-9l5 5 .708-.708-5-5-.708.708zm5 4.292l-9 9 .708.708 9-9-.708-.708zM5.5 14h-5v1h5v-1zm-4.5.5v-5H0v5h1zM6.146 3.854l5 5 .708-.708-5-5-.708.708zM8 15h7v-1H8v1z'
							fill='currentColor'
						></path>
					</svg>
				)}
			</div>
		</div>
	)
}

const Location = ({ location, setUser, user }) => {
	const removeEntry = () => {
		RemovePlaceAPI(user.id, location.name)
		setUser({
			...user,
			favoriteLocations: [
				...user.favoriteLocations.filter((item) => item.name !== location.name),
			],
		})
	}

	return (
		<div className='ml-5 flex flex-wrap pt-3'>
			<div className='w-5/6'>
				<p>{location.name}</p>
				<h5>{location.address}</h5>
			</div>
			<div
				className='flex w-1/6 items-center justify-center'
				onClick={() => removeEntry()}
			>
				<svg
					viewBox='0 0 15 15'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
					width='15'
					height='15'
					color='darkred'
				>
					<path
						d='M4.5 4.5l6 6m-6 0l6-6m-3 10a7 7 0 110-14 7 7 0 010 14z'
						stroke='currentColor'
					></path>
				</svg>
			</div>
		</div>
	)
}

export default SavedPlaces
