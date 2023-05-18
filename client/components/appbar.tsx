// Navigation Bar: For routing

import { useRouter } from 'next/router'

// Links to be rendered
const links = [
	{ label: 'Booking', href: '/booking' },
	{ label: 'Activity', href: '/activity' },
	{ label: 'Notifications', href: '/notifications' },
	{ label: 'Settings', href: '/settings' },
]

interface appBarProps {
	sectionTitle?: string
}

const Appbar = ({ sectionTitle }: appBarProps) => {
	const router = useRouter()

	return (
		<div className='fixed top-0 left-0 z-20 w-full bg-zinc-900 pt-safe'>
			<header className='border-b bg-zinc-100 px-safe dark:border-zinc-800 dark:bg-zinc-900'>
				<div className='mx-auto flex h-14 max-w-screen-md items-center justify-between px-6'>

					{/* Conditional Rendering: Show site title for web, and section title for mobile */}
					<a>
						<h1 className='font-medium visible sm:hidden'>
							{sectionTitle ? sectionTitle : 'Rebu'}
						</h1>
						<h1 className='font-medium hidden sm:block'>
							Rebu
						</h1>
					</a>

					{/* Conditional Rendering: Show navbar links for web */}
					<nav className='flex items-center space-x-6'>
						<div className='hidden sm:block'>
							<div className='flex items-center space-x-6'>
								{links.map(({ label, href }) => (
										<a
											className={`text-sm ${
												router.pathname === href
													? 'text-cyan-600 dark:text-cyan-400'
													: 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'
											}`}
											onClick={() => router.push(href)}
											key={label}
										>
											{label}
										</a>
								))}
							</div>
						</div>
					</nav>
				</div>
			</header>
		</div>
	)
}

export default Appbar