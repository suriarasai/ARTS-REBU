import { FaPlusCircle, FaPlusSquare } from 'react-icons/fa'
import { BackButton } from '@/components/booking/backButton'
import { InputCurrentLocation } from './InputCurrentLocation'
import { InputDestinationLocation } from './InputDestinationLocation'
import { HideTaxis } from '@/utils/hideTaxis'
import { useState } from 'react'

export function LocationSearch(
	setMarker,
	expandSearch: number,
	setExpandSearch,
	originRef,
	setOrigin,
	isValidInput,
	destinationRef,
	setDestination,
	calculateRoute,
	validInput
) {
	return (
		<div className='location-search-header'>
			{expandSearch !== 0 && (
				<div className='absolute left-0 top-0 z-50 ml-1 mt-5'>
					<BackButton
						expandSearch={expandSearch}
						setExpandSearch={setExpandSearch}
					/>
				</div>
			)}
			<div className='relative w-full px-6 pl-10 pt-2'>
				<div className='pr-12'>
					{/* Origin Search */}
					<InputCurrentLocation
						setExpandSearch={setExpandSearch}
						originRef={originRef}
						setOrigin={setOrigin}
						isValidInput={isValidInput}
					/>

					<hr className='mb-1 ml-auto mr-auto mt-1 bg-zinc-300' />

					{/* Destination Search */}
					<InputDestinationLocation
						setExpandSearch={setExpandSearch}
						destinationRef={destinationRef}
						setDestination={setDestination}
						isValidInput={isValidInput}
					/>
				</div>
				<div className='absolute bottom-0 right-0 mb-2 mr-6 text-3xl text-green-600'>
					<FaPlusCircle onClick={() => {}} />
				</div>
			</div>

			{validInput && (
				<div className='w-full px-6 py-3'>
					<div className='flex w-full justify-center'>
						<button
							className='directions-button'
							type='submit'
							onClick={calculateRoute}
						>
							<p className='font-normal'>Calculate Routes</p>
						</button>
					</div>
				</div>
			)}
		</div>
	)
}
