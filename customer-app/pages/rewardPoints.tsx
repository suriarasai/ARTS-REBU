import { useState, useRef } from 'react'
import Page from '@/components/ui/page'
import { rewardPoints } from '@/types'
import { Rewards, Title } from '@/constants'
import { userAtom } from '@/state'
import { useRecoilState } from 'recoil'

const RewardPoints = () => {
	const [user, setUser] = useRecoilState(userAtom)
	const rewardsForm = useRef<any>(null)

	const [rewardPoints, updateRewardPoints] = useState<number>(0)
	// user.rewardPoints ? user.rewardPoints : 0
	const [rewardHistory, updateRewardHistory] = useState<rewardPoints[]>()
	// user.rewardHistory!
	const [invalidInput, updateInvalidInput] = useState<boolean>(false) // Validation checks on redemption input box

	const handleSubmit = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
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
		<Page title={Title.REWARDS}>
			<div className='mb-8 mt-3'>
				<h2 className='mb-8 mt-3 text-center text-xl font-bold'>
					{Rewards.REDEEM_POINTS}
				</h2>
				<div className='flex-cols flex pb-8 text-3xl'>
					<div className='mr-3 w-1/2 rounded bg-green-700 p-4 text-zinc-100'>
						<label className='text-zinc-100'>{Rewards.POINTS}</label>
						{rewardPoints}
					</div>
					<div className='w-1/2 rounded bg-green-700 p-4 text-zinc-100'>
						<label className='text-zinc-100'>{Rewards.POINTS_WORTH}</label>$
						{rewardPoints ? rewardPoints / 100 : 0}
					</div>
				</div>

				<form className='flex-cols flex pb-8' ref={rewardsForm}>
					<div className='mr-3 w-3/4'>
						<input
							type='number'
							name='points'
							placeholder='Enter Points to Redeem'
							className='px-4 py-2'
						/>
						{invalidInput && (
							<p className='text-error px-3'>
								{Rewards.MAXIMUM} {rewardPoints}
							</p>
						)}
					</div>
					<div className='mt-1 w-1/4'>
						<button
							className='green-button -mt-1 w-full uppercase'
							onClick={(e) => handleSubmit(e)}
						>
							Redeem
						</button>
					</div>
				</form>

				<label className='pb-3'>{Rewards.HISTORY}</label>

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
					Rewards.NO_DATA
				)}
			</div>
		</Page>
	)
}

export default RewardPoints
