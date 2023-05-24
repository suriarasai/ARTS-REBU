// For viewing and modifying account information

import React, { useContext, useState, useEffect } from 'react'
import Page from '@/components/ui/page'
import Section from '@/components/ui/section'
import AccountInformation from '@/components/account/AccountInformation'
import api from '@/api/axiosConfig'
import { useForm } from 'react-hook-form'
import { UserContext } from '@/components/context/UserContext'
import { useRouter } from 'next/router'

const AccountSettings = () => {
	const router = useRouter()
	const { user, setUser } = useContext(UserContext) // Accesses user data for preloading into input boxes
	const [changesSaved, setChangesSaved] = useState<Boolean>(false)
	const {
		register: register, // assigns names to each input field to be accessed when reading the form
		handleSubmit: handleSubmit,
		formState: { errors: errors },
	} = useForm()

	const onSubmit = (data) => {
		updateUser(data)
	}

	const updateUser = async (data) => {
		const response = await api.post('/api/v1/customers/updateUser', {
			_id: user.id,
			firstName: data.firstName,
			lastName: data.lastName,
			prefix: data.prefix,
			birthdate: data.birthdate.replace(/\//g, '-'),
			email: data.email,
			password: data.password,
			countryCode: data.countryCode,
			mobileNumber: data.countryCode + " " + data.mobileNumber,
		})
		console.log(response)
		setUser(response.data)
		setChangesSaved(true)
	}

	return (
		// TODO: Populate form on load, add another variable
		<Page title='Settings'>
			<Section>
				<h2 className='mt-3 mb-8 text-center text-xl font-bold'>Profile</h2>
				<form onSubmit={handleSubmit(onSubmit)}>
					<AccountInformation
						register={register}
						errors={errors}
						newUser={false}
						populateData={user}
					/>

					<div className='-mx-3 mb-6 mt-8 flex justify-center md:self-end'>
						<button
							className='grey-button mr-3'
							onClick={(e) => {
								e.preventDefault()
								router.push('/settings')
							}}
						>
							{'Go Back'}
						</button>
						<button
							type='submit'
							className={`mr-4 ${
								changesSaved ? 'green-button' : 'blue-button'
							}`}
							onClick={() => setChangesSaved(false)}
						>
							{changesSaved ? 'Changes Saved!' : 'Save Changes'}
						</button>
					</div>
				</form>
			</Section>
		</Page>
	)
}

export default AccountSettings
