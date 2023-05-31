// Main screen upon log in

import { useRouter } from 'next/router'
import Page from '@/components/ui/page'
import Section from '@/components/ui/section'
import location from '@/public/images/location.png'
import Image from 'next/image'
import BottomNav from '@/components/ui/bottom-nav'

const Home = () => {
	const router = useRouter()
	return (
		<div className='h-screen overflow-hidden'>
			{/* Top Visual */}
			<div className='main-visual flex h-2/5 w-screen flex-col items-center justify-center bg-gradient-to-r from-green-500 to-green-300 shadow-xl'>
				<div className='flex h-16 w-16 items-center justify-center overflow-hidden rounded bg-white shadow-xl'>
					<svg
						viewBox='0 0 15 15'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
						width='30'
						height='30'
						color='#21c51f'
					>
						<path
							d='M14.5 6.497h.5v-.139l-.071-.119-.429.258zm-14 0l-.429-.258L0 6.36v.138h.5zm2.126-3.541l-.429-.258.429.258zm9.748 0l.429-.258-.429.258zM3.5 11.5V11H3v.5h.5zm8 0h.5V11h-.5v.5zM14 6.497V12.5h1V6.497h-1zM.929 6.754l2.126-3.54-.858-.516L.071 6.24l.858.515zM5.198 2h4.604V1H5.198v1zm6.747 1.213l2.126 3.541.858-.515-2.126-3.54-.858.514zM2.5 13h-1v1h1v-1zm.5-1.5v1h1v-1H3zM13.5 13h-1v1h1v-1zm-1.5-.5v-1h-1v1h1zm-.5-1.5h-8v1h8v-1zM1 12.5V6.497H0V12.5h1zm11.5.5a.5.5 0 01-.5-.5h-1a1.5 1.5 0 001.5 1.5v-1zm-10 1A1.5 1.5 0 004 12.5H3a.5.5 0 01-.5.5v1zm-1-1a.5.5 0 01-.5-.5H0A1.5 1.5 0 001.5 14v-1zM9.802 2a2.5 2.5 0 012.143 1.213l.858-.515A3.5 3.5 0 009.802 1v1zM3.055 3.213A2.5 2.5 0 015.198 2V1a3.5 3.5 0 00-3 1.698l.857.515zM14 12.5a.5.5 0 01-.5.5v1a1.5 1.5 0 001.5-1.5h-1zM2 10h3V9H2v1zm11-1h-3v1h3V9zM3 7h9V6H3v1z'
							fill='currentColor'
						></path>
					</svg>
				</div>
				<h1 className='pt-5'>Main Menu</h1>
			</div>

			{/* Bottom Visual */}
			<div className='h-3/5 p-6'>
				<div className='flex h-full flex-wrap justify-center gap-4 pb-20 md:pb-0 lg:pb-0 pt-6 text-center'>
					
                    <MainScreenButton 
                        label='Ride'
                        icon='M2.197 2.698A3.5 3.5 0 015.198 1h4.604a3.5 3.5 0 013 1.698L15 6.358V12.5a1.5 1.5 0 01-1.5 1.5h-1a1.5 1.5 0 01-1.5-1.5V12H4v.5A1.5 1.5 0 012.5 14h-1A1.5 1.5 0 010 12.5V6.358l2.197-3.66zM12 7H3V6h9v1zM2 10h3V9H2v1zm11-1h-3v1h3V9z'
                        href='/booking'
                    />
						

					<MainScreenButton
						label='Locations'
						icon='M13 0H2v14.5a.5.5 0 00.812.39L7.5 11.14l4.688 3.75A.5.5 0 0013 14.5V0z'
						href='/savedPlaces'
					/>

					<MainScreenButton
						label='Messages'
						icon='M0 1.5C0 .67.671 0 1.5 0h12c.829 0 1.5.67 1.5 1.5v8.993c0 .83-.671 1.5-1.5 1.5H7.667L3.8 14.89a.5.5 0 01-.8-.4v-2.498H1.5c-.829 0-1.5-.67-1.5-1.5V1.5zm4 2.497h7v1H4v-1zm0 2.998h5v1H4v-1z'
						href='/settings'
					/>

					<MainScreenButton
						label='Reviews'
						icon='M9.312 2.995A2.034 2.034 0 005.776.992L3 5.354V12.5A2.5 2.5 0 005.5 15h5a2.5 2.5 0 002-1l2.5-3.333V7.5A2.5 2.5 0 0012.5 5H8.309l1.003-2.005zM0 5v10h1V5H0z'
						href='/settings'
					/>
				</div>
			</div>

			{/* Bottom NavBar */}
			<div className='sm:hidden'>
				<BottomNav />
			</div>
		</div>
	)
}

const MainScreenButton = ({ label, icon, href }) => {
	const router = useRouter()

	return (
		<div className='flex w-1/3 flex-col items-center justify-center'>
			<div
				className='main-screen-box flex items-center justify-center'
				onClick={() => router.push(href)}
			>
				<svg
					viewBox='0 0 15 15'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
					width='30'
					height='30'
					color='white'
				>
					<path
						fillRule='evenodd'
						clipRule='evenodd'
						d={icon}
						fill='currentColor'
					></path>
				</svg>
			</div>
			<p className='pt-2 text-sm'>{label}</p>
		</div>
	)
}

export default Home
