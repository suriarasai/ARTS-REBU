import { produceKafkaDispatchEvent } from '@/server'
import { useEffect, useState } from 'react'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

const dispatchEvent = {
	customerID: 1,
	customerName: 'namae',
	customerPhoneNumber: 12345678,
	status: 'dispatched',
	tmdtid: 1,
	taxiNumber: 'SG 123456',
	taxiPassengerCapacity: 4,
	taxiMakeModel: 'Honda Civic',
	taxiColor: 'Grey',
	driverID: 1,
	driverName: 'kakkoi na utente',
	driverPhoneNumber: 87654321,
	sno: 1,
	rating: 4.92,
}

const taxiLocatorEvent = {
	tmdtid: 1,
	driverID: 1,
	taxiNumber: 'SG 123456',
	currentPosition: {
		lat: 103.21,
		lng: 1.32,
	},
	availabilityStatus: true,
}

const socket = new SockJS('http://localhost:8080/ws')
let dispatchClient: any = null

const DriverApp = ({}) => {
	const [bookingStream, setBookingStream] = useState(false)
	const toggleBookingStream = () => setBookingStream(!bookingStream)

	// Booking stream listener: Looking for rides to match with
	useEffect(() => {
		if (!bookingStream) return

		const socket = new SockJS('http://localhost:8080/ws')
		const client = Stomp.over(socket)

		client.connect({}, () => {
			client.subscribe('/topic/bookingEvent', (message) => {
				JSON.parse(message.body)
			})
		})

		return () => {
			client.disconnect(() => console.log('Disconnected from server'))
		}
	}, [bookingStream])

	function produceDispatchEvent() {
		produceKafkaDispatchEvent(JSON.stringify(dispatchEvent))
	}

	function produceLocationEvent() {}

	return (
		<>
			<button
				className='rounded-sm bg-zinc-600 p-4 text-white'
				onClick={toggleBookingStream}
			>
				Toggle Booking Stream
			</button>
			<button
				className='rounded-sm bg-zinc-600 p-4 text-white'
				onClick={produceDispatchEvent}
			>
				Create Dispatch Event
			</button>
			<button
				className='rounded-sm bg-zinc-600 p-4 text-white'
				onClick={produceLocationEvent}
			>
				Create Location Event
			</button>
		</>
	)
}

export default DriverApp
