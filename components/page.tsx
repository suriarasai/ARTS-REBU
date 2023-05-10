import Head from 'next/head'
import Appbar from '@/components/appbar'
import BottomNav from '@/components/bottom-nav'

interface Props {
	title?: string
	children: React.ReactNode
	showHeader?: boolean
}

const Page = ({ title, children, showHeader = true }: Props) => (
	<>
		{title ? (
			<Head>
				<title>Rebu | {title}</title>
			</Head>
		) : null}

		{showHeader ? <Appbar sectionTitle={title} /> : null}

		<main className={`mx-auto max-w-screen-md pb-16 px-safe sm:pb-0 ${showHeader ? 'pt-12' : null}`}>
			<div className='p-6'>{children}</div>
		</main>

		<BottomNav />
	</>
)

export default Page
