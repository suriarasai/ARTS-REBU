// Registration for new users
// Only accessible if the phone number from the sign-in
// screen does not exist in the database

import React from 'react'
import { EmailForm } from '@/components/EmailForm'
import { useRouter } from 'next/router'
import AccountInformation from '@/components/AccountInformation'

const Registration = () => {
	const router = useRouter()
	const [nextStep, showNextStep] = React.useState<boolean>(false)

	return (
		<main className='mx-auto mt-7 max-w-screen-md px-safe absolute overflow-hidden'>
			<div className='flex flex-col p-6'>
				<h2 className='pb-3 text-xl font-semibold'>Welcome to Rebu</h2>
				<label className='pb-6'>Step {!nextStep ? 1 : 2} of 2</label>
				<p className='mb-8'>
					{
						"We're glad to have you here! We just need you to fill out a bit more information to complete your profile"
					}
				</p>

				{nextStep ? (
					<AccountInformation newUser={true} />
				) : (
					<EmailForm existingUser={false} />
				)}

				<div className='mt-8 flex self-end'>
					{nextStep ? (
						<button
							className='grey-button mr-3'
							onClick={() => showNextStep(false)}
						>
							{'Go Back'}
						</button>
					) : null}
					<button
						className='blue-button self-end'
						onClick={() =>
							nextStep ? router.push('/booking') : showNextStep(true)
						}
					>
						{nextStep ? 'Finish' : 'Continue ᐳ'}
					</button>
				</div>
			</div>
		</main>
	)
}

export default Registration
