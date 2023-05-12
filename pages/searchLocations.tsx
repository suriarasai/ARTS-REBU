import Section from '@/components/section'

const SearchLocations = () => (
	<Section>
		{/* Saved locations: Home and Work */}
		<span className='mt-16 inline-grid w-full grid-cols-2'>
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
			<p className='text-xs text-gray-400'>Address</p>
		</div>
		<div className='ml-3 mb-3'>
			<p>Location</p>
			<p className='text-xs text-gray-400'>Address</p>
		</div>
		<div className='ml-3 mb-3'>
			<p>Location</p>
			<p className='text-xs text-gray-400'>Address</p>
		</div>
	</Section>
)

export default SearchLocations
