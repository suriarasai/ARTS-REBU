// First page, for signing in

import React, { useContext, useEffect } from 'react'
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

// Main component
const SignIn = () => {
	const [number, setNumber] = React.useState<string>()
	const [signInForm, changeSignInForm] = React.useState<boolean>(true)
	const [emailSignIn, changeEmailSignIn] = React.useState<boolean>(false)
	const [newUser, setNewUser] = React.useState<boolean>(true)
	const [loading, setLoading] = React.useState(true)
	const { setUser } = useContext(UserContext)

	useEffect(() => {
		// TODO: [object, object]
		const loggedInUser = localStorage.getItem('user')
		if (loggedInUser !== null) {
			setUser(JSON.parse(loggedInUser))
			Router.push(HREF.HOME)
		} else {
			setLoading(false)
		}
	}, [])

	return (
		<main className='mx-auto max-w-screen-md pb-16 pt-20 px-safe sm:pb-0'>
			{loading ? (
				LoadingScreen
			) : (
				<div className='p-6'>
					<h2 className='text-xl font-semibold'>{Message.WELCOME}</h2>
					{signInForm ? (
						<SignInForm
							setNumber={setNumber}
							changeSignInForm={changeSignInForm}
							changeEmailSignIn={changeEmailSignIn}
							setNewUser={setNewUser}
						/>
					) : emailSignIn ? (
						<EmailSignIn
							changeEmailSignIn={changeEmailSignIn}
							changeSignInForm={changeSignInForm}
							newUser={newUser}
						/>
					) : (
						<OTPForm
							phoneNumber={number}
							changeSignInForm={changeSignInForm}
							newUser={newUser}
						/>
					)}
				</div>
			)}
		</main>
	)
}

// Sign in via Phone number
const SignInForm = ({
	setNumber,
	changeSignInForm,
	changeEmailSignIn,
	setNewUser,
}: any) => {
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
		changeSignInForm(false)
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

		if (response.data === '') {
			const createUser = await api.post('/api/v1/Customer', {
				phoneNumber: phoneNumber,
				phoneCountryCode: phoneCountryCode,
			})
			setUser(createUser.data)
			setNewUser(true)
		} else if (response.data.name === null) {
			setUser(response.data)
			setNewUser(true)
		} else {
			setUser(response.data)
			setNewUser(false)
		}
		localStorage.setItem('user', JSON.stringify(response.data))
	}

	return (
		<>
			{/* User form */}
			<form className='flex w-full max-w-lg flex-col' onSubmit={onSubmit}>
				<div className='mt-5'>
					<p className='mb-4 pb-6 text-zinc-600 dark:text-zinc-400'>
						Enter your mobile number
					</p>
				</div>

				<MobileNumber register={register} errors={errors} />

				<div className='mb-8 mt-3 bg-neutral-100 text-zinc-400 dark:bg-neutral-600 dark:text-neutral-200 lg:text-left'>
					<p>{Message.NO_NUMBER}</p>
					<p>
						<u
							onClick={() => {
								changeEmailSignIn(true)
								changeSignInForm(false)
							}}
						>
							{Message.CONTINUE_WITH_EMAIL}
						</u>
					</p>
				</div>

				<TermsOfService />

				{/* Submit button */}
				<button type='submit' className='blue-button self-end'>
					{Button.CONTINUE}
				</button>
			</form>
		</>
	)
}

export default SignIn
