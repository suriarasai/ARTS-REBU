import React, { useEffect, useState } from 'react'

// TODO: Limit to 3 options
// Shows options of rides to choose from
export const RideOptions = ({ addr, distance = 0 }) => {
	// , carType, price, time
	const [showModal, setShowModal] = useState(false) // UI for confirming the ride
	const [address, setAddress] = useState(['Unknown Street', 'Unknown'])
	const [date, setDate] = useState(new Date())
	const [options, setOptions] = useState([])

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
				id: 0,
				type: 'RebuX',
				people: 4,
				price: 3.9 + distance * 0.5,
				dropoff: new Date().getTime() + 1000 * 60 * distance * 10,
			},
			{
				id: 1,
				type: 'RebuPool',
				people: 2,
				price: 4.1 + distance + 0.75,
				dropoff: new Date().getTime() + 1000 * 60 * distance * 8,
			},
			{
				id: 2,
				type: 'Rebu SUV',
				people: 1,
				price: 4.3 + distance,
				dropoff: new Date().getTime() + 1000 * 60 * distance * 5,
			},
		])
	}, [date, distance])

	const handleSubmit = () => {
		console.log(addr)
	}

	return (
		<div className='absolute bottom-0 w-11/12 bg-white pb-16 opacity-80 md:pb-4 lg:w-6/12 lg:pb-4'>
			<div className='p-4'>
				{!showModal ? (
					<div>
						{/* Show all the options */}
						<label>Options</label>
						{options.map((option) => (
							<ShowOption
								option={option}
								setShowModal={setShowModal}
								key={option.id}
							/>
						))}
					</div>
				) : (
					<div>
						{/* Confirmation of details screen */}
						<label>Confirm Details</label>

						<ShowOption
							option={options[0]}
							setShowModal={setShowModal}
							key={options[0].id}
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
								onClick={() => setShowModal(false)}
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
const ShowOption = ({ option, setShowModal }) => (
	/*
		option			: the ride option
		setShowModal	: whether to show the modal
	*/
	<div
		className='flow-root p-2 hover:bg-zinc-100'
		key={option.id}
		onClick={() => setShowModal(true)}
	>
		<div className='float-left mt-2'>
			<b>{option.type}</b> - {option.people} people
		</div>
		<div className='float-right mr-8'>
			<b>${option.price.toFixed(2)}</b> <br />
			{new Date(option.dropoff).toLocaleTimeString('en-US', {
				hour: 'numeric',
				minute: 'numeric',
			})}{' ETA'}
		</div>
	</div>
)
