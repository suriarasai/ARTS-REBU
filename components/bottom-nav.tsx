import Link from 'next/link'
import { useRouter } from 'next/router'

const BottomNav = () => {
	const router = useRouter()

	return (
		<div className='sm:hidden'>
			<nav className='fixed bottom-0 w-full border-t bg-zinc-100 pb-safe dark:border-zinc-800 dark:bg-zinc-900'>
				<div className='mx-auto flex h-16 max-w-md items-center justify-around px-6'>
					{links.map(({ href, label, icon }) => (
						<Link key={label} href={href}>
							<a
								className={`flex h-full w-full flex-col items-center justify-center space-y-1 ${
									router.pathname === href
										? 'text-indigo-500 dark:text-indigo-400'
										: 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'
								}`}
							>
								{icon}
								<span className='text-xs text-zinc-600 dark:text-zinc-400'>
									{label}
								</span>
							</a>
						</Link>
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
}

const navIcon = ({ label, href, image }: navIconProps) => {
	return {
		label: label,
		href: href,
		icon: (
			<svg
				viewBox='0 0 15 15'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
				width='15'
				height='15'
			>
				<path d={image} fill='currentColor'></path>
			</svg>
		),
	}
}

const links = [
	navIcon({
		label: 'Booking',
		href: '/',
		image:
			"M14.5 6.497h.5v-.139l-.071-.119-.429.258zm-14 0l-.429-.258L0 6.36v.138h.5zm2.126-3.541l-.429-.258.429.258zm9.748 0l.429-.258-.429.258zM3.5 11.5V11H3v.5h.5zm8 0h.5V11h-.5v.5zM14 6.497V12.5h1V6.497h-1zM.929 6.754l2.126-3.54-.858-.516L.071 6.24l.858.515zM5.198 2h4.604V1H5.198v1zm6.747 1.213l2.126 3.541.858-.515-2.126-3.54-.858.514zM2.5 13h-1v1h1v-1zm.5-1.5v1h1v-1H3zM13.5 13h-1v1h1v-1zm-1.5-.5v-1h-1v1h1zm-.5-1.5h-8v1h8v-1zM1 12.5V6.497H0V12.5h1zm11.5.5a.5.5 0 01-.5-.5h-1a1.5 1.5 0 001.5 1.5v-1zm-10 1A1.5 1.5 0 004 12.5H3a.5.5 0 01-.5.5v1zm-1-1a.5.5 0 01-.5-.5H0A1.5 1.5 0 001.5 14v-1zM9.802 2a2.5 2.5 0 012.143 1.213l.858-.515A3.5 3.5 0 009.802 1v1zM3.055 3.213A2.5 2.5 0 015.198 2V1a3.5 3.5 0 00-3 1.698l.857.515zM14 12.5a.5.5 0 01-.5.5v1a1.5 1.5 0 001.5-1.5h-1zM2 10h3V9H2v1zm11-1h-3v1h3V9zM3 7h9V6H3v1z'",
	}),
	navIcon({
		label: 'Activity',
		href: '/activity',
		image:
			"M2.5 12.399l.37-.336-.006-.007-.007-.007-.357.35zm1 1.101v.5H4v-.5h-.5zm3.5.982l.018-.5-.053 1 .035-.5zM7.5 7.5H7a.5.5 0 00.146.354L7.5 7.5zm6.5 0A6.5 6.5 0 017.5 14v1A7.5 7.5 0 0015 7.5h-1zM7.5 1A6.5 6.5 0 0114 7.5h1A7.5 7.5 0 007.5 0v1zm0-1A7.5 7.5 0 000 7.5h1A6.5 6.5 0 017.5 1V0zM2.857 12.049A6.477 6.477 0 011 7.5H0c0 2.043.818 3.897 2.143 5.249l.714-.7zm-.727.686l1 1.101.74-.672-1-1.101-.74.672zM7.5 14a6.62 6.62 0 01-.465-.016l-.07.997c.177.013.355.019.535.019v-1zm.018 0l-.5-.017-.036 1 .5.017.036-1zM7 3v4.5h1V3H7zm.146 4.854l3 3 .708-.708-3-3-.708.708zM0 14h3.5v-1H0v1zm4-.5V10H3v3.5h1z'",
	}),
	navIcon({
		label: 'Notifications',
		href: '/notifications',
		image: "M1 10.5h13m-11.5 0v-5a5 5 0 0110 0v5m-7 1.5v.5a2 2 0 104 0V12'",
	}),
	navIcon({
		label: 'Account',
		href: '/account',
		image:
			"M3 13v.5h1V13H3zm8 0v.5h1V13h-1zm-7 0v-.5H3v.5h1zm2.5-3h2V9h-2v1zm4.5 2.5v.5h1v-.5h-1zM8.5 10a2.5 2.5 0 012.5 2.5h1A3.5 3.5 0 008.5 9v1zM4 12.5A2.5 2.5 0 016.5 10V9A3.5 3.5 0 003 12.5h1zM7.5 3A2.5 2.5 0 005 5.5h1A1.5 1.5 0 017.5 4V3zM10 5.5A2.5 2.5 0 007.5 3v1A1.5 1.5 0 019 5.5h1zM7.5 8A2.5 2.5 0 0010 5.5H9A1.5 1.5 0 017.5 7v1zm0-1A1.5 1.5 0 016 5.5H5A2.5 2.5 0 007.5 8V7zm0 7A6.5 6.5 0 011 7.5H0A7.5 7.5 0 007.5 15v-1zM14 7.5A6.5 6.5 0 017.5 14v1A7.5 7.5 0 0015 7.5h-1zM7.5 1A6.5 6.5 0 0114 7.5h1A7.5 7.5 0 007.5 0v1zm0-1A7.5 7.5 0 000 7.5h1A6.5 6.5 0 017.5 1V0z'",
	}),
]
