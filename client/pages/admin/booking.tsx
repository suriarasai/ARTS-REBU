import { useRouter } from 'next/router'
import UserApp from './userApp'
import DriverApp from './driverApp'
import { useState } from 'react'
import { message } from '@/constants'

const AdminMainPage = () => {
	const [messages, setMessages] = useState<message[]>([])

	const addMessage = (newMsg: message) =>
		setMessages((messages) => [...messages, newMsg])

	return (
		<div className='flex max-w-screen-md flex-col justify-center space-y-5 p-4 !overflow-y-hidden h-screen'>
			<div className='ml-auto mr-auto flex space-x-5 h-2/5'>
				<UserApp addMsg={(newMsg: message) => addMessage(newMsg)} />
				<DriverApp addMsg={(newMsg: message) => addMessage(newMsg)} />
			</div>
			<hr />
			<div className='space-y-3 h-3/5'>
				<h1>Stream Logs</h1>
				<div className='flex flex-col space-y-1 overflow-y-auto h-4/5'>
					{messages.map((msg: message, index) => (
						<div className='text-xs' key={index}>
							{msg.stream}
							<br />
							{JSON.stringify(msg.message)}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default AdminMainPage
