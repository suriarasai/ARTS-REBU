import { produceKafkaBookingEvent } from '@/server'
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

// 1. Produce bookingEvent
// 2. Consume dispatchEvent
// 3. Consume taxiLocatorEvent

const socket = new SockJS('http://localhost:8080/ws')
let dispatchClient: any = null

const UserApp = ({}) => {
	const [dispatchStream, setDispatchStream] = useState(false)
	const [locationStream, setLocationStream] = useState(false)

	const toggleDispatchStream = () => setDispatchStream(!dispatchStream)
	const toggleLocationStream = () => setLocationStream(!locationStream)

	// Dispatch stream listener: Waiting to be matched
	useEffect(() => {
		if (!dispatchStream) return

		const socket = new SockJS('http://localhost:8080/ws')
		const client = Stomp.over(socket)

		client.connect({}, () => {
			client.subscribe('/topic/dispatchEvent', (message) => {
				JSON.parse(message.body)
			})
		})

		return () => {
			client.disconnect(() => console.log('Disconnected from server'))
		}
	}, [dispatchStream])

	function produceBookingEvent() {
		produceKafkaBookingEvent(JSON.stringify(bookingEvent))
	}

	return (
		<>
			<button
				className='rounded-sm bg-zinc-600 p-4 text-white'
				onClick={toggleDispatchStream}
			>
				Toggle Dispatch Stream
			</button>
			<button
				className='rounded-sm bg-zinc-600 p-4 text-white'
				onClick={produceBookingEvent}
			>
				Create Test Event
			</button>
		</>
	)
}

export default UserApp
