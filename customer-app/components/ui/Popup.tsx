import { notificationAtom } from '@/state'
import { FaClock, FaTimes } from 'react-icons/fa'
import { useRecoilState } from 'recoil'

export const Popup = ({ msg }) => {
	const [, setNotification] = useRecoilState(notificationAtom)

	const handleClose = () => setNotification('')

	return (
		<div className='absolute left-0 right-0 top-0 ml-auto mr-auto mt-16 flex w-96 justify-center rounded-lg border bg-gray-700 px-5 py-4 shadow-lg'>
			<FaClock className='mr-3 text-3xl text-green-300' />
			<div className='flex flex-col text-zinc-100'>
				<h2 className='mb-1 font-medium'>Notice</h2>
				<p className='font-normal'>{msg}</p>
			</div>
			<div onClick={handleClose}>
				<FaTimes className='text-xl text-zinc-400' />
			</div>
		</div>
	)
}
