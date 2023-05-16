import Page from '@/components/page'
import Section from '@/components/section'

const RewardPoints = () => {
	return (
		<Page title='Reward Points'>
			<Section>
				<div className='mt-3 mb-8'>
				<h2 className='mt-3 mb-8 text-center text-xl font-bold'>Redeem Reward Points</h2>
					<div className='flex-cols flex pb-8 text-3xl'>
						<div className='w-1/2 bg-cyan-700 text-zinc-100 rounded p-4 mr-3'>
							<label className='text-zinc-100'>Total Reward Points</label>
							{1552023}
						</div>
						<div className='w-1/2 bg-cyan-700 text-zinc-100 rounded p-4'>
							<label className='text-zinc-100'>Points Worth</label>
							${100}
						</div>
					</div>
					<div className='flex-cols flex pb-8'>
						<div className='w-3/4 mr-3'>
							<input placeholder='Enter Points to Redeem' />
						</div>
						<div className='w-1/4 mt-1'>
							<button className='blue-button uppercase w-full'>Redeem</button>
						</div>
					</div>

					<label className='pb-3'>Reward History</label>
					
					<table className='table-auto text-left w-full'>
						<thead>
							<th>Date</th>
							<th>Event</th>
							<th>Points</th>
							<th>Total Points</th>
						</thead>
						<tbody>
							<tr>
								<td>16/05/2023</td>
								<td>Promotion A</td>
								<td>165</td>
								<td>375</td>
							</tr>
							<tr>
								<td>16/04/2023</td>
								<td>Points Redeemed</td>
								<td>-300</td>
								<td>675</td>
							</tr>
						</tbody>
					</table>

				</div>
			</Section>
		</Page>
	)
}

export default RewardPoints
