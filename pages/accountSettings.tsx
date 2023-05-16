// For viewing and modifying account information

import Page from '@/components/page'
import Section from '@/components/section'
import AccountInformation from '@/components/AccountInformation'

// Main component
const AccountSettings = () => (
	<Page title='Settings'>
		<Section>
			<h2 className='mt-3 mb-8 text-center text-xl font-bold'>Profile</h2>
			<AccountInformation />
		</Section>
	</Page>
)

export default AccountSettings
