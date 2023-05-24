// Main app component that defines the theme and context for the pages

import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { UserContext } from '@/components/context/UserContext'
import Meta from '@/components/ui/meta'
import '@/styles/globals.css'
import '@/styles/maps.css'
import { useMemo, useState } from 'react'

const App = ({ Component, pageProps }: AppProps) => {
	/*
		Component	: the page/component to be rendered
		pageProps	: the props of each page/component
	*/
	const [user, setUser] = useState({}) // stores and updates user data
	const userProvider = useMemo(() => ({ user, setUser }), [user, setUser]) // provider to operate on user data

	return (
		// Theme provider for site-wide styling (dark mode does not work)
		<ThemeProvider
			attribute='class'
			defaultTheme='default'
			// defaultTheme='system'
			disableTransitionOnChange
		>
			<Meta />
			<UserContext.Provider value={userProvider}>
				<Component {...pageProps} />
			</UserContext.Provider>
		</ThemeProvider>
	)
}

export default App
