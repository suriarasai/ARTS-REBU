import { produceKafkaBookingEvent } from '@/server'
import { useEffect, useState } from 'react'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { message } from '@/constants'

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

const UserApp = ({ addMsg }: { addMsg: Function }) => {
	const [dispatchStream, setDispatchStream] = useState(false)
	const [locationStream, setLocationStream] = useState(false)

	const toggleDispatchStream = () => setDispatchStream(!dispatchStream)
	const toggleLocationStream = () => setLocationStream(!locationStream)

	// Dispatch stream consumer: Waiting to be matched
	useEffect(() => {
		if (!dispatchStream) return

		const socket = new SockJS('http://localhost:8080/ws')
		const client = Stomp.over(socket)

		client.connect({}, () => {
			client.subscribe('/user/' + 1 + '/queue/dispatchEvent', (message) => {
				addMsg({ stream: 'dispatch', message: JSON.parse(message.body) })
			})
		})

		return () => {
			client.disconnect(() => console.log('Disconnected from server'))
		}
	}, [dispatchStream])

	// Location stream consumer: Tracking the taxi
	useEffect(() => {
		if (!locationStream) return

		const socket = new SockJS('http://localhost:8080/ws')
		const client = Stomp.over(socket)

		client.connect({}, () => {
			client.subscribe('/topic/taxiLocatorEvent', (message) => {
				addMsg({ stream: 'taxiLocator', message: JSON.parse(message.body) })
			})
		})

		return () => {
			client.disconnect(() => console.log('Disconnected from server'))
		}
	}, [locationStream])

	// Booking stream producer: Creating a booking request
	function produceBookingEvent() {
		produceKafkaBookingEvent(JSON.stringify(bookingEvent))
	}

	return (
		<div className='flex w-44 flex-col rounded-sm border border-zinc-400 bg-zinc-50'>
			<div className='ml-auto mr-auto flex w-full items-center justify-center bg-zinc-600'>
				<h1 className='!text-white'>Customer</h1>
			</div>
			<div className='flex flex-col space-y-1 p-3'>
				<label className='my-1 ml-auto mr-auto'>Consumers</label>
				<button
					className={`rounded-sm  px-2 py-1 text-xs text-white ${dispatchStream ? 'bg-red-600' : 'bg-green-600'}`}
					onClick={toggleDispatchStream}
				>
					{dispatchStream ? '(Off)' : '(On)'} Dispatch Stream
				</button>
				<button
					className={`rounded-sm  px-2 py-1 text-xs text-white ${locationStream ? 'bg-red-600' : 'bg-green-600'}`}
					onClick={toggleLocationStream}
				>
					{locationStream ? '(Off)' : '(On)'} Locator Stream
				</button>
			</div>

			<div className='flex flex-col space-y-1 p-3'>
				<label className='my-1 ml-auto mr-auto'>Producer</label>
				<button
					className='rounded-sm bg-green-600 px-2 py-1 text-xs text-white'
					onClick={produceBookingEvent}
				>
					Create Booking Event
				</button>
			</div>
		</div>
	)
}

export default UserApp
