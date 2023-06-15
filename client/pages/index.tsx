// First page, for signing in

import React, { useContext, useEffect } from 'react'
import api from '@/api/axiosConfig'
import { useForm } from 'react-hook-form'
import Router, { useRouter } from 'next/router'
import { MobileNumber } from '@/components/account/MobileNumber'
import { EmailForm } from '@/components/account/EmailForm'
import { UserContext } from '@/context/UserContext'
import { LoadingScreen } from '../components/ui/LoadingScreen'
import { Button, HREF, Message } from '@/redux/types/constants'

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

// Text component
const TermsOfService = () => (
	<div className='mb-8 bg-neutral-100 text-zinc-400 dark:bg-neutral-600 dark:text-neutral-200 lg:text-left'>
		{Message.TOS1} <u>{Message.TOS2}</u>
	</div>
)

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

	const checkIfUserExists = async (
		phoneNumber: string,
		phoneCountryCode: number
	) => {
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

// Sign in via Email
const EmailSignIn = ({ changeEmailSignIn, changeSignInForm }: any) => {
	const router = useRouter()

	const {
		register: register,
		handleSubmit: handleSubmit,
		formState: { errors: errors },
	} = useForm()
	const onSubmit = handleSubmit((data) => {
		// @ts-ignore
		validateCredentials(data.email, data.password)
	})

	const { setUser } = useContext(UserContext)
	const [signInError, setSignInError] = React.useState(false)

	const validateCredentials = async (email: string, password: string) => {
		const response = await api.post('/api/v1/Customer/validateCredentials', {
			email: email,
			password: password,
		})
		if (response.data != '') {
			setUser(response.data)
			localStorage.setItem('user', JSON.stringify(response.data))
			setSignInError(false)
			router.push(HREF.HOME)
		} else {
			setSignInError(true)
		}
		return response.data
	}

	// Navigates back to sign in screen
	const goBack = (event: any) => {
		event.preventDefault()
		changeEmailSignIn(false)
		changeSignInForm(true)
	}

	return (
		<>
			{/* User form */}

			<form className='flex w-full max-w-lg flex-col' onSubmit={onSubmit}>
				<EmailForm
					register={register}
					errors={errors}
					signInError={signInError}
				/>

				<TermsOfService />

				<div className='-mx-3 flex self-end'>
					<button className='grey-button mr-3' onClick={goBack}>
						{'Go Back'}
					</button>
					<button className='blue-button mr-8' type='submit'>
						{'Continue ᐳ'}
					</button>
				</div>
			</form>
		</>
	)
}

// 2nd screen to validate the user's mobile number via OTP (one-time password)
const OTPForm = ({ phoneNumber, changeSignInForm, newUser }: any) => {
	const router = useRouter()
	const [loginSuccessful, setLoginSuccesssful] = React.useState<boolean>(false)

	const handleSubmit = (data: any) => {
		changeSignInForm(false)
	}

	// Navigates back to sign in screen
	const goBack = (event: any) => {
		event.preventDefault()
		changeSignInForm(true)
	}

	const getOTP = (event: any) => {
		event.preventDefault()
	}

	const continueButton = (e: React.MouseEvent<HTMLButtonElement>): void => {
		e.preventDefault()
		setLoginSuccesssful(true)
		router.push(newUser ? HREF.REGISTRATION : HREF.HOME)
	}

	return (
		<>
			{/* User form */}
			<form className='flex w-full max-w-lg flex-col' onSubmit={handleSubmit}>
				<div className='mt-5'>
					<p className='mb-4 pb-6 text-zinc-600 dark:text-zinc-400'>
						Enter the OTP we sent to <b>{phoneNumber}</b>
					</p>
				</div>

				<div className='-mx-3 mb-2 flex flex-wrap items-center'>
					<div className='w-3/4 px-3 pb-6 md:mb-0'>
						<label>Enter OTP</label>
						<input type='text' placeholder='1234' className='px-4 py-2' />
					</div>

					<div className='w-1/4 px-3 md:mb-0'>
						<button className='blue-button' onClick={getOTP}>
							Get OTP
						</button>
					</div>
				</div>

				<TermsOfService />

				<div className='-mx-3 mb-2 flex self-end'>
					<button
						className='grey-button mr-3'
						onClick={goBack}
						disabled={loginSuccessful ? true : false}
					>
						{'Go Back'}
					</button>
					<button
						className={`mr-8 ${
							loginSuccessful ? 'green-button' : 'blue-button'
						}`}
						onClick={continueButton}
						disabled={loginSuccessful ? true : false}
					>
						{loginSuccessful ? Button.SIGNING_IN : Button.SIGN_IN}
					</button>
				</div>
			</form>
		</>
	)
}

export default SignIn
