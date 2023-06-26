import { HREF } from '@/redux/types/constants'
import { useRouter } from 'next/router'
import {
	FaAngleLeft,
	FaBook,
	FaCrosshairs,
	FaFacebookMessenger,
	FaHashtag,
	FaMoneyBill,
	FaShip,
	FaTaxi,
	FaUser,
} from 'react-icons/fa'

export default function SideNav() {
	const router = useRouter()

	return (
		<div className='w-full'>
			<div className='fixed h-screen w-1/12 lg:w-2/12'>
				<div className='sidenav-gradient absolute h-full w-full' />
				<div className='flex h-full flex-col items-center lg:items-start lg:px-8 lg:py-5'>
					<div
						className='mb-16 mt-5 flex items-center lg:mt-0'
						onClick={() => router.push(HREF.SIGN_IN)}
					>
						<FaTaxi className='sidenav-icon' />
						<h1 className='hidden !text-3xl lg:block'>Rebu</h1>
					</div>

					<div
						className='sidenav-link-container'
						onClick={() => router.push(HREF.BOOKINGUI)}
					>
						<FaBook className='sidenav-icon' />
						<p className='sidenav-link'>TBS</p>
					</div>

					<div
						className='sidenav-link-container'
						onClick={() => router.push('/')}
					>
						<FaShip className='sidenav-icon' />
						<p className='sidenav-link'>FMS</p>
					</div>
					<div
						className='sidenav-link-container'
						onClick={() => router.push('/')}
					>
						<FaCrosshairs className='sidenav-icon' />
						<p className='sidenav-link'>GPS</p>
					</div>
					<div
						className='sidenav-link-container'
						onClick={() => router.push('/')}
					>
						<FaUser className='sidenav-icon' />
						<p className='sidenav-link'>CRM</p>
					</div>
					<div
						className='sidenav-link-container'
						onClick={() => router.push('/')}
					>
						<FaFacebookMessenger className='sidenav-icon' />
						<p className='sidenav-link'>MSG</p>
					</div>
					<div
						className='sidenav-link-container'
						onClick={() => router.push('/')}
					>
						<FaHashtag className='sidenav-icon' />
						<p className='sidenav-link'>FS</p>
					</div>
					<div
						className='sidenav-link-container'
						onClick={() => router.push('/')}
					>
						<FaMoneyBill className='sidenav-icon' />
						<p className='sidenav-link'>Pay</p>
					</div>
				</div>
			</div>
			<div></div>
		</div>
		// <main className='relative ml-auto mr-auto flex h-screen max-w-screen-md flex-col bg-zinc-50 px-10 py-8'>
		// 	<h1 className='!font-bold text-zinc-600'>Dashboard</h1>
		// </main>
	)
}
