import { addRating } from '@/server'
import { Rating } from '@/types'
import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { FaArrowLeft } from 'react-icons/fa'
import { userAtom } from '@/state'

const Rating = ({ closeModal }: { closeModal: any }) => {
	const user = useRecoilValue(userAtom)
	const [stars, setStars] = useState<number | null>(null)
	const [feedback, setFeedback] = useState<string | null>(null)
	const [improve, setImprove] = useState({
		cleanliness: false,
		politeness: false,
		punctuality: false,
		bookingProcess: false,
		waitTime: false,
	})

	function handleSubmit() {
		addRating({
			customerID: user.customerID as number,
			driverID: 1,
			rating: stars,
			reviewBody: feedback,
			areasOfImprovement: improve,
		} as Rating | any)
		closeModal()
	}

	return (
		<div className='ml-auto mr-auto mt-5 flex flex-col items-center justify-center bg-gray-700'>
			<button
				className='absolute left-0 top-0 ml-5 mt-12 flex items-center justify-center p-1 text-2xl text-green-300'
				onClick={closeModal}
			>
				<FaArrowLeft />
			</button>
			<p className='mb-3 ml-auto mr-auto mt-5 font-medium text-zinc-200'>
				Rate your experience
			</p>
			<div className='star-rating mb-5'>
				<Star label='a' value={5} setClicked={setStars} />
				<Star label='b' value={4} setClicked={setStars} />
				<Star label='c' value={3} setClicked={setStars} />
				<Star label='d' value={2} setClicked={setStars} />
				<Star label='e' value={1} setClicked={setStars} />
			</div>

			<p className='mb-3 ml-auto mr-auto font-medium text-zinc-200'>
				Things that could be better
			</p>

			<div className='mb-8 ml-auto mr-auto flex flex-wrap justify-center'>
				<Field
					label='Cleanliness'
					id='cleanliness'
					setField={setImprove}
					field={improve}
				/>
				<Field
					label='Politeness'
					id='politeness'
					setField={setImprove}
					field={improve}
				/>
				<Field
					label='Punctuality'
					id='punctuality'
					setField={setImprove}
					field={improve}
				/>
				<Field
					label='Booking Process'
					id='bookingProcess'
					setField={setImprove}
					field={improve}
				/>
				<Field
					label='Wait Time'
					id='waitTime'
					setField={setImprove}
					field={improve}
				/>
			</div>

			<textarea
				cols={40}
				rows={3}
				className='ml-auto mr-auto w-3/4 rounded-lg bg-gray-600 p-3 text-zinc-100 shadow-sm focus:border-2 focus:border-green-300 focus:outline-none'
				placeholder='Leave a message'
				value={feedback as any}
				onChange={(e) => setFeedback(e.target.value)}
			/>

			<button
				className='mt-7 h-12 w-full bg-green-300 px-4 py-2 text-gray-700 shadow-sm'
				onClick={handleSubmit}
			>
				Relay my thoughts!
			</button>
		</div>
	)
}

const Star = ({
	label,
	value,
	setClicked,
}: {
	label: string
	value: number
	setClicked: React.Dispatch<React.SetStateAction<number | null>>
}) => {
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

const Field = ({
	label,
	id,
	setField,
	field,
}: {
	label: string
	id: string
	setField: React.Dispatch<React.SetStateAction<any>>
	field: any
}) => {
	function handleClick() {
		setField({ ...field, [id]: !field[id] })
	}

	return (
		<div
			className={`m-1.5 w-fit rounded-full border px-3 py-1 ${
				field[id]
					? 'border-2 border-green-300 text-green-300'
					: 'border-1 border-zinc-200 text-zinc-200'
			}`}
			onClick={handleClick}
		>
			{label}
		</div>
	)
}

export default Rating
