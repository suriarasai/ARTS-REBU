import React, { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import { UserContext } from '@/components/context/UserContext'
import { UserContextType } from '@/redux/types'
import { showOptionInterface } from '@/redux/types'
import {
	FaAngleDown,
	FaCar,
	FaCarAlt,
	FaClock,
	FaCoins,
	FaCrosshairs,
	FaExpandAlt,
	FaFlag,
	FaFontAwesomeFlag,
} from 'react-icons/fa'

// Shows options of rides to choose from
export const RideConfirmation = (data) => {
	const { user, setUser } = useContext<UserContextType>(UserContext)
	const router = useRouter()

	const [options, setOptions] = useState<Array<any>>([])
	const [clickedOption, setClickedOption] = useState<number | null>(null)
	const [collapsed, setCollapsed] = useState<boolean>(false)
	const [screen, setScreen] = useState<string>('')

	useEffect(() => {
		console.log(data.distance, typeof data.distance)
		setOptions([
			{
				id: 1,
				type: 'Rebu Regular',
				people: 4,
				price: 3.9 + data.distance * 0.5,
				dropoff: new Date().getTime() + 1000 * 60 * data.distance * 10,
				icon: <FaCarAlt />,
				desc: 'Find the closest car',
			},
			{
				id: 2,
				type: 'RebuPlus',
				people: 2,
				price: 4.1 + data.distance + 0.75,
				dropoff: new Date().getTime() + 1000 * 60 * data.distance * 8,
				icon: <FaCar />,
				desc: 'Better cars',
			},
		])
	}, [data])

	function handleConfirmation(e) {
		e.preventDefault()
		setScreen('waiting')
	}

	return (
		<div>
			<div className='absolute bottom-0 z-50 w-screen rounded-lg border bg-white pb-2 md:pb-4 lg:w-6/12 lg:pb-4'>
				{AccordionHeader(clickedOption, setCollapsed, collapsed, screen)}

				{collapsed ? null : (
					<div className='accordion-content pl-4 pr-4 pb-4'>
						{!clickedOption ? (
							<div>
								{/* Show available taxis */}
								{options.map((option) => (
									<ShowOption
										option={option}
										key={option.id}
										setClickedOption={setClickedOption}
									/>
								))}
							</div>
						) : screen === '' ? (
							<div>
								{/* Confirm details */}
								<ShowOption
									option={options[clickedOption - 1]}
									key={options[clickedOption - 1].id}
									setClickedOption={setClickedOption}
								/>

								{/* Origin and Destination Confirmation */}
								<label className='mt-2'>Route</label>
								{RouteConfirmation(data)}

								<div className='flex items-center justify-center gap-5'>
									<button
										className='grey-button w-1/4'
										onClick={() => setClickedOption(null)}
									>
										Go Back
									</button>
									<button
										className='green-button w-3/4 text-white'
										onClick={(e) => handleConfirmation(e)}
									>
										Confirm
									</button>
								</div>
							</div>
						) : screen === 'waiting' ? (
							<div>
								<h5>Please wait..</h5>
								<button
									className='green-button mt-5 w-full'
									onClick={() => setScreen('confirmed')}
								>
									Skip
								</button>
							</div>
						) : screen === 'confirmed' ? (
							<div>
								{/* Driver and Vehicle Information */}
								<div className='mt-2 w-full rounded bg-zinc-50 p-3 px-5'>
									<div className='mb-3 flex flex-wrap items-center justify-center'>
										<div className='mr-5 flex h-16 w-16 items-center justify-center rounded-full border border-green-500'>
											DN
										</div>
										<div className='w-2/5'>
											<p className='font-medium'>{'[ Taxi Driver Name ]'}</p>
											<p>{'[ Car Model ]'}</p>
										</div>
										<div className='flex h-10 w-2/5 items-center justify-center rounded border border-green-700 text-xl text-green-700 '>
											{'[ Car Plate ]'}
										</div>
									</div>
									<hr className='mb-2' />
									<button className='w-1/2 p-1 text-red-700'>
										<p className='font-normal'>Cancel</p>
									</button>
									<button className='w-1/2 p-1 text-green-700'>
										<p className='font-normal'>Contact</p>
									</button>
								</div>

								{/* Trip Information */}
								<div className='mt-2 w-full rounded bg-zinc-50 p-3 px-5'>
									<b className='text-sm'>Your current trip</b>
									<div className='ml-5 mt-2 flex w-full items-center'>
										<FaFlag className='text-lg text-green-500' />
										<div className='w-4/5 p-2 px-5'>
											{data.destination[0] + ', ' + data.destination[1]}
										</div>
										<div className='float-right -ml-3'>
											<p>Change</p>
										</div>
									</div>
									<hr className='my-2' />
									<div className='ml-5 flex items-center'>
										<FaClock className='text-lg text-green-500' />
										<div className='p-2 px-5'>
											{new Date(
												options[clickedOption].dropoff
											).toLocaleTimeString('en-US', {
												hour: 'numeric',
												minute: 'numeric',
											}) + ' arrival'}
										</div>
									</div>
								</div>

								{/* Payment Information */}
								<div className='mt-2 flex w-full flex-wrap items-center rounded bg-zinc-50 p-3 px-5'>
									<div className='flex w-11/12 flex-row items-center'>
										<FaCoins className='mx-5 text-lg text-green-500' />
										<div>
											$<b className='font-normal'>{options[clickedOption].price}</b>
											<p className='text-sm'>Cash</p>
										</div>
									</div>
									<div className='float-right'>
										<FaAngleDown className='text-lg text-green-500' />
									</div>
								</div>
							</div>
						) : (
							<div>Error: Option not found</div>
						)}
					</div>
				)}
			</div>
			{screen === 'waiting' && (
				<div className='absolute left-0 top-0 z-20 h-full w-full backdrop-brightness-50'></div>
			)}
		</div>
	)
}

// helper component to show rides
const ShowOption = ({ option, setClickedOption }: showOptionInterface) => (
	/*
		option				: the ride option
		setClickedOption	: tracks which ride option was clicked 
	*/
	<div
		className='ride-option'
		key={option.id}
		onClick={() => setClickedOption(option.id)}
	>
		<div className='float-left items-center p-2 pr-4 text-2xl text-green-500'>
			{/* @ts-ignore */}
			{option.icon}
		</div>
		<div className='float-left'>
			<b>{option.type}</b>
			<p className='text-sm'>
				{/* @ts-ignore */}
				1-{option.people} seats ({option.desc})
			</p>
		</div>
		<div className='float-right mr-8'>
			<b className='text-lg'>${option.price}</b>
			<p className='text-sm'>
				{new Date(option.dropoff).toLocaleTimeString('en-US', {
					hour: 'numeric',
					minute: 'numeric',
				})}
				{' ETA'}
			</p>
		</div>
	</div>
)

function RouteConfirmation(data: any) {
	return (
		<div className='mb-2 pl-2 pb-2'>
			<tr className='flex items-center'>
				<th className='p-1 text-right'>
					<FaCrosshairs className='text-xl text-green-500' />
				</th>
				<th className='text-left'>
					<p className='p-2 text-sm'>
						<b>{data.origin[0]}</b>
						{data.origin[1]}
					</p>
				</th>
			</tr>
			<tr className='flex items-center'>
				<th className='p-1 text-right'>
					<FaFontAwesomeFlag className='text-xl text-green-500' />
				</th>
				<th className='text-left'>
					<p className='p-2 text-sm'>
						<b>{data.destination[0]}</b>
						{data.destination[1]}
					</p>
				</th>
			</tr>
		</div>
	)
}

// Dynamic header text in bottom screen
function AccordionHeader(
	clickedOption: number,
	setCollapsed: React.Dispatch<React.SetStateAction<boolean>>,
	collapsed: boolean,
	screen
) {
	return (
		<div className='accordion-header flex flex-wrap pl-4 pt-4'>
			<label className='w-9/12'>
				{!clickedOption
					? 'Suggested Rides'
					: screen === ''
					? 'Confirm Details'
					: screen === 'waiting'
					? 'Confirming your Ride'
					: screen === 'confirmed'
					? 'En Route'
					: ''}
			</label>
			<label className='bold w-2/12 text-green-500'>
				{clickedOption ? '' : 'View All'}
			</label>
			<div className='flex w-1/12' onClick={() => setCollapsed(!collapsed)}>
				<FaExpandAlt />
			</div>
		</div>
	)
}
