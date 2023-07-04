import { useState } from 'react'
import { FaAngleLeft, FaStar } from 'react-icons/fa'

const Rating = ({}) => {
	return (
		<div className='absolute ml-auto mr-auto mt-5 flex w-5/6 flex-col items-center justify-center rounded-2xl shadow-md'>
			{/* <label>How was your trip?</label>
			<h5 className='my-3'>
				Your feedback will help us improve the customer experience.
			</h5> */}

			<div className='relative flex w-full justify-center rounded-t-2xl bg-zinc-100 p-3 text-zinc-400'>
				<button className='absolute left-0 top-0 ml-3 mt-3 flex h-8 w-8 items-center rounded-full border border-zinc-400'>
					<FaAngleLeft className='ml-auto mr-auto flex items-center justify-center' />
				</button>
				<h1>Trip Review</h1>
			</div>

			<p className='mb-3 ml-auto mr-auto mt-5'>Rate your experience</p>
			{/* <div className='mb-5 mt-2 flex flex-row-reverse justify-center'>
				{[5, 4, 3, 2, 1].map((item, index) => (
					<Star key={index} index={item} />
				))}
			</div> */}
			<div className='star-rating'>
				<input type='radio' name='stars' id='star-a' value='5' />
				<label htmlFor='star-a'></label>

				<input type='radio' name='stars' id='star-b' value='4' />
				<label htmlFor='star-b'></label>

				<input type='radio' name='stars' id='star-c' value='3' />
				<label htmlFor='star-c'></label>

				<input type='radio' name='stars' id='star-d' value='2' />
				<label htmlFor='star-d'></label>

				<input type='radio' name='stars' id='star-e' value='1' />
				<label htmlFor='star-e'></label>
			</div>

			<p className='mb-3 ml-auto mr-auto'>Things that could be better</p>

			<div className='mb-8 ml-auto mr-auto flex flex-wrap justify-center'>
				<Field label='Cleanliness' />
				<Field label='Politeness' />
				<Field label='Punctuality' />
				<Field label='Booking Process' />
				<Field label='Wait Time' />
			</div>

			<textarea
				cols={40}
				rows={3}
				className='focus:outline-0.5 ml-auto mr-auto w-3/4 rounded-lg p-3 shadow-sm outline-green-500'
				placeholder='Leave a message'
			/>

			<button className='mt-7 h-12 w-full rounded-b-xl bg-green-300 px-4 py-2 text-white shadow-sm'>
				Relay my thoughts!
			</button>
		</div>
	)
}

const Star = ({ index }) => {
	const [clicked, setClicked] = useState(false)
	return (
		<FaStar
			className={`star peer peer-hover:text-green-500 ${
				clicked ? 'text-green-500' : ''
			}`}
			onClick={() => setClicked(!clicked)}
		/>
	)
}

const Field = ({ label }) => {
	const [clicked, setClicked] = useState(false)

	return (
		<div
			className={`m-1.5 w-fit rounded-full border px-3 py-1 ${
				clicked
					? 'border-2 border-green-500 text-green-500'
					: 'border-1 border-zinc-300 text-zinc-300'
			}`}
			onClick={() => setClicked(!clicked)}
		>
			{label}
		</div>
	)
}

export default Rating
