import Page from '@/components/page'
import Section from '@/components/section'

const RewardPoints = () => {
	return (
		<Page title='Reward Points'>
			<Section>
				<div className='text-bold mt-3 mb-8 text-center text-4xl'>
					<label className='pb-6'>Your Points</label>
					<div className='flex flex-cols items-center justify-center'>
						<svg
							viewBox='0 0 15 15'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
							width='20'
							height='20'
                            className='mr-5 mt-2'
						>
							<path
								d='M7.5 14.5l-.395.307a.5.5 0 00.79 0L7.5 14.5zm-7-9l-.429-.257a.5.5 0 00.034.564L.5 5.5zm3-5V0h-.283L3.07.243 3.5.5zm8 0l.429-.257L11.783 0H11.5v.5zm3 5l.395.307a.5.5 0 00.034-.564L14.5 5.5zm-6.605 8.693l-7-9-.79.614 7 9 .79-.614zM.929 5.757l3-5L3.07.243l-3 5 .858.514zM3.5 1h8V0h-8v1zm7.571-.243l3 5 .858-.514-3-5-.858.514zm3.034 4.436l-7 9 .79.614 7-9-.79-.614z'
								fill='currentColor'
							></path>
						</svg>
						{1552023}
					</div>
				</div>
			</Section>
		</Page>
	)
}

export default RewardPoints
