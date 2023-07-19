import { sendBookingToKafka } from '@/server'
import Stomp from 'stompjs'
import SockJS from 'sockjs-client'
import { useEffect, useState } from 'react'

const Test = ({}) => {
	const [stompClient, setStompClient] = useState<any>(null)
	const [connected, setConnected] = useState<boolean>(false)

	useEffect(() => {

		if (!connected) return

		const socket = new SockJS('http://localhost:8080/ws')
		const client = Stomp.over(socket)

		client.connect({}, () => {
			client.subscribe('/topic/bookingEvent', (message) => {
				const receivedMessage = JSON.parse(message.body)
			})
		})

		setStompClient(client)

		return () => {
			client.disconnect(() => console.log("Disconnected from server"))
		}
	}, [connected])

	function handleTestEvent() {
		sendBookingToKafka(JSON.stringify({ message: 'test' }))
	}

	return (
		<>
			<button
				className='rounded-sm bg-zinc-600 p-4 text-white'
				onClick={() => setConnected(!connected)}
			>
				{connected ? "Stop " : "Start "} Listening
			</button>
			<button
				className='rounded-sm bg-zinc-600 p-4 text-white'
				onClick={handleTestEvent}
			>
				Create Test Event
			</button>
		</>
	)
}

export default Test
