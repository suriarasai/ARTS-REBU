// First page, for signing in

import React, { useContext, useEffect, useState } from 'react'
import Router from 'next/router'
import { MobileNumber } from '@/components/account/MobileNumber'
import { UserContext } from '@/context/UserContext'
import { LoadingScreen } from '../components/ui/LoadingScreen'
import { HREF } from '@/redux/types/constants'
import { EmailSignIn } from '../components/account/EmailSignIn'
import { FaEnvelopeOpen, FaGooglePlusG } from 'react-icons/fa'
import { MainScreenVisual } from '@/components/ui/MainScreenVisual'

// Main component
const SignIn = () => {
	const [loading, setLoading] = React.useState(true)
	const [form, setForm] = useState('main')
	const { setUser } = useContext(UserContext)

	useEffect(() => {
		const loggedInUser = localStorage.getItem('user')
		if (loggedInUser !== null) {
			setUser(JSON.parse(loggedInUser))
			Router.push(HREF.HOME)
		} else {
			setLoading(false)
		}
	}, [])

	return (
		<main className='flex h-screen max-w-screen-md justify-center bg-zinc-50 pb-16 pt-20 sm:pb-0'>
			{loading ? (
				LoadingScreen
			) : (
				<div className='p-6'>
					<MainScreenVisual />
					<div>
						{form === 'main' ? (
							<MobileNumber />
						) : form === 'email' ? (
							<EmailSignIn setForm={setForm} />
						) : (
							'Error'
						)}
					</div>

					{form !== 'email' && <AlternateSignIn setForm={setForm} />}
				</div>
			)}
		</main>
	)
}

const AlternateSignIn = ({ setForm }) => (
	<div className='mb-8 mt-16 flex text-zinc-400'>
		<h3 className='font-base mr-5 flex items-center'>Or connect using</h3>
		<button
			className='mr-3 flex items-center bg-green-200 px-5 py-2 font-medium text-zinc-600 shadow-md'
			onClick={() => setForm('email')}
		>
			<FaEnvelopeOpen className='mr-3' />
			Email
		</button>
		<button className='flex items-center bg-green-200 px-5 py-2 font-medium text-zinc-600 shadow-md'>
			<FaGooglePlusG className='mr-3' />
			Google
		</button>
	</div>
)

export default SignIn
