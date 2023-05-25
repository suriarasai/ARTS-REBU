import Section from '@/components/ui/section'
import { SearchLocationInterface } from '@/redux/types'

const SearchLocations = ({
	user,
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

	return (
		<div className='flex flex-wrap'>
			<div className='w-2/12'></div>
			<div className='w-10/12'>
				{/* Saved locations: Home and Work */}
				<span className='mt-16 ml-3 inline-grid w-full grid-cols-2'>
					{/* TODO: Home/Work Icons */}
					<div>
						<p onClick={() => setDestination(user.savedLocations?.home)}>
							Home
						</p>
						<h5>Set Location</h5>
						{/* TODO: Conditionally change w/address */}
					</div>
					<div>
						<p onClick={() => setDestination(user.savedLocations?.work)}>
							Work
						</p>
						<h5>Set Location</h5>
					</div>
				</span>

				{/* TODO: Hide UI upon search */}
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
			</div>
		</div>
	)
}

export default SearchLocations
