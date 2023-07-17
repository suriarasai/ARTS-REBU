// Temporary API to connect to the MongoDB database

import axios from 'axios'

export default axios.create({
	baseURL: 'http://127.0.0.1:8080/',
	headers: { 'ngrok-skip-browser-warning': 'true' },
})
