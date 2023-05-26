// TODO: Button to route to Booking and set a route to that place

import { useContext, useState } from 'react'
import Page from '@/components/ui/page'
import Section from '@/components/ui/section'
import api from '@/api/axiosConfig'
import { UserContext } from '@/components/context/UserContext'
import { FavoriteLocation } from '@/redux/types'
import { useRouter } from 'next/router'
import { SearchBox } from '@mapbox/search-js-react'

const SavedPlaces = () => {
	const { user, setUser } = useContext(UserContext)
	const router = useRouter()

	const addPlace = (e) => {
		AddPlaceAPI(e)
		// console.log(e)
	}

	const AddPlaceAPI = async (e) => {
		// The API has an inconsitsent return type for large areas like the airport
		const country = e.properties.context.country?.name
			? e.properties.context.country?.name
			: e.properties.context.place.name
		const postcode = e.properties.context.postcode?.name
			? e.properties.context.postcode?.name
			: ''
		const name = e.properties.address ? e.properties.address : e.properties.name

		const data = {
			mobileNumber: user.mobileNumber,
			coordinates: e.geometry.coordinates,
			name: name,
			address: country + ' ' + postcode,
		}
		await api.post('/api/v1/customers/addFavoriteLocation', {
			...data,
		})
		setUser({
			...user,
			favoriteLocations: [...user.favoriteLocations, { ...data }],
		})
	}

	return (
		<Page title='Saved Locations'>
			<Section>
				{/* <button className='grey-button' onClick={() => router.push('/settings')}>Go Back</button> */}

				<SearchBox
					accessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY as string}
					options={{ language: 'en', country: 'SG' }}
					onRetrieve={(e) => addPlace(e.features[0])}
					value='Add a place'
				/>

				{user.favoriteLocations.length == 0 ? (
					<div className='pt-5'>{'No saved places'}</div>
				) : (
					user.favoriteLocations.map((location, index) => (
						<Location location={location} setUser={setUser} user={user} key={index} />
					))
				)}
			</Section>
		</Page>
	)
}

const RemovePlaceAPI = async (user, name) => {
    await api.post('/api/v1/customers/removeFavoriteLocation', {
        mobileNumber: user.mobileNumber,
        name: name
    })
}

const Location = ({ location, setUser, user }) => {

    const removeEntry = () => {
        RemovePlaceAPI(user, location.name)
        setUser({...user, favoriteLocations: [...user.favoriteLocations.filter(item => item.name !== location.name)]})
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
