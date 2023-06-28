import React from 'react';
import { FaCrosshairs, FaFlag, FaStar } from 'react-icons/fa';

export const CompleteTripUI = ({
	options, clickedOption, tripETA, taxiETA, data, handleCompletedCleanup,
}): React.ReactNode => (
	<div className='px-4'>
		<div className='flex items-center border-b border-zinc-300 py-3'>
			<div className='mr-5 h-8 w-8 rounded-2xl bg-gradient-to-tr from-lime-500 to-green-200'></div>
			<div className='flex-1'>
				<p className='font-medium'>John Doe</p>
				<h5 className='flex items-center'>
					<FaStar className='text-yellow mr-2' />
					4.8
				</h5>
			</div>
			<div className='flex-1'>
				<h5>Final cost:</h5>
				<h5 className='font-bold'>SG${options[clickedOption - 1].fare}</h5>
			</div>
			<div className='flex-1'>
				<h5>Time</h5>
				<h5 className='font-bold'>
					{Math.round((tripETA) / 60)} min.
				</h5>
			</div>
		</div>
		<div className='border-b border-zinc-300 py-4'>
			<label className='pb-2'>Trip</label>
			<div className='flex items-center pr-5 pb-2'>
				<FaCrosshairs className='w-2/12 text-zinc-500' />
				<p className='w-8/12 font-normal'>{data.origin.placeName}</p>
				<p className='w-2/12 ml-auto'>9:40 PM</p>
			</div>
			<div className='flex items-center pr-5'>
				<FaFlag className='w-2/12 text-green-600' />
				<p className='w-8/12 font-normal'>{data.destination.placeName}</p>
				<p className='w-2/12 ml-auto'>10:10 PM</p>
			</div>
		</div>
		<div className='mt-5 flex flex-col justify-center'>
			<label>How was your trip?</label>
			<h5 className='my-3'>
				Your feedback will help us improve the customer experience.
			</h5>
			<div className='mb-5 flex justify-center p-3'>
				<FaStar className='mx-2 text-3xl text-zinc-300' />
				<FaStar className='mx-2 text-3xl text-zinc-300' />
				<FaStar className='mx-2 text-3xl text-zinc-300' />
				<FaStar className='mx-2 text-3xl text-zinc-300' />
				<FaStar className='mx-2 text-3xl text-zinc-300' />
			</div>
		</div>
		<div className='w-full'>
			<button
				className='rect-button w-full p-3 shadow-md'
				onClick={handleCompletedCleanup}
			>
				Done
			</button>
		</div>
	</div>
);
