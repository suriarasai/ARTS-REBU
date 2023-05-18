// For viewing and modifying account information

import Page from '@/components/page'
import Section from '@/components/section'
import AccountInformation from '@/components/AccountInformation'
import api from '@/api/axiosConfig'
import { useForm } from 'react-hook-form'

// Main component
const AccountSettings = () => {
	const {
		register: register,
		handleSubmit: handleSubmit,
		formState: { errors: errors },
	} = useForm()
	const onSubmit = (data) => {}

	return (
		<Page title='Settings'>
			<Section>
				<h2 className='mt-3 mb-8 text-center text-xl font-bold'>Profile</h2>
				<form onSubmit={handleSubmit(onSubmit)}>
					<AccountInformation register={register} errors={errors} newUser={false} />
				</form>
			</Section>
		</Page>
	)
}

export default AccountSettings
