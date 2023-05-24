import Section from '@/components/section'

const SearchLocations = () => (
	<Section>
		<div className='flex flex-wrap'>
			<div className='w-2/12'></div>
			<div className='w-10/12'>
				{/* Saved locations: Home and Work */}
				<span className='mt-16 ml-3 inline-grid w-full grid-cols-2'>
					<div onClick={() => console.log('test')}>
						<p>Home</p>
						<h5>Set Location</h5>
					</div>
					<div>
						<p>Work</p>
						<h5>Set Location</h5>
					</div>
				</span>

				{/* TODO: Hide upon search */}
				{/* Recent locations */}
				<label className='mt-6 mb-4'>Recents</label>

				<div className='ml-3 mb-3'>
					<p>Location</p>
					<h5>Address</h5>
				</div>
				<div className='ml-3 mb-3'>
					<p>Location</p>
					<h5>Address</h5>
				</div>
				<div className='ml-3 mb-3'>
					<p>Location</p>
					<h5>Address</h5>
				</div>
			</div>
		</div>
	</Section>
)

export default SearchLocations
