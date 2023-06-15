// Bottom Navigation bar: For mobile navigation

import { HREF, Title, icon } from '@/redux/types/constants'
import { useRouter } from 'next/router'

const BottomNav = () => {
	const router = useRouter() // For navigation

	return (
		<div className='sm:hidden'>
			<nav className='bottom-nav'>
				<div className='mx-auto flex h-16 max-w-md items-center justify-around px-6'>
					{/* Iterating through the list of NavBar links to render them */}
					{links.map(({ href, label, icon }) => (
						<a
							className={`flex h-full w-full flex-col items-center justify-center space-y-1 ${
								router.pathname === href && label !== ''
									? 'text-green-400 dark:text-green-400'
									: label === ''
									? 'hover:text-green-300'
									: 'text-zinc-400 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'
							} ${
								label === ''
									? 'h-18 mb-6 ml-3 mr-3 w-80 rounded-full bg-green-500  text-green-200'
									: ''
							}`}
							key={label}
							onClick={() => router.push(href)}
						>
							{icon}
							<span
								className={`text-xs text-zinc-600 dark:text-zinc-400 ${
									label === 'Home' ? 'text-green-100' : ''
								}`}
							>
								{label}
							</span>
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
	image: string
	fill?: string
	stroke?: string
}

// Reusable function for creating NavBar buttons
const navIcon = ({ label, href, image, fill, stroke }: navIconProps) => {
	/* 
		label	: the text on the navbar
		href	: where to redirect to
		image	: the icon to display in the navbar
		stroke	: custom styling option
	*/
	return {
		label: label,
		href: href,
		icon: (
			<svg
				viewBox='0 0 15 15'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
				width={label === '' ? 20 : 15}
				height={label === '' ? 20 : 15}
			>
				<path d={image} fill={fill} stroke={stroke}></path>
			</svg>
		),
	}
}

// Populating the BottomNavBar with data
const links = [
	navIcon({
		label: Title.BOOKING,
		href: HREF.BOOKING,
		fill: 'currentColor',
		image: icon.car,
	}),
	navIcon({
		label: Title.ACTIVITY,
		href: HREF.HISTORY,
		fill: 'currentColor',
		image: icon.clock,
	}),
	navIcon({
		label: '',
		href: HREF.HOME,
		fill: 'currentColor',
		image: icon.house,
	}),
	navIcon({
		label: Title.NOTIFICATIONS,
		href: HREF.NOTIFICATIONS,
		stroke: 'currentColor',
		image: icon.bell,
	}),
	navIcon({
		label: Title.SETTINGS,
		href: HREF.SETTINGS,
		stroke: 'currentColor',
		image: icon.gear,
	}),
]
