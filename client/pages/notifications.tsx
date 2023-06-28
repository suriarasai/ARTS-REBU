import Page from '@/components/ui/page'
import Section from '@/components/ui/section'
import { Title } from '@/redux/types/constants'
import { FaSearch } from 'react-icons/fa'

export default function Notifications() {
	return (
		<Page title={Title.NOTIFICATIONS}>
			<Section>
				{/* <div className='absolute bottom-0 z-50 w-screen rounded-lg border bg-white pb-2 md:pb-4 lg:w-6/12 lg:pb-4'>
					<div className='accordion-header flex flex-wrap pl-4 pt-4'>
						<label>Confirming your ride</label>
					</div>
					<div className='accordion-content pb-4 pl-4 pr-4'>
						<div className='flex flex-col items-center justify-center'>
							<FaSearch className='my-5 text-3xl text-green-300' />
							<h1 className='my-5 font-medium'>Looking for a driver...</h1>
							<h5 className='mb-5'>This may take some time</h5>
						</div>
					</div>
				</div> */}
			</Section>
		</Page>
	)
}
