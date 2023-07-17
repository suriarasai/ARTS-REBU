import { useRouter } from 'next/router'
import { FaRegArrowAltCircleLeft } from 'react-icons/fa'

export const BackButton = ({
	searchType,
	setSearchType,
}: {
	searchType: number
	setSearchType: React.Dispatch<React.SetStateAction<number>>
}) => {
	const router = useRouter()
	return (
		<button
			className='p-2 text-2xl font-medium text-green-600'
			onClick={() =>
				searchType !== 0 ? setSearchType(0) : router.push('/home')
			}
		>
			<FaRegArrowAltCircleLeft />
		</button>
	)
}
