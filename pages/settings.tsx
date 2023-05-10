import Page from '@/components/page'
import Section from '@/components/section'
import Link from 'next/link'

const Settings = () => (
	<Page title='Settings'>
		<Section>
			<NavButton label='Edit Account Information' href='/accountSettings' />
			<NavButton label='Reward Points' href='/rewardPoints' />
			<NavButton label='Manage Payment Options' href='/managePayment' />
			<NavButton label='Saved Places' href='/managePayment' />

			<div className='mt-12'>
				<NavButton className='text-red-500' label='Logout' href='/' />
			</div>
		</Section>
	</Page>
)

interface navButtonProps {
	label: string
	href: string
	className?: string
}

const NavButton = ({ label, href, className }: navButtonProps) => {
	return (
		<div>
			<Link key={label} href={href}>
				<div className='mt-2'>
					<p className={`text-zinc-600 dark:text-zinc-400 mt-5 ${className}`}>{label}</p>
				</div>
			</Link>
		</div>
	)
}

export default Settings
