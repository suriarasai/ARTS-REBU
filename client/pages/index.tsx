// First page, for signing in

import { useEffect, useState } from 'react'
import Router from 'next/router'
import { MobileNumber } from '@/components/account/MobileNumber'
import { LoadingScreen } from '../components/ui/LoadingScreen'
import { HREF } from '@/constants'
import { EmailSignIn } from '../components/account/EmailSignIn'
import { FaEnvelopeOpen, FaKey } from 'react-icons/fa'
import { MainScreenVisual } from '@/components/ui/MainScreenVisual'
import { useRecoilState } from 'recoil'
import { userAtom } from '@/utils/state'

// Main component
const SignIn = () => {
	const [loading, setLoading] = useState(true)
	const [form, setForm] = useState('main')
	const [user, setUser] = useRecoilState(userAtom)

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
		<main className='ml-auto mr-auto flex h-screen max-w-screen-md justify-center bg-zinc-50 pb-16 pt-20 sm:pb-0'>
			{loading ? (
				<LoadingScreen />
			) : (
				<div className='p-6'>
					<MainScreenVisual />
					<div className='mt-12'>
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
		<button
			className='flex items-center bg-green-200 px-5 py-2 font-medium text-zinc-600 shadow-md'
			onClick={() => Router.push(HREF.BOOKINGUI)}
		>
			{/* <FaGooglePlusG className='mr-3' />
			Google */}
			<FaKey className='mr-3' />
			Admin
		</button>
	</div>
)

export default SignIn
