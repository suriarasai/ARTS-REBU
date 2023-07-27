// Registration for new users
// Only accessible if the phone number from the sign-in
// screen does not exist in the database

// Note: Validation checks aren't fully developed; duplicate emails are unchecked for
// 		 TODO: No validation to enforce dropdown selection...

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { EmailForm } from '@/components/account/EmailForm'
import AccountInformation from '@/components/account/AccountInformation'
import { User } from '@/types'
import { RegisterUser } from '@/server'
import { HREF } from '@/constants'
import { useRecoilState } from 'recoil'
import { userAtom } from '@/state'
import { FaArrowRight } from 'react-icons/fa'
import { useState } from 'react'

const Registration = () => {
	const router = useRouter()
	const [user, setUser] = useRecoilState<User>(userAtom)
	const [registrationSuccessful, setRegistrationSuccessful] =
		useState<boolean>(false)

	const {
		register: register,
		handleSubmit: handleSubmit,
		formState: { errors: errors },
	}: any = useForm()

	// Second screen w/profile inputs
	const onSubmit = async (data: User) => {
		setUser(await RegisterUser({ ...data }, user.customerID!))
		setRegistrationSuccessful(true)
		router.push(HREF.HOME)
	}

	return (
		<main className='flex h-screen max-w-screen-md mr-auto ml-auto flex-col justify-center bg-zinc-50 p-16'>
			<h2 className='h-4/12 pb-1 text-xl font-medium text-green-500'>
				Registration
			</h2>
			<h2 className='pb-5 font-light'>Please enter details to register</h2>
			<form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
				<EmailForm register={register} errors={errors} />
				<AccountInformation
					newUser={true}
					register={register}
					errors={errors}
				/>
				<p>
					Already have an account?{' '}
					<span
						className='font-medium text-green-500'
						onClick={() => router.push('/')}
					>
						Go Back
					</span>
				</p>
				<div className='mt-8 flex self-end'>
					<button
						className='rect-button w-28 self-end rounded-md shadow-md'
						type='submit'
						disabled={registrationSuccessful ? true : false}
					>
						<FaArrowRight />
					</button>
				</div>
			</form>
		</main>
	)
}

export default Registration
