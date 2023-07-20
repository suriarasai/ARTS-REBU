import UserApp from './userApp'
import DriverApp from './driverApp'
import { useState } from 'react'
import { message } from '@/constants'
import { useRouter } from 'next/router'

const AdminMainPage = () => {
	const [messages, setMessages] = useState<message[]>([])
	const [customerID, setCustomerID] = useState(1)

	const addMessage = (newMsg: message) =>
		setMessages((messages) => [...messages, newMsg])
	const clearMessages = () => setMessages([])
	const returnToSignIn = () => useRouter().push('/')

	return (
		<div className='flex h-screen max-w-screen-md flex-col justify-center space-y-5 !overflow-y-hidden p-4'>
			{/* Button controls */}
			<div className='flex items-center space-x-2'>
				<button
					onClick={returnToSignIn}
					className='mr-5 w-fit bg-zinc-200 p-1 text-xs'
				>
					Go Back
				</button>
				<p>User ID</p>
				<input
					className='h-8 w-12'
					onBlur={(event) => setCustomerID(Number(event?.target.value))}
					type='number'
				/>
			</div>
			<div className='ml-auto mr-auto flex h-2/5 space-x-5'>
				<UserApp addMsg={(newMsg: message) => addMessage(newMsg)} />
				<DriverApp addMsg={(newMsg: message) => addMessage(newMsg)} />
			</div>
			<hr />

			{/* Outputting stream data */}
			<div className='h-2/5 space-y-3'>
				<div className='flex items-center space-x-5'>
					<h1>Stream Logs</h1>
					<button onClick={clearMessages} className='bg-zinc-200 p-1 text-xs'>
						Clear
					</button>
				</div>
				<div className='flex h-4/5 flex-col space-y-1 overflow-y-auto'>
					{messages.toReversed().map((msg: message, index) => (
						<>
							<div className='text-xs' key={index}>
								{msg.stream}
								<br />
								{JSON.stringify(msg.message)}
							</div>
							<hr />
						</>
					))}
				</div>
			</div>
		</div>
	)
}

export default AdminMainPage
