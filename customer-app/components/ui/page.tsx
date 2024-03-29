// Reusable template that includes the navbars and header
// Used by pages where users are signed-in (grants access to navBar)

import Head from 'next/head'
import Appbar from '@/components/ui/appbar'
import BottomNav from '@/components/ui/bottom-nav'

interface Props {
	title?: string
	children?: React.ReactNode
	className?: string
}

const Page = ({ title, children, className }: Props) => (
	/*
		title		: the page title, renders in the navBar
		children	: the content to render on the screen
		className	: CSS customization options

	*/
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
		<main className={`mx-auto max-w-screen-md pb-16 px-safe sm:pb-0 pt-12 ${className}`}>
			<div className='p-6'>{children}</div>
		</main>

		{/* Renders bottom navigation bar (mobile users) */}
		<BottomNav />
	</>
)

export default Page
