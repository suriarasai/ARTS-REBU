// For viewing and modifying account information

import { useState } from 'react'
import Page from '@/components/ui/page'
import AccountInformation from '@/components/account/AccountInformation'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { User } from '@/redux/types/types'
import { UpdateUser } from '@/server'
import { Button, HREF, Title } from '@/constants'
import { useRecoilState } from 'recoil'
import { userAtom } from '@/utils/state'

const AccountSettings = () => {
	const router = useRouter()
	const [user, setUser] = useRecoilState(userAtom)
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
			<div className='px-8 pt-4 flex justify-center flex-col'>
				<h2 className='h-4/12 pb-1 text-xl font-medium text-green-500'>
					Profile
				</h2>
				<h2 className='pb-5 font-light'>Edit your Account Information</h2>
				<form onSubmit={handleSubmit(onSubmit)}>
					<AccountInformation
						register={register}
						errors={errors}
						newUser={false}
						populateData={user}
					/>

					<div className='-mx-3 mb-6 mt-4 flex justify-center md:self-end'>
						<button
							className='grey-button mr-3 shadow-sm rounded-md'
							onClick={(e) => {
								e.preventDefault()
								router.push(HREF.SETTINGS)
							}}
						>
							{'Go Back'}
						</button>
						<button
							type='submit'
							className='rect-button w-32 text-xs font-bold rounded-md shadow-md'
							onClick={() => setChangesSaved(false)}
						>
							{changesSaved ? Button.CHANGES_SAVED : Button.SAVE_CHANGES}
						</button>
					</div>
				</form>
			</div>
		</Page>
	)
}

export default AccountSettings
