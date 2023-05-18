import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { UserContext } from '@/components/context/UserContext'
import Meta from '@/components/meta'
import '@/styles/globals.css'
import '@/styles/maps.css'
import { useMemo, useState } from 'react'

const App = ({ Component, pageProps }: AppProps) => {
	const [user, setUser] = useState({})
	const userProvider = useMemo(() => ({user, setUser}), [user, setUser])

	return (
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
