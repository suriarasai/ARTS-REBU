const withPWA = require('next-pwa')({
	dest: 'public',
})

const runtimeCaching = require('next-pwa/cache')

module.exports = withPWA({
	reactStrictMode: true,
	pwa: {
		dest: 'public',
		runtimeCaching,
	},
})
