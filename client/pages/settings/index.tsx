// Main hub for options and account configuration
// TODO: Set signout to clear context

import Link from 'next/link'
import React from 'react'
import Page from '@/components/ui/page'
import Section from '@/components/ui/section'
import { SignOutModal } from '@/components/account/SignOutModal'
import { navButtonProps } from '@/redux/types'
import { HREF, Title } from '@/redux/types/constants'

const NavButton = ({ label, href, className }: navButtonProps) => {
	return (
		<div className='mt-5'>
			<Link
				className={`font-base text-zinc-600 dark:text-zinc-400 ${className}`}
				key={label}
				href={href}
			>
				{label}
			</Link>
		</div>
	)
}

const Settings = () => (
	<Page title={Title.SETTINGS}>
		<Section>
			<NavButton label={Title.ACCOUNT} href={HREF.ACCOUNT} />
			<NavButton label={Title.REWARDS} href={HREF.REWARDS} />
			<NavButton label={Title.PAYMENT} href={HREF.PAYMENT} />
			<NavButton label={Title.LOCATIONS} href={HREF.LOCATIONS} />

			<SignOutModal />
		</Section>
	</Page>
)

export default Settings
