import { SavedLocation } from '@/redux/types'
import { SearchBox } from '@mapbox/search-js-react'
import { useState } from 'react'

export const EditFavoriteLocation = ({
	label,
	setFavoriteLocation,
	favoriteLocation,
	setShowModal,
	SetFavoriteLocationAPI,
}) => {
	const [placeholder, setPlaceholder] = useState<string>(
		'Search for a location'
	)
	return (
		<div className='absolute left-0 right-0 top-48 ml-auto mr-auto flex h-auto w-10/12 flex-col items-center justify-center bg-zinc-50 p-7'>
			<h2 className='mx-4 mt-3 mb-5 text-center'>
				<label className='pb-5'>Edit home address</label>
				<div
					onFocus={() =>
						placeholder === 'Search for a location'
							? setPlaceholder('')
							: placeholder
					}
				>
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
						value={placeholder}
						onChange={(e) => setPlaceholder(e)}
					/>
				</div>
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
	)
}
