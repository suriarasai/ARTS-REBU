// TODO: Separate menu for saved locations

import { useState, useContext } from 'react'
import { UserContext } from '../../context/UserContext'
import { useRouter } from 'next/router'
import {
	FaHouseUser,
	FaSearchLocation,
	FaStar,
	FaSuitcase,
} from 'react-icons/fa'

const ExpandSearch = ({ mode, setExpandSearch, location, setLocation }) => {
	const { user } = useContext(UserContext)
	const router = useRouter()

	// Handler for clicking either 'Home' or 'Work'
	const handleSavedLocation = (label: string) => {
		// If the user set a home/work location...
		if (user[label] !== null) {
			// ...navigate to the saved location
			navigateToLocation(user[label].lat, user[label].lng)
		} else {
			router.push('/savedPlaces')
		}
	}

	function navigateToLocation(lat, lng) {
		setExpandSearch(0)
		setLocation([lat, lng])
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
							{user.home?.placeName ? user.home?.placeName : 'Set Location'}
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
						{user.work?.placeName
							? user.work?.placeName
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

						{user.savedLocations && user.savedLocations?.length > 0 ? (
							user.savedLocations?.map((item, index) => (
								<div
									className='mb-3 ml-11 w-full'
									key={index}
									onClick={() => {
										navigateToLocation(item.lat, item.lng)
									}}
								>
									<p>{item.placeName}</p>
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
