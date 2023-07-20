import { useRouter } from 'next/router'

const AdminMainPage = () => {
	const router = useRouter()

	return (
		<>
			<button
				className='rounded-sm bg-zinc-600 p-4 text-white'
				onClick={() => router.push('/admin/userApp')}
			>
				User App
			</button>
			<button
				className='rounded-sm bg-zinc-600 p-4 text-white'
				onClick={() => router.push('/admin/driverApp')}
			>
				Driver App
			</button>
		</>
	)
}

export default AdminMainPage
