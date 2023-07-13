import { LoadingScreen } from '@/components/ui/LoadingScreen'
import Page from '@/components/ui/page'
import { useRouter } from 'next/router'
import { Suspense } from 'react'
import { HREF, Sub } from '@/constants'
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
		<Suspense fallback={<LoadingScreen />}>
			<Page title='Rebu'>
				<div className='grid aspect-square h-full w-full grid-cols-3 gap-4'>
					<HomeIcon
						icon={<FaTaxi />}
						href={HREF.BOOKING}
						label={Sub.BOOKING}
						isMain={true}
					/>
					<HomeIcon
						icon={<FaCoins />}
						href={HREF.REWARDS}
						label={Sub.REWARDS}
					/>
					<HomeIcon
						icon={<FaComment />}
						href={HREF.MESSAGES}
						label={Sub.MESSAGES}
					/>
					<HomeIcon
						icon={<FaBookmark />}
						href={HREF.LOCATIONS}
						label={Sub.LOCATIONS}
					/>
					<HomeIcon
						icon={<FaClock />}
						href={HREF.HISTORY}
						label={Sub.HISTORY}
						isMain={true}
					/>
					<HomeIcon
						icon={<FaMarker />}
						href={HREF.RATINGS}
						label={Sub.RATINGS}
					/>
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
