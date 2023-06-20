// Bottom Navigation bar: For mobile navigation

import { HREF, Title, icon } from '@/redux/types/constants'
import { useRouter } from 'next/router'
import { FaCalendar, FaComments, FaSearch, FaUser } from 'react-icons/fa'

const BottomNav = () => {
	const router = useRouter() // For navigation

	return (
		<div className='sm:hidden'>
			<nav className='bottom-nav'>
				<div className='mx-auto mt-3 flex h-16 max-w-md items-center justify-center px-6'>
					{/* Iterating through the list of NavBar links to render them */}
					{links.map(({ href, label, icon }) => (
						<a
							className={`flex w-full flex-col items-center justify-center space-y-1 ${
								router.pathname === href
									? 'text-green-600 hover:text-green-700'
									: 'text-zinc-500 hover:text-zinc-900'
							}`}
							key={label}
							onClick={() => router.push(href)}
						>
							{icon}
							<span className='text-sm font-medium'>{label}</span>
						</a>
					))}
				</div>
			</nav>
		</div>
	)
}

export default BottomNav

interface navIconProps {
	label: string
	href: string
	image: any
}

// Reusable function for creating NavBar buttons
const navIcon = ({ label, href, image }: navIconProps) => {
	/* 
		label	: the text on the navbar
		href	: where to redirect to
		image	: the icon to display in the navbar
	*/
	return {
		label: label,
		href: href,
		icon: image,
	}
}

// Populating the BottomNavBar with data
const links = [
	navIcon({
		label: 'Book',
		href: HREF.BOOKING,
		image: <FaSearch className='h-5 w-5'/>
	}),
	navIcon({
		label: 'Trips',
		href: HREF.HISTORY,
		image: <FaCalendar className='h-5 w-5'/>
	}),
	navIcon({
		label: 'Chats',
		href: HREF.NOTIFICATIONS,
		image: <FaComments className='h-5 w-5'/>,
	}),
	navIcon({
		label: 'Account',
		href: HREF.SETTINGS,
		image: <FaUser className='h-5 w-5'/>,
	}),
]
