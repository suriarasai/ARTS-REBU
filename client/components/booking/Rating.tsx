import { useState } from 'react'
import { FaAngleLeft } from 'react-icons/fa'

const Rating = ({ closeModal }) => {
	const [stars, setStars] = useState(false)
	const [feedback, setFeedback] = useState(null)
	const [improve, setImprove] = useState({
		clean: false,
		polite: false,
		punctual: false,
		booking: false,
		wait: false,
	})

	function handleSubmit() {
		const data = {
			stars: stars,
			feedback: feedback,
			improve: improve,
		}
		console.log(data)
		closeModal()
	}

	return (
		<div className='bg-white ml-auto mr-auto mt-5 flex flex-col items-center justify-center'>

			<p className='mb-3 ml-auto mr-auto mt-5 font-medium text-zinc-500'>
				Rate your experience
			</p>
			<div className='star-rating mb-8'>
				<Star label='a' value={5} setClicked={setStars} />
				<Star label='b' value={4} setClicked={setStars} />
				<Star label='c' value={3} setClicked={setStars} />
				<Star label='d' value={2} setClicked={setStars} />
				<Star label='e' value={1} setClicked={setStars} />
			</div>

			<p className='mb-3 ml-auto mr-auto font-medium text-zinc-500'>
				Things that could be better
			</p>

			<div className='mb-8 ml-auto mr-auto flex flex-wrap justify-center'>
				<Field
					label='Cleanliness'
					id='clean'
					setField={setImprove}
					field={improve}
				/>
				<Field
					label='Politeness'
					id='polite'
					setField={setImprove}
					field={improve}
				/>
				<Field
					label='Punctuality'
					id='punctual'
					setField={setImprove}
					field={improve}
				/>
				<Field
					label='Booking Process'
					id='booking'
					setField={setImprove}
					field={improve}
				/>
				<Field
					label='Wait Time'
					id='wait'
					setField={setImprove}
					field={improve}
				/>
			</div>

			<textarea
				cols={40}
				rows={3}
				className='focus:outline-0.5 ml-auto mr-auto w-3/4 rounded-lg p-3 shadow-sm outline-green-500'
				placeholder='Leave a message'
				value={feedback}
				onChange={(e) => setFeedback(e.target.value)}
			/>

			<button
				className='mt-7 h-12 w-full rounded-b-xl bg-green-300 px-4 py-2 text-white shadow-sm'
				onClick={handleSubmit}
			>
				Relay my thoughts!
			</button>
		</div>
	)
}

const Star = ({ label, value, setClicked }) => {
	return (
		<>
			<input
				type='radio'
				name='stars'
				id={`star-${label}`}
				onClick={() => setClicked(value)}
			/>
			<label htmlFor={`star-${label}`}></label>
		</>
	)
}

const Field = ({ label, id, setField, field }) => {
	function handleClick() {
		setField({ ...field, [id]: !field[id] })
	}

	return (
		<div
			className={`m-1.5 w-fit rounded-full border px-3 py-1 ${
				field[id]
					? 'border-2 border-green-500 text-green-500'
					: 'border-1 border-zinc-300 text-zinc-300'
			}`}
			onClick={handleClick}
		>
			{label}
		</div>
	)
}

export default Rating
