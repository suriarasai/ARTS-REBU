import { produceKafkaBookingEvent, produceKafkaDispatchEvent } from '@/server'
import { bookingEvent } from '@/state'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

const bookingEvent = {
	bookingID: 1,
	customerID: 1,
	messageSubmittedTime: 1,
	customerName: 'Chu',
	phoneNumber: 12345678,
	taxiType: 'regular',
	fareType: 'metered',
	fare: 10.23,
	distance: 1200,
	paymentMethod: 'cash',
	eta: 600,
	pickUpLocation: {
		placeName: 'NUS ISS',
		lat: 103.12,
		lng: 1.37,
		address: '25 Heng Keng Mui Terrace',
		placeID: 'a1234',
	},
	dropLocation: {
		placeName: 'NUS High School',
		lat: 103.24,
		lng: 1.38,
		address: '40 Clementi Road 1',
		placeID: 'b1231',
	},
	pickUpTime: null,
	status: 'requested',
	dropTime: null,
	rating: null,
}

const AdminMainPage = () => {
	const router = useRouter()
	const [bookingEvents, setBookingEvents] = useState<bookingEvent[]>([])

	const addBooking = (newEvent: bookingEvent, randInt: boolean = false) => {
		if (randInt) newEvent.customerID = Math.floor(Math.random() * 1000)
		setBookingEvents((bookingEvents) => [...bookingEvents, newEvent])
	}
	const clearBookingEvents = () => setBookingEvents([])

	const removeBooking = (key: number) => {
		setBookingEvents((bookingEvents) =>
			bookingEvents.filter((item) => item.customerID !== key)
		)
		console.log(key)
	}

	// Booking stream consumer: Looking for rides to match with
	useEffect(() => {
		const socket = new SockJS('http://localhost:8080/ws')
		const client = Stomp.over(socket)

		client.connect({}, () => {
			client.subscribe('/topic/bookingEvent', (newEvent) => {
				addBooking(JSON.parse(newEvent.body), false)
			})
		})

		return () => {
			client.disconnect(() => console.log('Disconnected from server'))
		}
	}, [])

	// Booking stream producer: Creating a booking request
	function produceBookingEvent() {
		produceKafkaBookingEvent(JSON.stringify(bookingEvent))
	}

	{
		/* <button onClick={() => router.push('/admin/sandbox')}>Sandbox</button> */
	}

	return (
		<div className='max-w-screen-md p-4'>
			<button
				className='mr-2 rounded-sm bg-green-600 px-2 py-1 text-xs text-white'
				onClick={produceBookingEvent}
			>
				Create Booking Event
			</button>
			<button
				className='rounded-sm bg-zinc-400 px-2 py-1 text-xs text-white'
				onClick={clearBookingEvents}
			>
				Clear Events
			</button>

			{bookingEvents.map(
				(booking, index) =>
					booking.status === 'requested' && (
						<BookingEntry
							booking={booking}
							removeBooking={removeBooking}
							key={index}
						/>
					)
			)}
		</div>
	)
}

// Dispatch stream producer: Approving a ride request
function produceDispatchEvent(booking: bookingEvent) {
	produceKafkaDispatchEvent(
		JSON.stringify({
			customerID: booking.customerID,
			customerName: booking.customerName,
			customerPhoneNumber: booking.phoneNumber,
			status: 'dispatched',
			tmdtid: 1,
			taxiNumber: 'SG 123456',
			taxiPassengerCapacity: 4,
			taxiMakeModel: 'Honda Civic',
			taxiColor: 'Grey',
			driverID: 1,
			driverName: 'Mr Taxi Driver',
			driverPhoneNumber: 12345678,
			sno: 1,
			rating: 4.92,
		})
	)
}

const BookingEntry = ({
	booking,
	removeBooking,
}: {
	booking: bookingEvent
	removeBooking: Function
}) => {
	function handleApproval() {
		produceDispatchEvent(booking)
		removeBooking(booking.customerID)
	}

	return (
		<div className='my-1 flex'>
			{booking.customerID}
			<button
				className='ml-4 bg-green-200 p-1 text-xs'
				onClick={handleApproval}
			>
				Approve
			</button>
		</div>
	)
}

export default AdminMainPage
