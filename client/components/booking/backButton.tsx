import { useRouter } from 'next/router'
import { FaRegArrowAltCircleLeft } from 'react-icons/fa'

export const BackButton = ({ expandSearch, setExpandSearch }) => {
	const router = useRouter()
	return (
		<button
			className='p-2 text-2xl font-medium text-green-500'
			onClick={() =>
				expandSearch !== 0 ? setExpandSearch(0) : router.push('/home')
			}
		>
			<FaRegArrowAltCircleLeft />
		</button>
	)
}
