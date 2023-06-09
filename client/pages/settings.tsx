// Main hub for options and account configuration
// TODO: Set signout to clear context

import React from 'react'
import Page from '@/components/ui/page'
import Section from '@/components/ui/section'
import { NavButton } from '../components/account/NavButton'
import { SignOutModal } from '../components/account/SignOutModal'

const Settings = () => (
	<Page title='Settings'>
		<Section>
			<NavButton label='Edit Account Information' href='/accountSettings' />
			<NavButton label='Reward Points' href='/rewardPoints' />
			<NavButton label='Manage Payment Options' href='/managePayment' />
			<NavButton label='Saved Places' href='/savedPlaces' />

			<SignOutModal />
		</Section>
	</Page>
)

export default Settings
