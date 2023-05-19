// First page, for signing in
// TODO: User account is created upon entering their phone number rather than after registration...

import React, { useContext } from 'react'
import api from '@/api/axiosConfig'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { MobileNumber } from '@/components/MobileNumber'
import { EmailForm } from '@/components/EmailForm'
import { UserContext } from '@/components/context/UserContext'

// Main component
const SignIn = () => {
	const [number, setNumber] = React.useState<string>()
	const [signInForm, changeSignInForm] = React.useState<boolean>(true)
	const [emailSignIn, changeEmailSignIn] = React.useState<boolean>(false)
	const [newUser, setNewUser] = React.useState<boolean>(true)

	return (
		<main className='mx-auto max-w-screen-md pt-20 pb-16 px-safe sm:pb-0'>
			<div className='p-6'>
				<h2 className='text-xl font-semibold'>Welcome to Rebu</h2>
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
						mobileNumber={number}
						changeSignInForm={changeSignInForm}
						newUser={newUser}
					/>
				)}
			</div>
		</main>
	)
}

// Text component
const TermsOfService = () => (
	<div className='mb-8 bg-neutral-100 text-zinc-400 dark:bg-neutral-600 dark:text-neutral-200 lg:text-left'>
		By continuing, you are agreeing to the <u>terms and conditions</u>
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
		setNumber(data.countryCode + ' ' + data.mobileNumber)
		checkIfUserExists(data.mobileNumber, data.countryCode)
		changeSignInForm(false)
	})

	const { user, setUser } = useContext(UserContext)

	const checkIfUserExists = async (mobileNumber, countryCode) => {
		const response = await api.post('/api/v1/customers/exists', {
			mobileNumber: countryCode + " " + mobileNumber,
		})

		if (response.data === '') {
			const createUser = await api.post('/api/v1/customers', {
				mobileNumber: countryCode + " " + mobileNumber,
				countryCode: countryCode,
			})
			setUser(createUser.data)
			setNewUser(true)
		} else {
			setUser(response.data)
			setNewUser(false)
		}
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
					<p>{"Don't have access to your number?"}</p>
					<p>
						<u
							onClick={() => {
								changeEmailSignIn(true)
								changeSignInForm(false)
							}}
						>
							Continue with email
						</u>{' '}
						instead
					</p>
				</div>

				<TermsOfService />

				{/* Submit button */}
				<button type='submit' className='blue-button self-end'>
					{'Continue ᐳ'}
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
		validateCredentials(data.email, data.password)
	})

	const { user, setUser } = useContext(UserContext)
	const [signInError, setSignInError] = React.useState(false)

	const validateCredentials = async (email, password) => {
		const response = await api.post('/api/v1/customers/validateCredentials', {
			email: email,
			password: password,
		})
		if (response.data != '') {
			setUser(response.data)
			setSignInError(false)
			router.push('/booking')
		} else {
			setSignInError(true)
		}
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
const OTPForm = ({ mobileNumber, changeSignInForm, newUser }: any) => {
	const router = useRouter()

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

	const continueButton = (e) => {
		e.preventDefault()
		console.log(newUser)
		router.push(newUser ? '/registration' : '/booking')
	}

	return (
		<>
			{/* User form */}
			<form className='flex w-full max-w-lg flex-col' onSubmit={handleSubmit}>
				<div className='mt-5'>
					<p className='mb-4 pb-6 text-zinc-600 dark:text-zinc-400'>
						Enter the OTP we sent to <b>{mobileNumber}</b>
					</p>
				</div>

				<div className='-mx-3 mb-2 flex flex-wrap items-center'>
					<div className='w-3/4 px-3 pb-6 md:mb-0'>
						<label>Enter OTP</label>
						<input type='text' placeholder='1234' />
					</div>

					<div className='-mt-3 w-1/4 px-3 md:mb-0'>
						<button className='blue-button' onClick={getOTP}>
							Get OTP
						</button>
					</div>
				</div>

				<TermsOfService />

				<div className='-mx-3 mb-2 flex self-end'>
					<button className='grey-button mr-3' onClick={goBack}>
						{'Go Back'}
					</button>
					<button className='blue-button mr-8' onClick={continueButton}>
						{'Continue ᐳ'}
					</button>
				</div>
			</form>
		</>
	)
}

export default SignIn
