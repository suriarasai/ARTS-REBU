// First page, for signing in

import React from 'react'
import history from '@/components/history'
import { useForm } from 'react-hook-form'

// Main component
const SignIn = () => {
	const [number, setNumber] = React.useState<string>()
	const [signInForm, changeSignInForm] = React.useState<boolean>(true)

	return (
		<main className='mx-auto max-w-screen-md pt-20 pb-16 px-safe sm:pb-0'>
			<div className='p-6'>
				<h2 className='text-xl font-semibold'>Welcome to Rebu</h2>
				{signInForm ? (
					<SignInForm
						setNumber={setNumber}
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
	<div className='mb-8 bg-neutral-100 text-neutral-600 dark:bg-neutral-600 dark:text-neutral-200 lg:text-left'>
		By continuing, you are agreeing to the <u>terms and conditions</u>
	</div>
)

// The default component that renders the mobile number input box
const SignInForm = ({ setNumber, changeSignInForm }: any) => {
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

				<div className='-mx-3 mb-2 flex flex-wrap'>
					<div className='mb-6 w-full px-3 md:mb-0 md:w-1/4'>
						<label className='mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700'>
							Country Code
						</label>
						<div className='relative'>
							<select
								className='block w-full appearance-none rounded border border-gray-200 bg-gray-200 py-3 px-4 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none'
								{...register('countryCode')}
								defaultValue='+60'
							>
								<option>+60</option>
								<option>+61</option>
								<option>+62</option>
								<option>+65</option>
								<option>+852</option>
							</select>
						</div>
					</div>

					<div className='w-full px-3 pb-6 md:mb-0 md:w-3/4'>
						<label className='mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700'>
							Mobile Number
						</label>
						<input
							className='block w-full appearance-none rounded border border-gray-200 bg-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none'
							type='text'
							placeholder='12345678'
							{...register('mobileNumber', { required: true, minLength: 8, maxLength: 8, pattern: /^-?[0-9]\d*\.?\d*$/i })}
						/>
						{errors.mobileNumber && (
							<p className='text-xs text-red-500'>
								Please enter a 8-digit mobile number
							</p>
						)}
					</div>
				</div>

				<TermsOfService />

				{/* Submit button */}
				<button
					type='submit'
					className='self-end rounded bg-blue-500 py-3 px-4 text-xs font-bold text-white hover:bg-blue-700'
				>
					{'Continue ᐳ'}
				</button>
			</form>
		</>
	)
}

// 2nd screen to validate the user's mobile number via OTP (one-time password)
const OTPForm = ({ mobileNumber, changeSignInForm }: any) => {
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

	const continueButton = () => {
		history.push('/booking')
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
					<div className='w-full px-3 pb-6 md:mb-0 md:w-4/5'>
						<label className='mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700'>
							Enter OTP
						</label>
						<input
							className='block w-full appearance-none rounded border border-gray-200 bg-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none'
							type='text'
							placeholder='1234'
						/>
					</div>

					<div className='mb-6 w-full px-3 md:mb-0 md:w-1/5'>
						<button
							className='rounded bg-blue-500 py-3 px-4 text-xs font-bold text-white hover:bg-blue-700'
							onClick={getOTP}
						>
							Get OTP
						</button>
					</div>
				</div>

				<TermsOfService />

				<div className='-mx-3 mb-2 flex self-end'>
					<button
						className='mr-3 rounded border border-zinc-500 py-3 px-4 text-xs font-bold text-zinc-500 hover:bg-zinc-700 hover:text-white'
						onClick={goBack}
					>
						{'Go Back'}
					</button>
					<button
						className='mr-4 self-end rounded bg-blue-500 py-3 px-4 text-xs font-bold text-white hover:bg-blue-700'
						onClick={continueButton}
					>
						{'Continue ᐳ'}
					</button>
				</div>
			</form>
		</>
	)
}

export default SignIn
