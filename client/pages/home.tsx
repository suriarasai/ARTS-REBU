import { LoadingScreen } from '@/components/ui/LoadingScreen'
import Page from '@/components/ui/page'
import { useRouter } from 'next/router'
import { Suspense } from 'react'
import {
	FaBookmark,
	FaClock,
	FaCoins,
	FaComment,
	FaMarker,
	FaTaxi,
} from 'react-icons/fa'

export default function Home() {
	return (
		<Suspense fallback={LoadingScreen}>
			<Page title='Rebu'>
				<div className='w-full'>
					<div className='grid aspect-square h-full grid-cols-3 gap-4'>
						<HomeIcon
							icon={<FaTaxi />}
							href='/booking'
							label='Book a Ride'
							isMain={true}
						/>
						<HomeIcon
							icon={<FaCoins />}
							href='/rewardPoints'
							label='Your Reward Points'
						/>
						<HomeIcon icon={<FaComment />} href='/home' label='Messages' />
						<HomeIcon
							icon={<FaBookmark />}
							href='/savedPlaces'
							label='Saved Locations'
						/>
						<HomeIcon
							icon={<FaClock />}
							href='/activity'
							label='Trip History'
							isMain={true}
						/>
						<HomeIcon
							icon={<FaMarker />}
							href='/settings'
							label='Your Ratings'
						/>
					</div>
				</div>
			</Page>
		</Suspense>
	)
}

const HomeIcon = ({ icon, href, label, isMain = false }) => {
	const router = useRouter()
	return (
		<div
			className={`home-box ${isMain ? ' home-big-box' : ''}`}
			onClick={() => router.push(href)}
		>
			<div className={`home-icon ${isMain ? ' text-5xl' : ''}`}>{icon}</div>
			<p>{label}</p>
		</div>
	)
}
