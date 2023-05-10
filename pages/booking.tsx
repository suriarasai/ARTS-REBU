// Main hub for booking rides

import Page from '@/components/page'
import Section from '@/components/section'

const Booking = () => (
	<Page title='Booking'>
		<Section>

			{/* Search Bar input fields */}
			<div className='mb-3 w-full'>
				<input
					className='block w-full appearance-none rounded border border-gray-200 bg-gray-200 py-3 px-4 leading-tight text-gray-700 focus:bg-white focus:outline-none'
					type='text'
					placeholder='Your location'
				/>
			</div>
			<div className='mb-3 w-full'>
				<input
					className='block w-full appearance-none rounded border border-gray-200 bg-gray-200 py-3 px-4 leading-tight text-gray-700 focus:bg-white focus:outline-none'
					type='text'
					placeholder='Choose a destination...'
				/>
			</div>

			{/* Saved locations: Home and Work */}
			<span className='inline-grid w-full grid-cols-2'>
				<div className='ml-3'>
					<label className='mb-6 w-full'>Home</label>
					<p className='text-xs text-gray-400'>Set Location</p>
				</div>
				<div className='ml-3'>
					<label>Work</label>
					<p className='text-xs text-gray-400'>Set Location</p>
				</div>
			</span>

			{/* Recent locations */}
			<label className='mt-6 mb-4 block text-xs font-bold uppercase tracking-wide text-gray-700'>
				Recents
			</label>

			<div className='ml-3 mb-3'>
				<p>Location</p>
				<p className="text-xs text-gray-400">Address</p>
			</div>
			<div className='ml-3 mb-3'>
				<p>Location</p>
				<p className="text-xs text-gray-400">Address</p>
			</div>
			<div className='ml-3 mb-3'>
				<p>Location</p>
				<p className="text-xs text-gray-400">Address</p>
			</div>
		</Section>
	</Page>
)

export default Booking
