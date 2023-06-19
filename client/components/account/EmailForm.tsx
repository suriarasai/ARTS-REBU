// Email form for entering/modifying email and password
// TODO: Forgot email/password?

import { useRouter } from 'next/router'
import { EmailInterface } from '@/redux/types'

export function EmailForm({
	register,
	errors,
	existingUser = true,
	signInError = false,
}: EmailInterface) {
	/*
		Register 		: assigns names to each input field to be accessed when reading the form
		Errors 			: defines error conditions for validation checks
		existingUser 	: whether the user is registering or editing their information
		signInError		: error during sign in if the email/password are incorrect
	*/
	const router = useRouter() // For navigation

	return (
		<>
			{/* Email and Password input */}
			<div className='-mx-3 mb-2'>
				<div className='w-full pb-6 md:mb-0'>
					<input
						{...register('email', {
							required: true,
							maxLength: 30,
							minLength: 5,
							pattern:
								/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/i,
						})}
						name='email'
						type='text'
						placeholder='Enter your email'
						className='white-input rounded-md shadow-sm'
					/>
					{errors.email && (
						<p className='text-error'>Please enter a valid email</p>
					)}
				</div>
				<div className='w-full pb-6 md:mb-0'>
					<input
						{...register('password', {
							required: true,
							maxLength: 20,
							minLength: 5,
						})}
						type='password'
						placeholder='Enter your password'
						className='white-input rounded-md shadow-sm'
					/>
					{errors.password && (
						<p className='text-error'>
							Please enter a password with 5-20 digits
						</p>
					)}
					{signInError && (
						<p className='text-error'>Incorrect email or password</p>
					)}
				</div>
			</div>

			{/* Navigation */}
			{/* <div className='mb-4'>
				{existingUser ? (
					<p className='text-green-500 mr-auto ml-auto'>Forgot Password?</p>
				) : (
					<p>
						Already have an account?{' '}
						<u onClick={() => router.push('/')}>Go back</u>
					</p>
				)}
			</div> */}
		</>
	)
}
