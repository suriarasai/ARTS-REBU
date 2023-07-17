import Head from 'next/head'
import SideNav from '@/components/ui/sidenav'

const Admin = ({ title, children }: {title: string, children: React.ReactNode}) => (
	<>
		{/* For web: Changes the name in the browser tab */}
		{title ? (
			<Head>
				<title>Rebu | {title}</title>
			</Head>
		) : null}

		<div className='flex h-screen w-screen'>
			<div className='w-1/12 lg:w-2/12'>
				<SideNav />
			</div>

			{/* Inputed information goes here */}
			<main className='w-11/12 lg:w-10/12'>
				{children}
			</main>
		</div>
	</>
)

export default Admin
