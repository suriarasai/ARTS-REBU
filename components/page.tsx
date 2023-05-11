// Reusable template that includes the navbars and header

import Head from 'next/head'
import Appbar from '@/components/appbar'
import BottomNav from '@/components/bottom-nav'

interface Props {
	children: React.ReactNode
	title?: string
}

const Page: React.FC<Props> = ({ children, title }) => (
	<>
		{/* For web: Changes the name in the browser tab */}
		{title ? (
			<Head>
				<title>Rebu | {title}</title>
			</Head>
		) : null}

		{/* Renders header and top navigation bar (web users) */}
		<Appbar sectionTitle={title} />

		{/* Inputed information goes here */}
		<main className='mx-auto max-w-screen-md pb-16 px-safe sm:pb-0 pt-12'>
			<div className='p-6'>{children}</div>
		</main>

		{/* Renders bottom navigation bar (mobile users) */}
		<BottomNav />
	</>
)

export default Page
