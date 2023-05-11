// First page, for signing in

import React, { useState } from 'react'
import history from '@/components/history'
import { useForm, Resolver } from 'react-hook-form'

type FormValues = {
	mobileNumber: string
	countryCode: string
}

const resolver: Resolver<FormValues> = async (values) => {
	return {
	  values: values.mobileNumber ? values : {},
	  errors: !values.mobileNumber
		? {
			mobileNumber: {
			  type: 'required',
			  message: 'This is required.',
			},
		  }
		: {},
	};
  };

const SignIn = () => {
	// const [showSignIn, changeShowSignIn] = useState<boolean>(true)
	// const [mobileNumber, setMobileNumber] = useState<string>()

	return (
		<main className='mx-auto max-w-screen-md pt-20 pb-16 px-safe sm:pb-0'>
			<div className='p-6'>
				<h2 className='text-xl font-semibold'>Welcome to Rebu</h2>
				{/* {mobileNumber} */}
				<SignInForm
					// mobileNumber={mobileNumber}
					// setMobileNumber={setMobileNumber}
				/>
			</div>
		</main>
	)
}

const TermsOfService = () => (
	<div className='mb-8 bg-neutral-100 text-neutral-600 dark:bg-neutral-600 dark:text-neutral-200 lg:text-left'>
		By continuing, you are agreeing to the <u>terms and conditions</u>
	</div>
)

// interface SignInFormProps {
// 	mobileNumber?: string
// 	setMobileNumber: Function
// }

// The default component that renders the mobile number input box
// const SignInForm = ({ mobileNumber, setMobileNumber }: SignInFormProps) => {
	const SignInForm = () => {
	// const [countryCode, changeCountryCode] = useState<string>()

	const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>): void => {
		event.preventDefault()
		// setMobileNumber(countryCode, ' ', mobileNumber)
	}

	const handleCountryCode = (
		event: React.ChangeEvent<HTMLSelectElement>
	): void => {
		// changeCountryCode(event.target.value)
	}

	return (
		<>
			{/* User form */}
			<form className='flex w-full max-w-lg flex-col'>
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
								onChange={handleCountryCode}
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
							// value={mobileNumber}
							// onChange={setMobileNumber}
						/>
					</div>
				</div>

				<TermsOfService />

				{/* Submit button */}
				<button
					type='submit'
					className='self-end rounded bg-blue-500 py-3 px-4 text-xs font-bold text-white hover:bg-blue-700'
					onClick={handleSubmit}
				>
					{'Continue ᐳ'}
				</button>
			</form>
		</>
	)
}

export default SignIn
