import { dispatchAtom, bookingAtom, tripStatsAtom } from '@/state'
import { bookingEvent } from '@/types'
import {
	FaUser,
	FaComment,
	FaPhone,
	FaThumbtack,
	FaFlag,
	FaRoad,
	FaStar,
} from 'react-icons/fa'
import { useRecoilValue } from 'recoil'

export function DriverInformation() {
	const dispatch = useRecoilValue(dispatchAtom)

	return (
		<div className='border-b border-zinc-400'>
			<div className='flex space-x-3 px-6 py-4'>
				<div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-200'>
					<FaUser />
				</div>
				<div className='text-zinc-100'>
					{dispatch.driverName}
					<h5 className='!text-zinc-300'>
						{dispatch.taxiColor} {dispatch.taxiMakeModel}
					</h5>
				</div>
				<div className='!ml-auto flex items-center space-x-3 text-green-200'>
					<div className='mr-3 rounded-md bg-green-200 px-2 py-1 text-gray-700'>
						<p className='!font-semibold'>{dispatch.taxiNumber}</p>
					</div>
					<FaComment />
					<FaPhone />
				</div>
			</div>
		</div>
	)
}
export function RouteInformation() {
	const booking = useRecoilValue(bookingAtom)

	return (
		<div className='space-y-3 border-b border-zinc-400 p-4 px-6'>
			<div className='flex items-center text-sm text-zinc-100'>
				<FaThumbtack className='mr-3 text-green-200' />
				{booking.pickUpLocation!.placeName}
			</div>
			<hr className='border-zinc-400' />
			<div className='flex items-center text-sm text-zinc-100'>
				<FaFlag className='mr-3 text-green-200' />
				{booking.dropLocation!.placeName}
			</div>
		</div>
	)
}
export function TripInformation() {
	const tripStatistics = useRecoilValue(tripStatsAtom)
	const booking = useRecoilValue<bookingEvent>(bookingAtom)

	return (
		<div className='flex items-center space-x-5 p-4'>
			<FaRoad className='flex-1 text-3xl text-green-200' />
			<div className='flex flex-1 flex-col space-y-2'>
				<h5 className='ml-auto mr-auto !text-zinc-300'>DISTANCE</h5>
				<b className='ml-auto mr-auto text-zinc-100'>
					{(tripStatistics.distance! / 1000).toFixed(1)} km
				</b>
			</div>
			<div className='flex flex-1 flex-col space-y-2'>
				<h5 className='ml-auto mr-auto !text-zinc-300'>ARRIVAL</h5>
				<b className='ml-auto mr-auto text-zinc-100'>
					{new Date(
						(booking.messageSubmittedTime as number) +
							tripStatistics.duration * 1000
					)
						.toLocaleTimeString('en-US')
						.replace(/(.*)\D\d+/, '$1')}
				</b>
			</div>
			<div className='flex flex-1 flex-col space-y-2'>
				<h5 className='ml-auto mr-auto !text-zinc-300'>FARE</h5>
				<b className='ml-auto mr-auto text-zinc-100'>${booking.fare}</b>
			</div>
		</div>
	)
}

export function RateTrip({ setShowRatingForm }) {
	return (
		<div className='flex items-center border-b border-zinc-400 p-4 px-6 text-sm text-zinc-100'>
			<FaStar className='mr-3 text-green-200' />
			Enjoying your trip?{' '}
			<span
				className='ml-1 text-green-200'
				onClick={() => setShowRatingForm(true)}
			>
				Add a rating
			</span>
		</div>
	)
}
