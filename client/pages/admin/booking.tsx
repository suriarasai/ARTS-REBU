import { produceKafkaBookingEvent, produceKafkaDispatchEvent } from '@/server'
import { bookingEvent } from '@/utils/state'
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

	const addBooking = (newEvent: bookingEvent) =>
		setBookingEvents((bookingEvents) => [...bookingEvents, newEvent])
	const clearBookingEvents = () => setBookingEvents([])

	// Booking stream consumer: Looking for rides to match with
	useEffect(() => {
		const socket = new SockJS('http://localhost:8080/ws')
		const client = Stomp.over(socket)

		client.connect({}, () => {
			client.subscribe('/topic/bookingEvent', (newEvent) => {
				addBooking(JSON.parse(newEvent.body))
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
				className='rounded-sm bg-green-600 px-2 py-1 mr-2 text-xs text-white'
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
				(booking, index) => (
					<BookingEntry booking={booking} key={index} />
				),
				[]
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

const BookingEntry = ({ booking }: { booking: bookingEvent }) => {
	return (
		<div className='flex my-1'>
			{booking.customerID}
			<button className='bg-green-200 p-1 text-xs ml-4' onClick={() => produceDispatchEvent(booking)}>Approve</button>
		</div>
	)
}

export default AdminMainPage
