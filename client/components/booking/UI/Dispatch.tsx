import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { bookingAtom, screenAtom } from '@/utils/state'
import { useState } from 'react'
import {
	FaCar,
	FaComments,
	FaFlag,
	FaHashtag,
	FaPhone,
	FaRoad,
	FaStar,
	FaThumbtack,
	FaUser,
} from 'react-icons/fa'
import { useRecoilValue } from 'recoil'

const Dispatch = () => {
	const booking = useRecoilValue(bookingAtom)

	return (
		<>
			<DriverInformation booking={booking} />
			<TripInformation booking={booking} />
			<TripStatistics booking={booking} />
		</>
	)
}

export default Dispatch

const TripStatistics = ({ booking }) => (
	<div className='flex items-center space-x-5 p-4'>
		<FaRoad className='flex-1 text-3xl' />
		<div className='flex flex-1 flex-col space-y-2'>
			<h5 className='ml-auto mr-auto'>DISTANCE</h5>
			<b className='ml-auto mr-auto'>
				{(booking.distance / 1000).toFixed(1)} km
			</b>
		</div>
		<div className='flex flex-1 flex-col space-y-2'>
			<h5 className='ml-auto mr-auto'>TIME</h5>
			<b className='ml-auto mr-auto'>{(booking.eta / 60).toFixed(1)} min</b>
		</div>
		<div className='flex flex-1 flex-col space-y-2'>
			<h5 className='ml-auto mr-auto'>PRICE</h5>
			<b className='ml-auto mr-auto'>${booking.fare}</b>
		</div>
	</div>
)

const TripInformation = ({ booking }) => (
	<div className='space-y-3 border-b border-zinc-200 p-4 px-6'>
		<div className='flex items-center'>
			<FaThumbtack className='mr-3 text-green-400' />
			{booking.pickUpLocation.placeName}
		</div>
		<hr />
		<div className='flex items-center'>
			<FaFlag className='mr-3 text-green-400' />
			{booking.dropLocation.placeName}
		</div>
	</div>
)

const DriverInformation = ({ booking }) => (
	<div className='border-b border-zinc-300'>
		<div className='flex space-x-3 px-6 py-4'>
			<div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-300'>
				<FaUser />
			</div>
			<div className=''>
				{booking.driverName}
				<div>
					<h5>
						{booking.taxiColor} {booking.taxiMakeModel}
					</h5>
				</div>
			</div>
			<div className='!ml-auto flex items-center rounded-xl border border-zinc-200 px-3 py-1'>
				<p className='!font-semibold text-green-600'>{booking.taxiNumber}</p>
			</div>
		</div>
	</div>
)
