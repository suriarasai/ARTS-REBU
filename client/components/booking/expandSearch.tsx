// TODO: Separate menu for favorited locations
// TODO: Merge fav and saved locations in data model?

import { SavedLocation, SearchLocationInterface } from '@/redux/types'
import { useState, useContext, useEffect } from 'react'
import { UserContext } from '../context/UserContext'
import { useRouter } from 'next/router'
import {
	FaHouseUser,
	FaSearchLocation,
	FaStar,
	FaSuitcase,
} from 'react-icons/fa'

const ExpandSearch = ({ mode, setExpandSearch, location, setLocation }) => {
	const { user, setUser } = useContext(UserContext)
	const router = useRouter()

	const [label, setLabel] = useState<string>('')
	const [favoriteLocation, setFavoriteLocation] = useState<SavedLocation>({
		home: [],
		homeName: '',
		work: [],
		workName: '',
	})

	// Handler for clicking either 'Home' or 'Work'
	const handleSavedLocation = (label: string) => {
		setLabel(label)
		// If the user set a home/work location...
		if (user.savedLocations[label]) {
			// ...navigate to the saved location
			navigateToLocation(
				user.savedLocations[label],
				user.savedLocations[label + 'Name']
			)
		} else {
			router.push('/savedPlaces')
		}
	}

	function navigateToLocation(coords, label) {
		setExpandSearch(0)
		setLocation(coords)
	}

	// UI for the Home/Saved menus
	const SavedLocations = (
		<div className='mt-3 flex inline-grid w-full grid-cols-2'>
			<div>
				<div
					className='flex flex-wrap'
					onClick={() => handleSavedLocation('home')}
				>
					<div className='mt-2'>
						<FaHouseUser className='mr-5 text-2xl text-green-500' />
					</div>
					<div className='pr-5'>
						<b className='text-sm'>Home</b>
						<h5>
							{user.savedLocations?.homeName
								? user.savedLocations?.homeName
								: 'Set Location'}
						</h5>
					</div>
				</div>
			</div>
			<div
				className='-ml-3 flex flex-wrap'
				onClick={() => handleSavedLocation('work')}
			>
				<div className='mt-2'>
					<FaSuitcase className='mr-5 text-2xl text-green-500' />
				</div>
				<div>
					<b className='text-sm'>Work</b>
					<h5>
						{user.savedLocations?.workName
							? user.savedLocations?.workName
							: 'Set Location'}
					</h5>
				</div>
			</div>
		</div>
	)

	return (
		<div>
			{location === '' ? (
				<div>
					<div className='bg-white px-5 pb-2'>
						{/* Saved locations: Home and Work */}
						{SavedLocations}
					</div>

					<div
						className='mt-2 flex flex-wrap bg-white p-3 px-5'
						onClick={() => setExpandSearch(mode === 1 ? 3 : 4)}
					>
						<FaSearchLocation className='mr-6 text-xl text-green-500' />
						<b className='text-sm'>Set Location on Map</b>
					</div>

					<div className='mt-2 flex flex-wrap bg-white p-5'>
						<FaStar className='mr-6 text-xl text-green-500' />
						<b className='mb-4 text-sm'>Saved Locations</b>

						{user.favoriteLocations && user.favoriteLocations.length > 0 ? (
							user.favoriteLocations.map((item, index) => (
								<div
									className='ml-11 mb-3 w-full'
									key={index}
									onClick={() => {
										navigateToLocation(item.coordinates, item.name)
									}}
								>
									<p>{item.name}</p>
									<h5>{item.address}</h5>
								</div>
							))
						) : (
							<p className='ml-11 w-full'>{'No saved locations'}</p>
						)}
					</div>
				</div>
			) : (
				''
			)}
		</div>
	)
}

export default ExpandSearch
