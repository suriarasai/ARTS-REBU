// Main app component that defines the theme and context for the pages

import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import Meta from '@/components/ui/meta'
import '@/styles/globals.css'
import '@/styles/maps.css'
import { useEffect } from 'react'
import { RecoilRoot, useRecoilValue } from 'recoil'
import { userSelector } from '@/utils/state'

const App = ({ Component, pageProps }: AppProps) => {
	/*
		Component	: the page/component to be rendered
		pageProps	: the props of each page/component
	*/
	// const user = useRecoilValue(userSelector)

	// // Persisting user object
	// useEffect(() => {
	// 	// If the user exists and they have completed registration...
	// 	if (user && user.customerName) {
	// 		localStorage.setItem('user', JSON.stringify(user))
	// 	}
	// }, [user])

	return (
		// Theme provider for site-wide styling (dark mode does not work)
		<ThemeProvider
			attribute='class'
			defaultTheme='default'
			// defaultTheme='system'
			disableTransitionOnChange
		>
			<Meta />
			<RecoilRoot>
				<Component {...pageProps} />
			</RecoilRoot>
		</ThemeProvider>
	)
}

export default App
