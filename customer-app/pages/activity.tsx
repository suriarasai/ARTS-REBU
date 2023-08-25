// Displays user activity (ex. booked rides, reviews)

import Page from '@/components/ui/page'
import { Title } from '@/constants'
import { Suspense, useEffect, useState } from 'react'
import {
	FaAngleDown,
	FaAngleRight,
	FaCalendarDay,
	FaCheckCircle,
	FaClock,
	FaMinusCircle,
	FaPlayCircle,
} from 'react-icons/fa'
import { PulseLoadingVisual } from '@/components/ui/PulseLoadingVisual'
import { getBookingsByCustomerID } from '@/server'
import Receipt from '@/components/Map/TripScreens/Arrival/Receipt'
import { userAtom } from '@/state'
import { useRecoilValue } from 'recoil'

const DateFilter = (
	<button className='date-filter-button'>
		<FaCalendarDay className='mr-3' />
		All Dates
		<FaAngleDown className='ml-3' />
	</button>
)

const Activity = () => {
	const user = useRecoilValue(userAtom)

	// On-click styling for the tabbers
	const [activeTab, setActiveTab] = useState<string>('Upcoming')
	const [tripList, setTripList] = useState<Array<Object>>([])
	const [bookingID, setBookingID] = useState<number | null>(null)

	useEffect(() => {
		// Retrieve all bookings associated with a user
		getBookingsByCustomerID(user.customerID as number, setTripList)
	}, [])

	if (bookingID) {
		return (
			<div className='responsive h-screen w-screen bg-white px-10 py-3'>
				<Receipt bookingID={bookingID} setScreen={() => setBookingID(null)} />
			</div>
		)
	}

	return (
		<Page title={Title.ACTIVITY} className='h-screen overflow-y-hidden'>
			{DateFilter}

			<TabController activeTab={activeTab} setActiveTab={setActiveTab} />

			<Suspense fallback={<PulseLoadingVisual />}>
				<TripList
					tripList={tripList}
					activeTab={activeTab}
					setBookingID={setBookingID as any}
				/>
			</Suspense>
		</Page>
	)
}

export default Activity

const TripList = ({
	tripList,
	activeTab,
	setBookingID,
}: {
	tripList: any
	activeTab: string
	setBookingID: React.Dispatch<React.SetStateAction<number>>
}) => {
	return (
		<div className='h-96 overflow-auto'>
			{tripList.length !== 0 ? (
				tripList.map(
					(trip: any, index: number) =>
						// Filter by upcoming trips (requested or dispatch status)
						((activeTab === 'Upcoming' &&
							['requested', 'dispatched'].includes(trip['status'])) ||
							// or... Filter by previous trips (cancelled or completed status)
							(activeTab === 'Previous' &&
								['completed', 'cancelled'].includes(trip['status']))) && (
							<TripDetails
								trip={trip}
								key={index}
								setBookingID={setBookingID}
							/>
						)
				)
			) : (
				<p className='ml-3 mt-3'>No trips found</p>
			)}
		</div>
	)
}

const TripDetails = ({
	trip,
	setBookingID,
}: {
	trip: any
	setBookingID: React.Dispatch<React.SetStateAction<number>>
}) => {
	return (
		<div
			className='trip-container'
			onClick={() => setBookingID(trip.bookingID)}
		>
			<StatusIcon status={trip['status']} />
			<LocationInfo
				address1={trip['dropLocation']['address']}
				name1={trip['dropLocation']['placeName']}
				address2={trip['pickUpLocation']['address']}
				name2={trip['pickUpLocation']['placeName']}
			/>
			<TripStatistics
				fare={trip['fare']}
				distance={trip['distance']}
				date={trip['messageSubmittedTime']}
			/>
			<FaAngleRight className='order-3 mb-auto mt-auto w-1/12' />
		</div>
	)
}

const TabController = ({
	activeTab,
	setActiveTab,
}: {
	activeTab: string
	setActiveTab: React.Dispatch<React.SetStateAction<string>>
}) => (
	<ul className='flex'>
		<li className='mr-2 flex-1'>
			<a
				className={activeTab === 'Upcoming' ? 'active-tab' : 'inactive-tab'}
				onClick={() => setActiveTab('Upcoming')}
			>
				Upcoming
			</a>
		</li>
		<li className='mr-2 flex-1'>
			<a
				className={activeTab === 'Previous' ? 'active-tab' : 'inactive-tab'}
				onClick={() => setActiveTab('Previous')}
			>
				Previous
			</a>
		</li>
	</ul>
)

// Icon for pending, dispatched, cancelled, and completed rides
const StatusIcon = ({ status }: { status: string }) => (
	<div className='center w-2/12'>
		{status === 'requested' && <FaClock className='trip-icon text-zinc-500' />}
		{status === 'dispatched' && (
			<FaPlayCircle className='trip-icon text-yellow-500' />
		)}
		{status === 'cancelled' && (
			<FaMinusCircle className='trip-icon text-red-500' />
		)}
		{status === 'completed' && (
			<FaCheckCircle className='trip-icon text-green-500' />
		)}
	</div>
)

// Location details of the ride
const LocationInfo = ({
	address1,
	name1,
	address2,
	name2,
}: {
	address1: string
	name1: string
	address2: string
	name2: string
}) => (
	<div className='cut-text w-6/12 flex-col items-center pl-3'>
		<h2 className='mb-1'>{name1 || address1}</h2>
		<h5>from | {name2 || address2}</h5>
	</div>
)

// Numeric details of the ride
const TripStatistics = ({
	fare,
	distance,
	date,
}: {
	fare: number
	distance: number
	date: string
}) => {
	const dt = new Date(parseInt(date, 10))
	return (
		<div className='order-2 mb-auto mt-auto w-4/12 text-right'>
			<h1>${fare}</h1>
			<h5>
				{dt.toLocaleDateString()} | {(distance / 1000).toFixed(1)} km
			</h5>
		</div>
	)
}
