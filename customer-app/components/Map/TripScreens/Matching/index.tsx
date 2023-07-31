import { matchedBooking } from '@/server'
import { bookingAtom, dispatchAtom, screenAtom, userAtom } from '@/state'
import { useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'
import { useRecoilState, useRecoilValue } from 'recoil'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

export function Matching() {
	const [, setDispatch] = useRecoilState(dispatchAtom)
	const [, setScreen] = useRecoilState(screenAtom)
	const nextScreen = () => setScreen('dispatch')
	const user = useRecoilValue(userAtom)
	const booking = useRecoilValue(bookingAtom)

	useEffect(() => {
		const socket = new SockJS('http://localhost:8080/ws')
		const client = Stomp.over(socket)

		client.connect({}, () => {
			client.subscribe(
				'/user/' + user.customerID + '/queue/dispatchEvent',
				(message) => {
					const res = JSON.parse(message.body)
					setDispatch(res)
					console.log("BOOKING", booking.bookingID, res.driverID, res.sno)
					matchedBooking(booking.bookingID, res.driverID, res.sno)
					setScreen('dispatch')
				}
			)
		})

		return () => {
			client.disconnect(() => console.log('Disconnected from server'))
		}
	}, [])

	return (
		<div className='flex flex-col items-center justify-center'>
			<FaSearch className='my-5 text-3xl text-green-300' onClick={nextScreen} />
			<h1 className='my-5 font-medium text-zinc-100'>
				Looking for a driver...
			</h1>
			<h5 className='mb-5 text-zinc-100'>This may take some time</h5>
		</div>
	)
}
