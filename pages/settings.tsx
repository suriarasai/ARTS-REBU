// Main hub for options and account configuration

import React, { useState } from 'react'
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

			<SignOutModal />
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
					<p className={`mt-5 text-zinc-600 dark:text-zinc-400 ${className}`}>
						{label}
					</p>
				</div>
			</Link>
		</div>
	)
}

export default Settings

const SignOutModal = () => {
	const [showModal, setShowModal] = useState(false)

	return (
		<div>
			<div className='mt-12' onClick={() => setShowModal(true)}>
				<p className='text-red-500'>Logout</p>
			</div>

			{showModal ? (
				<div className='absolute left-0 top-0 flex h-full w-full items-center justify-center backdrop-brightness-50'>
					<div className='absolute left-0 right-0 top-1/3 ml-auto mr-auto flex h-auto w-1/2 flex-col items-center justify-center rounded-lg bg-zinc-50 p-7 shadow-xl'>
						<h2 className='mx-4 mt-3 mb-5 text-center text-base text-gray-400'>
							Are you sure you want to log out?
						</h2>
						<div className='flex gap-5'>
							<button
								className='rounded border boder-blue-700 py-2 px-3 text-xs text-blue-700 hover:bg-blue-700 hover:text-white'
								onClick={() => setShowModal(false)}
							>
								Cancel
							</button>
							<button className='rounded border border-red-100 py-2 px-3 text-xs text-red-600 hover:bg-red-700 hover:text-white'>
								<Link className='text-red-500' key='logout' href='/'>
									Logout
								</Link>
							</button>
						</div>
					</div>
				</div>
			) : null}
		</div>
	)
}
