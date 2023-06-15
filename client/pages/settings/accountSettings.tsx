// For viewing and modifying account information

import React, { useContext, useState } from 'react'
import Page from '@/components/ui/page'
import Section from '@/components/ui/section'
import AccountInformation from '@/components/account/AccountInformation'
import { useForm } from 'react-hook-form'
import { UserContext } from '@/context/UserContext'
import { useRouter } from 'next/router'
import { User } from '@/redux/types'
import { UpdateUser } from '@/server'
import { Button, HREF, Title } from '@/redux/types/constants'

const AccountSettings = () => {
	const router = useRouter()
	const { user, setUser } = useContext(UserContext) // Accesses user data for preloading into input boxes
	const [changesSaved, setChangesSaved] = useState<Boolean>(false)
	const {
		register: register, // assigns names to each input field to be accessed when reading the form
		handleSubmit: handleSubmit,
		formState: { errors: errors },
	} = useForm()

	async function onSubmit(data: User) {
		setUser(await UpdateUser(data, user.customerID))
		setChangesSaved(true)
	}

	return (
		// TODO: Populate form on load, add another variable
		<Page title={Title.SETTINGS}>
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
								router.push(HREF.SETTINGS)
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
							{changesSaved ? Button.CHANGES_SAVED : Button.SAVE_CHANGES}
						</button>
					</div>
				</form>
			</Section>
		</Page>
	)
}

export default AccountSettings
