import React, { useEffect, useState } from 'react'
import { FaAngleDown, FaClock, FaCoins, FaFlag } from 'react-icons/fa'

export const DriverInformation = ({ onCancel }) => (
	<div className='mt-2 w-full rounded bg-zinc-50 p-3 px-5'>
		<div className='mb-3 flex flex-wrap items-center justify-center'>
			<div className='mr-5 flex h-16 w-16 items-center justify-center rounded-full border border-green-500'>
				JD
			</div>
			<div className='w-2/5'>
				<p className='font-medium'>{'John Doe'}</p>
				<p>{'Silver Honda Civic'}</p>
			</div>
			<div className='flex h-10 w-2/5 items-center justify-center rounded border border-green-700 text-xl text-green-700 '>
				{'SBA 2023A'}
			</div>
		</div>
		<hr className='mb-2' />
		<button className='w-1/2 p-1 text-red-700' onClick={() => onCancel(true)}>
			<p className='font-normal'>Cancel</p>
		</button>
		<button className='w-1/2 p-1 text-green-700'>
			<p className='font-normal'>Contact</p>
		</button>
	</div>
)

export const PaymentInformation = ({ fare }) => (
	<div className='mt-2 flex w-full flex-wrap items-center rounded bg-zinc-50 p-3 px-5'>
		<div className='flex w-11/12 flex-row items-center'>
			<FaCoins className='mx-5 text-lg text-green-500' />
			<>
				$<b className='mr-1 font-normal'>{fare + ' '}</b>
				<p className='text-sm'>{' Cash'}</p>
			</>
		</div>
		<div className='float-right'>
			<FaAngleDown className='text-lg text-green-500' />
		</div>
	</div>
)

export const TripInformation = (props) => {
	const { placeName, postcode, tripETA, taxiETA } = props
	const [ETA, setETA] = useState(new Date())

	useEffect(() => {
		let time = new Date()
		time.setSeconds(time.getSeconds() + tripETA + taxiETA)
		console.log(tripETA, taxiETA)
		console.log(
			new Date().toLocaleTimeString('en-US').replace(/(.*)\D\d+/, '$1')
		)
		console.log(time)
		setETA(time)
	}, [])

	return (
		<div className='mt-2 w-full rounded bg-zinc-50 p-3 px-5'>
			<b className='text-sm'>Your current trip</b>
			<div className='ml-5 mt-2 flex w-full items-center'>
				<FaFlag className='text-lg text-green-500' />
				<div className='w-4/5 p-2 px-5'>
					{placeName + ', Singapore ' + postcode}
				</div>
				<div className='float-right -ml-3'>
					<p>Change</p>
				</div>
			</div>
			<hr className='my-2' />
			<div className='ml-5 flex items-center'>
				<FaClock className='text-lg text-green-500' />
				<div className='p-2 px-5'>
					{ETA.toLocaleTimeString('en-US').replace(/(.*)\D\d+/, '$1')}
				</div>
			</div>
		</div>
	)
}
