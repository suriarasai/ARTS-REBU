import React, { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import { UserContext } from '@/components/context/UserContext'
import { UserContextType } from '@/redux/types'
import { showOptionInterface } from '@/redux/types'
import {
	FaCar,
	FaCarAlt,
	FaCrosshairs,
	FaExpandAlt,
	FaFontAwesomeFlag,
} from 'react-icons/fa'

// Shows options of rides to choose from
export const RideConfirmation = (data) => {
	const { user, setUser } = useContext<UserContextType>(UserContext)
	const router = useRouter()

	const [options, setOptions] = useState<Array<any>>([])
	const [clickedOption, setClickedOption] = useState<number | null>(null)
	const [collapsed, setCollapsed] = useState<boolean>(false)

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

	return (
		<div className='absolute bottom-0 w-screen border bg-white pb-2 md:pb-4 lg:w-6/12 lg:pb-4'>
			{AccordionHeader(clickedOption, setCollapsed, collapsed)}

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
					) : (
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
									// onClick={() => handleSubmit()}
								>
									Confirm
								</button>
							</div>
						</div>
					)}
				</div>
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
	return <div className='mb-2 pl-2 pb-2'>
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
}

function AccordionHeader(
	clickedOption: number,
	setCollapsed: React.Dispatch<React.SetStateAction<boolean>>,
	collapsed: boolean
) {
	return (
		<div className='accordion-header flex flex-wrap pl-4 pt-4'>
			<label className='w-9/12'>
				{clickedOption ? 'Confirm Details' : 'Suggested Rides'}
			</label>
			<label className='bold w-2/12 text-green-500'>View All</label>
			<div className='flex w-1/12' onClick={() => setCollapsed(!collapsed)}>
				<FaExpandAlt />
			</div>
		</div>
	)
}
