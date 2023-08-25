// Site information (usually contained in the HTML file)

import Head from 'next/head'

const Meta = () => (
	<Head>
		<title>Rebu Demo App</title>
		<meta charSet='utf-8' />
		<meta name='mobile-web-app-capable' content='yes' />
		<meta name='apple-mobile-web-app-capable' content='yes' />
		<meta name='apple-mobile-web-app-title' content='Rebu Driver' />
		<meta name='application-name' content='Rebu Driver' />
		<meta name='description' content='SEA-based Taxi Hailing App' />
		<meta
			name='viewport'
			content='width=device-width, initial-scale=1, user-scalable=0, viewport-fit=cover'
		/>
		<link rel='apple-touch-icon' href='/images/icon-maskable-512.png' />
		<link rel='icon' type='image/png' href='/images/favicon.png' />
		<link rel='manifest' href='/manifest.json' />
	</Head>
)

export default Meta
