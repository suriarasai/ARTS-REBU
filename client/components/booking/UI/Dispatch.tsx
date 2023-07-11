import {
	FaCar,
	FaComments,
	FaFlag,
	FaPhone,
	FaRoad,
	FaStar,
	FaThumbtack,
	FaUser,
} from 'react-icons/fa'

const Dispatch = ({ dispatchEvent, bookingEvent }) => {
	return (
		<div className='absolute bottom-0 w-screen p-4'>
			<div className='responsive w-full max-w-md rounded-xl bg-white shadow-md'>
				<DriverInformation dispatchEvent={dispatchEvent} />
				<TripInformation bookingEvent={bookingEvent} />
				<CarInformation dispatchEvent={dispatchEvent} />
				<TripStatistics bookingEvent={bookingEvent} />
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
	<div className='flex items-center space-x-5 border-b border-zinc-200 p-4'>
		<div className='flex flex-1 flex-col space-y-2'>
			<h5 className='ml-auto mr-auto'>License</h5>
			<b className='ml-auto mr-auto'>{dispatchEvent.taxiNumber}</b>
		</div>
		<div className='flex flex-1 flex-col space-y-2'>
			<h5 className='ml-auto mr-auto'>Car Make</h5>
			<b className='ml-auto mr-auto'>
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
			<FaFlag className='mr-3 text-red-400' />
			{bookingEvent.dropLocation.placeName}
		</div>
	</div>
)

const DriverInformation = ({ dispatchEvent }) => (
	<div className='flex space-x-5 rounded-t-xl border-b border-zinc-200 bg-zinc-50 p-4'>
		<div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-300'>
			<FaUser />
		</div>
		<div className=''>
			{dispatchEvent.driverName}
			<div className='flex space-x-2'>
				<FaStar className='text-yellow-400' />
				<h5>{dispatchEvent.rating}</h5>
			</div>
		</div>
		<div className='!ml-auto flex space-x-5'>
			<div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-300'>
				<FaComments />
			</div>
			<div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-300'>
				<FaPhone />
			</div>
		</div>
	</div>
)
