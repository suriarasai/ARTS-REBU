import { FaClock, FaTimes } from 'react-icons/fa'

export const Popup = (props) => {
	const { clear, msg } = props

	return (
		<div className='border-grey absolute left-0 right-0 top-0 ml-auto mr-auto mt-8 flex w-96 justify-center rounded-lg border bg-white px-5 py-4 shadow-lg'>
			<FaClock className='mr-3 text-3xl text-green-500' />
			<div className='flex flex-col'>
				<h2 className='mb-1 font-medium'>Notice</h2>
				<p className='font-normal'>{msg}</p>
			</div>
			<div onClick={() => clear(null)}>
				<FaTimes className='text-xl text-zinc-500' />
			</div>
		</div>
	)
}
