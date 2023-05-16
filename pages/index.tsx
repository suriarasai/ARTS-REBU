// First page, for signing in

import React from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { MobileNumber } from '@/components/MobileNumber'
import { EmailForm } from '@/components/EmailForm'

// Main component
const SignIn = () => {
	const [number, setNumber] = React.useState<string>()
	const [signInForm, changeSignInForm] = React.useState<boolean>(true)
	const [emailSignIn, changeEmailSignIn] = React.useState<boolean>(false)

	return (
		<main className='mx-auto max-w-screen-md pt-20 pb-16 px-safe sm:pb-0'>
			<div className='p-6'>
				<h2 className='text-xl font-semibold'>Welcome to Rebu</h2>
				{signInForm ? (
					<SignInForm
						setNumber={setNumber}
						changeSignInForm={changeSignInForm}
						changeEmailSignIn={changeEmailSignIn}
					/>
				) : emailSignIn ? (
					<EmailSignIn
						changeEmailSignIn={changeEmailSignIn}
						changeSignInForm={changeSignInForm}
					/>
				) : (
					<OTPForm mobileNumber={number} changeSignInForm={changeSignInForm} />
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

// The default component that renders the mobile number input box
const SignInForm = ({
	setNumber,
	changeSignInForm,
	changeEmailSignIn,
}: any) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()
	const onSubmit = handleSubmit((data) => {
		setNumber(data.countryCode + ' ' + data.mobileNumber)
		changeSignInForm(false)
	})

	return (
		<>
			{/* User form */}
			<form className='flex w-full max-w-lg flex-col' onSubmit={onSubmit}>
				<div className='mt-5'>
					<p className='mb-4 pb-6 text-zinc-600 dark:text-zinc-400'>
						Enter your mobile number
					</p>
				</div>

				{MobileNumber(register, errors)}

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

const EmailSignIn = ({ changeEmailSignIn, changeSignInForm }: any) => {
	const router = useRouter()

	const handleSubmit = (data: any) => {
		changeEmailSignIn(false)
	}

	// Navigates back to sign in screen
	const goBack = (event: any) => {
		event.preventDefault()
		changeEmailSignIn(false)
		changeSignInForm(true)
	}

	const continueButton = (e) => {
		e.preventDefault()
		router.push(false ? '/booking' : '/registration')
	}

	return (
		<>
			{/* User form */}

			<form className='flex w-full max-w-lg flex-col'>
				<EmailForm />

				<TermsOfService />

				<div className='-mx-3 flex self-end'>
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

// 2nd screen to validate the user's mobile number via OTP (one-time password)
const OTPForm = ({ mobileNumber, changeSignInForm }: any) => {
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
		router.push(false ? '/booking' : '/registration')
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
					<div className='w-full w-3/4 px-3 pb-6 md:mb-0'>
						<label>Enter OTP</label>
						<input type='text' placeholder='1234' />
					</div>

					<div className='-mt-3 w-full w-1/4 px-3 md:mb-0'>
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
