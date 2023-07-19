import { sendBookingToKafka } from '@/server'

const Test = ({}) => {
	const connect = () => {}

	const onConnected = () => {}

	const onMessageReceived = (payload: any) => {}

	function handleTestEvent() {
		sendBookingToKafka('Inbound message, ' + +new Date())
	}
	return (
		<>
			<button
				className='rounded-sm bg-zinc-600 p-4 text-white'
				onClick={connect}
			>
				Start Listening
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
