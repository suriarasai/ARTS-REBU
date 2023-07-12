// Main hub for options and account configuration

import Page from '@/components/ui/page'
import Section from '@/components/ui/section'
import { SignOutModal } from '@/components/account/SignOutModal'
import { navButtonProps } from '@/redux/types'
import { HREF, Title } from '@/redux/types/constants'
import { FaAngleRight, FaBookmark, FaCreditCard, FaGifts } from 'react-icons/fa'
import { useRouter } from 'next/router'
import { useRecoilValue } from 'recoil'
import { userSelector } from '@/utils/state'

const NavButton = ({ label, href, className, icon }: navButtonProps) => {
	const router = useRouter()
	return (
		<div className='mt-5 w-full rounded-2xl bg-white p-3 py-4 shadow-md'>
			<div
				className={`relative flex items-center font-medium text-zinc-600 dark:text-zinc-400 ${className}`}
				key={label}
				onClick={() => router.push(href)}
			>
				<div className='mr-4 pl-4 text-xl text-green-500'>{icon}</div>
				{label}
				<div className='absolute right-0 mb-auto mt-auto pr-4'>
					<FaAngleRight />
				</div>
			</div>
		</div>
	)
}

function splitName(name: string): Array<string> {
	let nameArray = []
	let tempArray = name?.toUpperCase().split(' ')
	nameArray.push(tempArray[0][0])
	nameArray.push(tempArray[tempArray.length - 1][0])
	return nameArray
}

const Settings = () => {
	const user = useRecoilValue(userSelector)
	const router = useRouter()

	return (
		<Page title={Title.SETTINGS}>
			<Section>
				<div
					className='relative flex w-full items-center rounded-b-lg rounded-l-lg border-b border-l border-green-400 bg-white p-3 pl-10 shadow-md'
					onClick={() => router.push(HREF.ACCOUNT)}
				>
					<div className='flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-lime-500 to-green-200 text-2xl text-white shadow-md'>
						{user.customerName ? splitName(user.customerName) : 'Null'}
					</div>
					<div className='ml-5'>
						<h2 className='text-lg font-medium'>{user.customerName}</h2>
						<hr className='my-1' />
						<h5>
							{user.phoneCountryCode
								? '+' + user.phoneCountryCode + ' ' + user.phoneNumber
								: 'Null'}
						</h5>
					</div>
					<div className='absolute right-0 mb-auto mt-auto pr-6'>
						<FaAngleRight />
					</div>
				</div>
			</Section>
			<Section>
				<NavButton label={Title.REWARDS} href={HREF.REWARDS} icon=<FaGifts /> />
				<NavButton
					label={Title.PAYMENT}
					href={HREF.PAYMENT}
					icon=<FaCreditCard />
				/>
				<NavButton
					label={Title.LOCATIONS}
					href={HREF.LOCATIONS}
					icon=<FaBookmark />
				/>

				<SignOutModal />
			</Section>
		</Page>
	)
}

export default Settings
