import { useContext, useState, useRef } from 'react'
import Page from '@/components/ui/page'
import Section from '@/components/ui/section'
import api from '@/api/axiosConfig'
import { UserContext } from '@/components/context/UserContext'
import { rewardPoints } from '@/redux/types'
// import { RewardPointsAPI } from '@/server'

const RewardPoints = () => {
	const { user, setUser } = useContext(UserContext)
	const rewardsForm = useRef<any>(null)

	const [rewardPoints, updateRewardPoints] = useState<number>(
		// user.rewardPoints ? user.rewardPoints : 0
	)
	const [rewardHistory, updateRewardHistory] = useState<rewardPoints[]>(
		// user.rewardHistory!
	)
	const [invalidInput, updateInvalidInput] = useState<boolean>(false) // Validation checks on redemption input box

	const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		const points: number = rewardsForm.current?.points.value
		e.preventDefault()

		// Ensures the user has the number of points they want
		if (rewardPoints - points >= 0 && points > 0) {
			// const rewardData = await RewardPointsAPI(user.id!, rewardPoints - points)
			
			// setUser({ ...user, rewardHistory: rewardData, rewardPoints: rewardPoints - points })
			// updateRewardHistory(rewardData)
			updateRewardPoints(rewardPoints - points)
		} else {
			updateInvalidInput(true)
		}
	}

	return (
		<Page title='Reward Points'>
			<Section>
				<div className='mt-3 mb-8'>
					<h2 className='mt-3 mb-8 text-center text-xl font-bold'>
						Redeem Reward Points
					</h2>
					<div className='flex-cols flex pb-8 text-3xl'>
						<div className='mr-3 w-1/2 rounded bg-green-700 p-4 text-zinc-100'>
							<label className='text-zinc-100'>Total Reward Points</label>
							{rewardPoints}
						</div>
						<div className='w-1/2 rounded bg-green-700 p-4 text-zinc-100'>
							<label className='text-zinc-100'>Points Worth</label>$
							{rewardPoints ? rewardPoints / 100 : 0}
						</div>
					</div>

					<form className='flex-cols flex pb-8' ref={rewardsForm}>
						<div className='mr-3 w-3/4'>
							<input
								type='number'
								name='points'
								placeholder='Enter Points to Redeem'
								className='py-2 px-4'
							/>
							{invalidInput && (
								<p className='text-error px-3'>
									The maximum you can redeem is {rewardPoints}
								</p>
							)}
						</div>
						<div className='mt-1 w-1/4'>
							<button
								className='green-button w-full uppercase -mt-1'
								onClick={(e) => handleSubmit(e)}
							>
								Redeem
							</button>
						</div>
					</form>

					<label className='pb-3'>Reward History</label>

					{rewardHistory ? (
						<table className='w-full table-auto text-left'>
							<thead>
								<tr>
									<th>Date</th>
									<th>Points</th>
									<th>Total Points</th>
								</tr>
							</thead>
							<tbody>
								{rewardHistory.map((transaction, index) => (
									<tr key={index}>
										<td>{transaction.date}</td>
										<td>{transaction.points * -1}</td>
										<td>{transaction.totalPoints}</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						'No transactions to date'
					)}
				</div>
			</Section>
		</Page>
	)
}

export default RewardPoints
