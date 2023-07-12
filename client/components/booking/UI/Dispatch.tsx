import { useState } from 'react'
import {
	FaCar,
	FaComments,
	FaFlag,
	FaHashtag,
	FaRoad,
	FaStar,
	FaThumbtack
} from 'react-icons/fa'

const Dispatch = ({ dispatchEvent, bookingEvent, taxiETA }) => {
	const [collapse, setCollapse] = useState(false)
	const collapseMenu = () => setCollapse(!collapse)

	return (
		<div className='absolute bottom-0 w-screen p-4'>
			<div className='responsive w-full max-w-md rounded-xl bg-white shadow-md'>
				<DriverInformation
					dispatchEvent={dispatchEvent}
					collapseMenu={collapseMenu}
					taxiETA={taxiETA}
				/>
				{!collapse && (
					<>
						<TripInformation bookingEvent={bookingEvent} />
						<CarInformation dispatchEvent={dispatchEvent} />
						<TripStatistics bookingEvent={bookingEvent} />
					</>
				)}
				<div className='p-4'>
					<button className='shadow-xs h-10 w-full rounded-lg bg-green-700 text-zinc-50'>
						Cancel Request
					</button>
				</div>
			</div>
		</div>
	)
}

export default Dispatch

const CarInformation = ({ dispatchEvent }) => (
	<div className='flex items-center justify-center space-x-8 border-b border-zinc-200 px-5 py-2'>
		<div className='flex items-center space-x-4'>
			<h5 className=''>
				<FaHashtag className='text-lg' />
			</h5>
			<b className=''>{dispatchEvent.taxiNumber}</b>
		</div>
		<div className='flex items-center space-x-4'>
			<h5 className=''>
				<FaCar className='text-lg' />
			</h5>
			<b className=''>
				{dispatchEvent.taxiColor} {dispatchEvent.taxiMakeModel}
			</b>
		</div>
	</div>
)

const TripStatistics = ({ bookingEvent }) => (
	<div className='flex items-center space-x-5 p-4'>
		<FaRoad className='flex-1 text-3xl' />
		<div className='flex flex-1 flex-col space-y-2'>
			<h5 className='ml-auto mr-auto'>DISTANCE</h5>
			<b className='ml-auto mr-auto'>
				{(bookingEvent.distance / 1000).toFixed(1)} km
			</b>
		</div>
		<div className='flex flex-1 flex-col space-y-2'>
			<h5 className='ml-auto mr-auto'>TIME</h5>
			<b className='ml-auto mr-auto'>
				{(bookingEvent.duration / 60).toFixed(1)} min
			</b>
		</div>
		<div className='flex flex-1 flex-col space-y-2'>
			<h5 className='ml-auto mr-auto'>PRICE</h5>
			<b className='ml-auto mr-auto'>${bookingEvent.fare}</b>
		</div>
	</div>
)

const TripInformation = ({ bookingEvent }) => (
	<div className='space-y-3 border-b border-zinc-200 p-4 px-6'>
		<div className='flex items-center'>
			<FaThumbtack className='mr-3 text-green-400' />
			{bookingEvent.pickUpLocation.placeName}
		</div>
		<hr />
		<div className='flex items-center'>
			<FaFlag className='mr-3 text-green-400' />
			{bookingEvent.dropLocation.placeName}
		</div>
	</div>
)

const DriverInformation = ({ dispatchEvent, collapseMenu, taxiETA }) => (
	<div className='rounded-t-xl border-b border-zinc-200 bg-zinc-50 pt-1.5'>
		<hr
			className='ml-auto mr-auto w-40 rounded-full border-2 border-zinc-200'
			onClick={collapseMenu}
		/>
		<div className='flex space-x-5 p-4'>
			<div className=''>
				<div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-300'>
					<FaComments />
				</div>
			</div>
			<div className=''>
				{dispatchEvent.driverName}
				<div className='flex space-x-2'>
					<FaStar className='text-yellow-400' />
					<h5>{dispatchEvent.rating}</h5>
				</div>
			</div>
			<div className='!ml-auto flex h-12 w-12 flex-col justify-center bg-green-600 px-2 py-1 text-zinc-50'>
				<h1 className='ml-auto mr-auto !font-semibold'>{taxiETA}</h1>
				<p className='ml-auto mr-auto text-xs'>min.</p>
			</div>
		</div>
	</div>
)