// Displays user activity (ex. booked rides, reviews)
// TODO: Expand for details
// TODO: Review button?
// TODO: Date filter

import Page from '@/components/ui/page'
import { UserContext } from '@/context/UserContext'
import { Title } from '@/redux/types/constants'
import { Suspense, useContext, useEffect, useState } from 'react'
import {
	FaAngleDown,
	FaCalendarDay,
	FaCheckCircle,
	FaClock,
	FaMinusCircle,
	FaPlayCircle,
} from 'react-icons/fa'
import { PulseLoadingVisual } from '@/components/ui/PulseLoadingVisual'
import { getBookingsByCustomerID } from '@/server'

const DateFilter = (
	<button className='date-filter-button'>
		<FaCalendarDay className='mr-3' />
		All Dates
		<FaAngleDown className='ml-3' />
	</button>
)

const Activity = () => {
	const { user } = useContext(UserContext)

	// On-click styling for the tabbers
	const [activeTab, setActiveTab] = useState<string>('Upcoming')

	const [tripList, setTripList] = useState<Array<Object>>([])

	useEffect(() => {
		// Retrieve all bookings associated with a user
		getBookingsByCustomerID(user.customerID, setTripList);
	}, [])

	return (
		<Page title={Title.ACTIVITY}>
			{DateFilter}

			<TabController activeTab={activeTab} setActiveTab={setActiveTab} />

			<Suspense fallback={<PulseLoadingVisual />}>
				{tripList.length !== 0 &&
					tripList.map(
						(trip, index) =>
							// Filter by upcoming trips (requested or dispatch status)
							((activeTab === 'Upcoming' &&
								['requested', 'dispatched'].includes(trip['status'])) ||
								// or... Filter by previous trips (cancelled or completed status)
								(activeTab === 'Previous' &&
									['completed', 'cancelled'].includes(trip['status']))) && (
								<div key={index} className='trip-container'>
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
										id={trip['bookingID']}
										date={trip['pickUpTime']}
									/>
								</div>
							)
					)}
			</Suspense>
		</Page>
	)
}

export default Activity

const TabController = ({ activeTab, setActiveTab }) => (
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
const StatusIcon = ({ status }) => (
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

const LocationInfo = ({ address1, name1, address2, name2 }) => (
	<div className='ml-3 w-9/12 flex-col items-center'>
		<h2 className='mb-1'>{name1 || address1}</h2>
		<h5>from | {name2 || address2}</h5>
	</div>
)

const TripStatistics = ({ fare, distance, id, date }) => (
	// TODO: Time instead of distance
	// TODO: Booking ID
	<div className='order-2 w-3/12 text-right'>
		<h1>${fare}</h1>
		<h5>
			{convertToMonth(date.split('-').slice(0, 2))} | {distance} km
		</h5>
		{/* <h5>
			ID: {id} <br />
		</h5> */}
	</div>
)

const convertToMonth = (date) => {
	const month = date[1]
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	]
	return months[month - 1] + ' ' + date[0]
}
