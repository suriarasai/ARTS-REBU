import React, { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import { getCoords } from '@/components/common/getCoords'
import { UserContext } from '../context/UserContext'

// TODO: Limit to 3 options
// Shows options of rides to choose from
export const RideOptions = ({ map, addr, distance = 0 }) => {
	const { user, setUser } = useContext(UserContext)
	const router = useRouter()

	const [address, setAddress] = useState<Array<String>>([
		'Unknown Street',
		'Unknown',
	])
	const [date, setDate] = useState<Date>(new Date())
	const [options, setOptions] = useState<Array<any>>([])
	const [clickedOption, setClickedOption] = useState<number>()

	// Post-processing on address name to separate city and postal code
	useEffect(() => {
		setAddress([
			addr.slice(0, addr?.indexOf(',')),
			addr.slice(addr?.indexOf(',') + 1),
		])
	}, [addr])

	useEffect(() => {
		setOptions([
			{
				id: 1,
				type: 'RebuX',
				people: 4,
				price: 3.9 + distance * 0.5,
				dropoff: new Date().getTime() + 1000 * 60 * distance * 10,
			},
			{
				id: 2,
				type: 'RebuPool',
				people: 2,
				price: 4.1 + distance + 0.75,
				dropoff: new Date().getTime() + 1000 * 60 * distance * 8,
			},
			{
				id: 3,
				type: 'Rebu SUV',
				people: 1,
				price: 4.3 + distance,
				dropoff: new Date().getTime() + 1000 * 60 * distance * 5,
			},
		])
	}, [date, distance])

	const handleSubmit = () => {
		console.log([getCoords(map, 'from'), getCoords(map, 'to')])
		setUser({...user, temp: [getCoords(map, 'from'), getCoords(map, 'to')], tripInfo: options[clickedOption - 1], addr: address})
		router.push('/tracking')
	}

	return (
		<div className='absolute bottom-0 w-11/12 bg-white pb-16 opacity-80 md:pb-4 lg:w-6/12 lg:pb-4'>
			<div className='p-4'>
				{!clickedOption ? (
					<div>
						{/* Show all the options */}
						<label>Options</label>
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
						{/* Confirmation of details screen */}
						<label>Confirm Details</label>

						<ShowOption
							option={options[clickedOption - 1]}
							key={options[clickedOption - 1].id}
							setClickedOption={setClickedOption}
						/>

						<label className='mt-2'>Pickup Location</label>

						<div className='mb-4 p-2'>
							<b>{address[0]}</b>
							<br />
							{address[1]}
						</div>

						<div className='flex items-center justify-center gap-5'>
							<button
								className='grey-button w-1/4'
								onClick={() => setClickedOption(null)}
							>
								Go Back
							</button>
							<button
								className='blue-button w-3/4 bg-cyan-600 text-white'
								key='logout'
								onClick={() => handleSubmit()}
							>
								Confirm
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
// helper component to show rides
const ShowOption = ({ option, setClickedOption }) => (
	/*
		option				: the ride option
		setClickedOption	: tracks which ride option was clicked 
	*/
	<div
		className='flow-root p-2 hover:bg-zinc-100'
		key={option.id}
		onClick={() => setClickedOption(option.id)}
	>
		<div className='float-left mt-2'>
			<b>{option.type}</b> - {option.people} people
		</div>
		<div className='float-right mr-8'>
			<b>${option.price.toFixed(2)}</b> <br />
			{new Date(option.dropoff).toLocaleTimeString('en-US', {
				hour: 'numeric',
				minute: 'numeric',
			})}
			{' ETA'}
		</div>
	</div>
)
