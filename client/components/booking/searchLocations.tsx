import Section from '@/components/ui/section'
import { SavedLocation, SearchLocationInterface } from '@/redux/types'
import { SearchBox } from '@mapbox/search-js-react'
import { useState, useContext } from 'react'
import api from '@/api/axiosConfig'
import { UserContext } from '../context/UserContext'

const SearchLocations = ({
	type,
	callback,
	setSearchQueryVisible,
	setToLocation,
	setFromLocation,
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

	const handleSavedLocation = (label: string) => {
		setLabel(label)
		// If the user set a home/work location...
		if (user.savedLocations[label]) {
			// ...navigate to the saved location
			setDestination(user.savedLocations[label])
		} else {
			// ...start the process to save a home/work location
			setShowModal(true)
		}
	}

	// TODO: Validation checks for non-empty and valid input
	const SetFavoriteLocationAPI = async (favoriteLocation: SavedLocation) => {
		if (favoriteLocation.homeName !== '') {
			await api.post('/api/v1/customers/setHome', {
				...favoriteLocation,
				mobileNumber: user.mobileNumber,
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
				mobileNumber: user.mobileNumber,
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

	return (
		<div className='flex flex-wrap'>
			<div className='w-2/12'></div>
			<div className='w-10/12'>
				{/* Saved locations: Home and Work */}
				<span className='mt-16 ml-3 inline-grid w-full grid-cols-2'>
					{/* TODO: Home/Work Icons */}
					<div>
						<p onClick={() => handleSavedLocation('home')}>Home</p>
						<h5>
							{user.savedLocations?.homeName
								? user.savedLocations?.homeName
								: 'Set Location'}
						</h5>
					</div>
					<div>
						<p onClick={() => handleSavedLocation('work')}>Work</p>
						<h5>
							{user.savedLocations?.workName
								? user.savedLocations?.workName
								: 'Set Location'}
						</h5>
					</div>
				</span>

				{/* TODO: Recent locations */}
				{/* Recent locations */}
				<label className='mt-6 mb-4'>Saved Locations</label>

				{user.favoriteLocations ? (
					user.favoriteLocations.map((item, index) => (
						<div
							className='ml-3 mb-3'
							key={index}
							onClick={() => setDestination(item.coordinates)}
						>
							<p>{item.name}</p>
							<h5>{item.address}</h5>
						</div>
					))
				) : (
					<>No saved locations</>
				)}

				{showModal ? (
					<div className='absolute left-0 right-0 top-48 ml-auto mr-auto flex h-auto w-10/12 flex-col items-center justify-center bg-zinc-50 p-7'>
						<h2 className='mx-4 mt-3 mb-5 text-center'>
							Edit home address
							<SearchBox
								accessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY as string}
								options={{ language: 'en', country: 'SG' }}
								onRetrieve={(e) =>
									label === 'home'
										? setFavoriteLocation({
												...favoriteLocation,
												home: e.features[0].geometry.coordinates,
												homeName: e.features[0].properties.name,
										  })
										: setFavoriteLocation({
												...favoriteLocation,
												work: e.features[0].geometry.coordinates,
												workName: e.features[0].properties.name,
										  })
								}
								value='Search for a location'
							/>
						</h2>
						<div className='flex gap-5'>
							<button
								className='blue-button-hollow'
								onClick={() => setShowModal(false)}
							>
								Cancel
							</button>
							<button
								className='blue-button'
								onClick={() => SetFavoriteLocationAPI(favoriteLocation)}
							>
								<div>Save</div>
							</button>
						</div>
					</div>
				) : null}
			</div>
		</div>
	)
}

export default SearchLocations
