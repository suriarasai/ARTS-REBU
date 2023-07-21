// Email form for entering/modifying email and password
// TODO: Forgot email/password?

import { FaEnvelope, FaKey } from 'react-icons/fa'

export function EmailForm({
	register,
	errors,
	signInError = false,
}: any) {
	/*
		Register 		: assigns names to each input field to be accessed when reading the form
		Errors 			: defines error conditions for validation checks
		existingUser 	: whether the user is registering or editing their information
		signInError		: error during sign in if the email/password are incorrect
	*/
	return (
		<>
			{/* Email and Password input */}
			<div className='-mx-3 mb-2'>
				{EmailInput(register, errors)}
				{PasswordInput(register, errors, signInError)}
			</div>
		</>
	)
}

function PasswordInput(register: any, errors: any, signInError: boolean) {
	return (
		<div className='relative w-full pb-4 md:mb-0'>
			<input
				{...register('password', {
					required: true,
					maxLength: 20,
					minLength: 5,
				})}
				type='password'
				placeholder='Enter your password'
				className='white-input rounded-md pl-10 shadow-sm'
			/>
			<FaKey className='absolute top-0 ml-3 mt-3 text-green-500' />
			{errors.password && (
				<p className='text-error mt-1'>
					Please enter a password with 5-20 digits
				</p>
			)}
			{signInError && (
				<p className='text-error mt-1'>Incorrect email or password</p>
			)}
		</div>
	)
}

function EmailInput(register: any, errors: any) {
	return (
		<div className='relative w-full pb-6 md:mb-0'>
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
				className='white-input rounded-md pl-10 shadow-sm'
			/>
			<FaEnvelope className='absolute top-0 ml-3 mt-3 text-green-500' />
			{errors.email && (
				<p className='text-error mt-1'>Please enter a valid email</p>
			)}
		</div>
	)
}
