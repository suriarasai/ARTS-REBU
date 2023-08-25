import { useEffect, useState } from 'react'
import Router from 'next/router'
import { MobileNumber } from '@/components/account/MobileNumber'
import { LoadingScreen } from '../components/ui/LoadingScreen'
import { HREF } from '@/constants'
import { EmailSignIn } from '../components/account/EmailSignIn'
import { FaEnvelopeOpen } from 'react-icons/fa'
import { MainScreenVisual } from '@/components/ui/MainScreenVisual'
import { useRecoilState } from 'recoil'
import { userAtom } from '@/state'

// Main component
const SignIn = () => {
	const [loading, setLoading] = useState(true)
	const [form, setForm] = useState('main') // Toggle for phone/email sign-in
	const [, setUser] = useRecoilState(userAtom)

	// Check for cached user information; if it exists then route to the home screen
	useEffect(() => {
		const loggedInUser = JSON.parse(localStorage.getItem('user') as string)
		if (loggedInUser && loggedInUser.customerName) {
			setUser(loggedInUser)
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
					<div className='mt-16'>
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

// Email sign-in
const AlternateSignIn = ({
	setForm,
}: {
	setForm: React.Dispatch<React.SetStateAction<string>>
}) => (
	<div className='mb-8 mt-16 justify-end flex text-zinc-400'>
		<h3 className='font-base mr-5 flex items-center'>Or connect using</h3>
		<button
			className='flex items-center bg-green-200 px-5 py-2 font-medium text-zinc-600 shadow-md'
			onClick={() => setForm('email')}
		>
			<FaEnvelopeOpen className='mr-3' />
			Email
		</button>
	</div>
)

export default SignIn
