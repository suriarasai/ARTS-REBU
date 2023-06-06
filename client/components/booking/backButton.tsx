import { useRouter } from 'next/router'

export const BackButton = ({ expandSearch, setExpandSearch }) => {
	const router = useRouter()
	return (
		<button
			className='m-3 text-2xl font-medium'
			onClick={() =>
				expandSearch !== 0 ? setExpandSearch(0) : router.push('/home')
			}
		>
			{'🡠'}
		</button>
	)
}
