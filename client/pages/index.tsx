// First page, for signing in

import React, { useContext, useEffect, useState } from 'react'
import api from '@/api/axiosConfig'
import { useForm } from 'react-hook-form'
import Router from 'next/router'
import { MobileNumber } from '@/components/account/MobileNumber'
import { UserContext } from '@/context/UserContext'
import { LoadingScreen } from '../components/ui/LoadingScreen'
import { Button, HREF, Message } from '@/redux/types/constants'
import { OTPForm } from '../components/account/OTPForm'
import { EmailSignIn } from '../components/account/EmailSignIn'
import { TermsOfService } from '../components/account/TermsOfService'
import { FaEnvelopeOpen, FaGooglePlus, FaGooglePlusG } from 'react-icons/fa'
import RebuLogo from '@/public/images/rebu-logo.png'
import Image from 'next/image'

// Main component
const SignIn = () => {
	const [number, setNumber] = React.useState<string>()
	const [newUser, setNewUser] = React.useState<boolean>(true)
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
					<div className='h-6/12'>
						<Image
							className='ml-auto mr-auto'
							src={RebuLogo}
							width={300}
							height={300}
							alt='Logo'
						/>
						<hr className='ml-auto mr-auto mt-12 h-0.5 w-16 bg-zinc-500' />
					</div>
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

// Sign in via Phone number
const SignInForm = ({ setNumber, setNewUser, setForm }: any) => {
	const {
		register: register,
		handleSubmit: handleSubmit,
		formState: { errors: errors },
	} = useForm()
	const onSubmit = handleSubmit((data) => {
		// @ts-ignore
		setNumber('+' + data.phoneCountryCode + ' ' + data.phoneNumber)
		// @ts-ignore
		checkIfUserExists(data.phoneNumber, data.phoneCountryCode)
	})

	const { setUser } = useContext(UserContext)

	async function checkIfUserExists(
		phoneNumber: string,
		phoneCountryCode: number
	) {
		const response = await api.post('/api/v1/Customer/exists', {
			phoneCountryCode: phoneCountryCode,
			phoneNumber: phoneNumber,
		})

		// If the user does not exist...
		if (response.data === '') {
			const createUser = await api.post('/api/v1/Customer', {
				phoneNumber: phoneNumber,
				phoneCountryCode: phoneCountryCode,
			})
			setUser(createUser.data)
			setNewUser(true)
			// If the user exists but they haven't completed registration...
		} else if (response.data.customerName === null) {
			setUser(response.data)
			setNewUser(true)
			// If the user exists
		} else {
			setUser(response.data)
			setNewUser(false)
			localStorage.setItem('user', JSON.stringify(response.data))
		}
	}

	return (
		<>
			{/* User form */}
			<MobileNumber register={register} errors={errors} />

			{/* <TermsOfService /> */}
		</>
	)
}

export default SignIn
