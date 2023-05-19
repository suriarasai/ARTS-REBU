// Email form for entering/modifying email and password

import { useRouter } from 'next/router'

export function EmailForm({
	register,
	errors,
	existingUser = true,
	signInError = false,
}) {
	/*
		Register 		: assigns names to each input field to be accessed when reading the form
		Errors 			: defines error conditions for validation checks
		existingUser 	: whether the user is registering or editing their information
	*/
	const router = useRouter() // For navigation

	return (
		<>
			{existingUser ? (
				<p className='mb-4 pb-3 text-zinc-600 dark:text-zinc-400'>
					Sign in using your email
				</p>
			) : null}

			{/* Email and Password input */}
			<div className='-mx-3 mb-2'>
				<div className='w-full px-3 pb-6 md:mb-0'>
					<label>Email</label>
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
						placeholder='user@website.domain'
					/>
					{errors.email && (
						<p className='text-error'>Please enter a valid email</p>
					)}
				</div>
				<div className='w-full px-3 pb-6 md:mb-0'>
					<label>Password</label>
					<input
						{...register('password', {
							required: true,
							maxLength: 20,
							minLength: 5,
						})}
						type='password'
						name='password'
						placeholder='********'
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
			<div className='mb-4 bg-neutral-100 text-zinc-400 dark:bg-neutral-600 dark:text-neutral-200 lg:text-left'>
				{existingUser ? (
					<p>
						<u>Forgot your password?</u>
					</p>
				) : (
					<p>
						Already have an account?{' '}
						<u onClick={() => router.push('/')}>Go back</u>
					</p>
				)}
			</div>
		</>
	)
}
