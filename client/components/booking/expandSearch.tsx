// TODO: Separate menu for saved locations

import { useContext } from 'react'
import { UserContext } from '@/context/UserContext'
import { useRouter } from 'next/router'
import {
	FaHouseUser,
	FaSearchLocation,
	FaStar,
	FaSuitcase,
} from 'react-icons/fa'
import { Button, HREF, Message } from '@/redux/types/constants'

const ExpandSearch = ({ mode, setExpandSearch, location, setLocation }) => {
	const { user } = useContext(UserContext)
	const router = useRouter()

	// Handler for clicking either 'Home' or 'Work'
	const handleSavedLocation = (label: string) => {
		// If the user set a home/work location...
		if (user[label].lat) {
			// ...navigate to the saved location
			navigateToLocation(user[label])
		} else {
			router.push(HREF.LOCATIONS)
		}
	}

	function navigateToLocation(data) {
		setExpandSearch(0)
		setLocation(data)
	}

	// UI for the Home/Saved menus
	const SavedLocations = (
		<div className='mt-3 flex inline-grid w-full grid-cols-2'>
			<>
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
							{user.home?.placeName
								? user.home?.placeName
								: Message.SET_LOCATION}
						</h5>
					</div>
				</div>
			</>
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
						{user.work?.placeName ? user.work?.placeName : Button.SET_LOCATION}
					</h5>
				</div>
			</div>
		</div>
	)

	return (
		<>
			{!location.lat ? (
				<>
					<div className='mt-2 bg-white px-5 pb-2'>
						{/* Saved locations: Home and Work */}
						{SavedLocations}
					</div>

					<div
						className='mt-2 flex flex-wrap bg-white p-3 px-5'
						onClick={() => setExpandSearch(mode === 1 ? 3 : 4)}
					>
						<FaSearchLocation className='mr-6 text-xl text-green-500' />
						<b className='text-sm'>{Message.SET_LOCATION_ON_MAP}</b>
					</div>

					<div className='mt-2 flex flex-wrap bg-white p-5'>
						<FaStar className='mr-6 text-xl text-green-500' />
						<b className='mb-4 text-sm'>{Message.SAVED_LOCATIONS}</b>

						{user.savedLocations && user.savedLocations.length > 0 ? (
							user.savedLocations?.map((item, index) => (
								<div
									className='mb-3 ml-11 w-full'
									key={index}
									onClick={() => {
										navigateToLocation(item)
									}}
								>
									<p className='font-normal'>{item.placeName}</p>
									<h5>Singapore {item.postcode}</h5>
								</div>
							))
						) : (
							<p className='ml-11 w-full'>{Message.NO_SAVED_LOCATIONS}</p>
						)}
					</div>
				</>
			) : (
				''
			)}
		</>
	)
}

export default ExpandSearch
