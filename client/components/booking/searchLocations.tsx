import { SavedLocation, SearchLocationInterface } from '@/redux/types'
import { useState, useContext } from 'react'
import api from '@/api/axiosConfig'
import { UserContext } from '../context/UserContext'
import { EditFavoriteLocation } from './editFavoriteLocation'

const SearchLocations = ({
	type,
	callback,
	setSearchQueryVisible,
	setToLocation,
	setFromLocation,
	searchBoxInput,
	searchBoxSuggestions,
	setToAddress,
}: SearchLocationInterface) => {
	function setDestination(destination: Array<number>) {
		callback(destination, type)
		setSearchQueryVisible(false)
		setToLocation(false)
		setFromLocation(false)
	}

	const { user, setUser } = useContext(UserContext)

	const [showModal, setShowModal] = useState<boolean>(false)

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
			setDestination(user.savedLocations[label])
			setToAddress(user.savedLocations[label + 'Name'])
		} else {
			// ...start the process to save a home/work location
			setShowModal(true)
		}
	}

	// TODO: Validation checks for non-empty and valid input
	// API to set/modify the Home or Work location
	const SetFavoriteLocationAPI = async (favoriteLocation: SavedLocation) => {
		if (favoriteLocation.homeName !== '') {
			await api.post('/api/v1/customers/setHome', {
				...favoriteLocation,
				id: user.id,
			})
			setUser({
				...user,
				savedLocations: {
					...user.savedLocations,
					home: favoriteLocation.home,
					homeName: favoriteLocation.homeName,
				},
			})
		}
		if (favoriteLocation.workName !== '') {
			await api.post('/api/v1/customers/setWork', {
				...favoriteLocation,
				id: user.id,
			})
			setUser({
				...user,
				savedLocations: {
					...user.savedLocations,
					work: favoriteLocation.work,
					workName: favoriteLocation.workName,
				},
			})
		}
		setShowModal(false)
	}

	// UI for the Home/Saved menus
	const SavedLocations = (
		<span className='mt-16 ml-3 flex inline-grid w-full grid-cols-2'>
			<div>
				<div
					className='flex flex-wrap'
					onClick={() => handleSavedLocation('home')}
				>
					<div className='mt-2 w-1/5'>
						<svg
							viewBox='0 0 15 15'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
							width='22'
							height='22'
							color='#52525b'
						>
							<path
								d='M7.5.5l.325-.38a.5.5 0 00-.65 0L7.5.5zm-7 6l-.325-.38L0 6.27v.23h.5zm5 8v.5a.5.5 0 00.5-.5h-.5zm4 0H9a.5.5 0 00.5.5v-.5zm5-8h.5v-.23l-.175-.15-.325.38zM1.5 15h4v-1h-4v1zm13.325-8.88l-7-6-.65.76 7 6 .65-.76zm-7.65-6l-7 6 .65.76 7-6-.65-.76zM6 14.5v-3H5v3h1zm3-3v3h1v-3H9zm.5 3.5h4v-1h-4v1zm5.5-1.5v-7h-1v7h1zm-15-7v7h1v-7H0zM7.5 10A1.5 1.5 0 019 11.5h1A2.5 2.5 0 007.5 9v1zm0-1A2.5 2.5 0 005 11.5h1A1.5 1.5 0 017.5 10V9zm6 6a1.5 1.5 0 001.5-1.5h-1a.5.5 0 01-.5.5v1zm-12-1a.5.5 0 01-.5-.5H0A1.5 1.5 0 001.5 15v-1z'
								fill='currentColor'
							></path>
						</svg>
					</div>
					<div className='w-4/5 pr-5'>
						<p>Home</p>
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
				<div className='mt-2 w-1/5'>
					<svg
						viewBox='0 0 15 15'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
						width='22'
						height='22'
						color='#52525b'
					>
						<path
							d='M5.5 3v-.5a2 2 0 114 0V3m-9 8.5h14m-13-8h12a1 1 0 011 1v9a1 1 0 01-1 1h-12a1 1 0 01-1-1v-9a1 1 0 011-1z'
							stroke='currentColor'
						></path>
					</svg>
				</div>
				<div className='w-4/5'>
					<p>Work</p>
					<h5>
						{user.savedLocations?.workName
							? user.savedLocations?.workName
							: 'Set Location'}
					</h5>
				</div>
			</div>
		</span>
	)

	return (
		<div className='flex flex-wrap'>
			<div className='w-2/12'></div>
			<div className='w-10/12'>
				{/* Saved locations: Home and Work */}
				{SavedLocations}

				{/* TODO: Recent locations */}
				<label className='mt-6 mb-4'>
					{['Enter your destination', 'Your location', ''].includes(
						searchBoxInput
					) || searchBoxSuggestions?.length == 0
						? 'Saved Locations'
						: 'Results'}
				</label>

				{['Enter your destination', 'Your location', ''].includes(
					searchBoxInput
				) || searchBoxSuggestions?.length == 0
					? user.favoriteLocations && user.favoriteLocations.length > 0
						? user.favoriteLocations.map((item, index) => (
								<div
									className='ml-3 mb-3'
									key={index}
									onClick={() => {
										setDestination(item.coordinates)
										setToAddress(item.name)
									}}
								>
									<p>{item.name}</p>
									<h5>{item.address}</h5>
								</div>
						  ))
						: 'No saved locations'
					: null}

				{showModal ? (
					<EditFavoriteLocation
						label={label}
						setFavoriteLocation={setFavoriteLocation}
						favoriteLocation={favoriteLocation}
						setShowModal={setShowModal}
						SetFavoriteLocationAPI={SetFavoriteLocationAPI}
					/>
				) : null}
			</div>
		</div>
	)
}

export default SearchLocations
