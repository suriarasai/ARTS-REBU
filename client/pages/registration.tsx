// Registration for new users
// Only accessible if the phone number from the sign-in
// screen does not exist in the database

// Note: Validation checks aren't fully developed; duplicate emails are unchecked for
// 		 TODO: No validation to enforce dropdown selection...

import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { EmailForm } from '@/components/account/EmailForm'
import AccountInformation from '@/components/account/AccountInformation'
import { UserContext } from '@/context/UserContext'
import { User } from '@/redux/types'
import { RegisterUser } from '@/server'
import { HREF, Message } from '@/redux/types/constants'

const Registration = () => {
	const router = useRouter()
	const [nextStep, showNextStep] = React.useState<boolean>(false)
	const { user, setUser } = useContext(UserContext)
	const [formData, updateFormData] = React.useState<Object>({})
	const [registrationSuccessful, setRegistrationSuccessful] =
		React.useState<boolean>(false)

	const {
		register: registerEmail,
		handleSubmit: handleSubmitEmail,
		formState: { errors: errorsEmail },
	}: any = useForm()

	const {
		register: registerProfile,
		handleSubmit: handleSubmitProfile,
		formState: { errors: errorsProfile },
	}: any = useForm()

	const onSubmitEmail = (data: User) => {
		showNextStep(true)
		updateFormData(data)
	}
	const onSubmitProfile = async (data: User) => {
		setUser(await RegisterUser({ ...formData, ...data }, user.customerID))
		setRegistrationSuccessful(true)
		router.push(HREF.HOME)
	}

	return (
		<div className='mx-auto max-w-screen-md overflow-hidden pt-9'>
			<div className='flex flex-col p-6'>
				<h2 className='pb-3 text-xl font-semibold'>{Message.WELCOME}</h2>
				<label className='pb-6'>Step {!nextStep ? 1 : 2} of 2</label>
				<p className='mb-8'>{Message.INSTRUCTIONS}</p>

				{nextStep ? (
					<form
						className='flex flex-col'
						onSubmit={handleSubmitProfile(onSubmitProfile)}
					>
						<AccountInformation
							newUser={true}
							register={registerProfile}
							errors={errorsProfile}
						/>
						<div className='mt-8 flex self-end'>
							{nextStep ? (
								<button
									className='grey-button mr-3'
									onClick={(e) => {
										e.preventDefault()
										showNextStep(false)
									}}
								>
									Go Back
								</button>
							) : null}
							<button
								className={`${
									registrationSuccessful ? 'green-button' : 'blue-button'
								} self-end`}
								type='submit'
								disabled={registrationSuccessful ? true : false}
							>
								{registrationSuccessful ? Message.CREATING_ACCOUNT : Message.FINISH}
							</button>
						</div>
					</form>
				) : (
					<form
						className='flex flex-col'
						onSubmit={handleSubmitEmail(onSubmitEmail)}
					>
						<EmailForm
							existingUser={false}
							register={registerEmail}
							errors={errorsEmail}
						/>
						<div className='mt-8 flex self-end'>
							<button
								className='blue-button self-end'
								type='submit'
								disabled={registrationSuccessful ? true : false}
							>
								Continue ᐳ
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	)
}

export default Registration
