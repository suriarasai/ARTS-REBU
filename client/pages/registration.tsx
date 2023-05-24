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
import { UserContext } from '@/components/context/UserContext'
import api from '@/api/axiosConfig'

const Registration = () => {
	const router = useRouter()
	const [nextStep, showNextStep] = React.useState<boolean>(false)
	const { user, setUser } = useContext(UserContext)
	const [formData, updateFormData] = React.useState<Object>({})

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

	const onSubmitEmail = (data) => {
		showNextStep(true)
		updateFormData(data)
	}
	const onSubmitProfile = (data) => {
		registerUser({ ...formData, ...data })
	}

	const registerUser = async (data) => {
		const response = await api.post('/api/v1/customers/updateUser', {
			_id: user?.id,
			firstName: data.firstName,
			lastName: data.lastName,
			prefix: data.prefix,
			birthdate: data.birthdate.replace(/\//g, "-"),
			email: data.email,
			password: data.password,
		})
		setUser(response.data)
		router.push('/booking')
	}

	return (
		<div className='mx-auto max-w-screen-md overflow-hidden pt-9'>
			<div className='flex flex-col p-6'>
				<h2 className='pb-3 text-xl font-semibold'>Welcome to Rebu</h2>
				<label className='pb-6'>Step {!nextStep ? 1 : 2} of 2</label>
				<p className='mb-8'>
					{
						"We're glad to have you here! We just need you to fill out a bit more information to complete your profile"
					}
				</p>

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
							<button className='blue-button self-end' type='submit'>
								Finish
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
							<button className='blue-button self-end' type='submit'>
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
