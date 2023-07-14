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

const Dispatch = ({ taxiETA }) => {
	const booking = useRecoilValue(bookingAtom)

	if (!booking) {
		return <LoadingScreen />
	}

	return (
		<>
			<DriverInformation booking={booking} />
			{/* <CarInformation booking={booking} /> */}
			<TripInformation booking={booking} />
			<TripStatistics booking={booking} />
		</>
	)
}

export default Dispatch

const CarInformation = ({ booking }) => (
	<div className='flex items-center space-x-4 border-b border-zinc-200 px-6 py-2'>
		<FaCar className='text-3xl' />
		<div>
			<b className=''>{booking.taxiNumber}</b>
			<h5>
				{booking.taxiColor} {booking.taxiMakeModel}
			</h5>
		</div>

	</div>
)

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
	<div className='rounded-t-xl border-b border-zinc-400'>
		<div className='flex space-x-3 px-6 py-4'>
			<div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-300'>
				<FaUser />
			</div>
			<div className=''>
				{booking.driverName}
				{/* <div className='flex space-x-2'> */}
				<div>
					{/* <FaStar className='text-yellow-400' /> */}
					{/* <h5>{booking.rating}</h5> */}
					<h5>{booking.taxiColor} {booking.taxiMakeModel}</h5>
				</div>
			</div>
			<div className='!ml-auto border border-zinc-200 px-3 py-1 flex items-center rounded-xl'>
				<p className='!font-semibold text-green-600'>{booking.taxiNumber}</p>
			</div>
			{/* <div className='!ml-auto flex space-x-3'>
				<div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-300'>
					<FaComments />
				</div>
				<div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-300'>
					<FaPhone />
				</div>
			</div> */}
		</div>
	</div>
)
