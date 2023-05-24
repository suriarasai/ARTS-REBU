// Main hub for options and account configuration
// TODO: Set signout to clear context

import React, { useState, useContext } from 'react'
import Page from '@/components/ui/page'
import Section from '@/components/ui/section'
import { useRouter } from 'next/router'
import api from '@/api/axiosConfig'
import { UserContext } from '@/components/context/UserContext'

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
	const router = useRouter()
	return (
		<div className='mt-2'>
			<p
				className={`mt-5 text-zinc-600 dark:text-zinc-400 ${className}`}
				key={label}
				onClick={() => router.push(href)}
			>
				{label}
			</p>
		</div>
	)
}

export default Settings

const SignOutModal = () => {
	const router = useRouter()
	const [showModal, setShowModal] = useState(false)

	const { user, setUser } = useContext(UserContext)

	const handleSignOut = () => {
		addSignOutTime(user?.mobileNumber)
		router.push('/')
	}

	const addSignOutTime = async (mobileNumber) => {
		const response = await api.post('/api/v1/customers/addSignOutTime', {
			mobileNumber: mobileNumber,
		})
		console.log(response)
	}

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
								className='blue-button-hollow'
								onClick={() => setShowModal(false)}
							>
								Cancel
							</button>
							<button className='red-button'>
								<div
									className='text-red-500'
									key='logout'
									onClick={() => handleSignOut()}
								>
									Logout
								</div>
							</button>
						</div>
					</div>
				</div>
			) : null}
		</div>
	)
}
