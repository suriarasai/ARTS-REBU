// Notifications page for informing the user

import Page from '@/components/page'
import Section from '@/components/section'
import axios from 'axios'

const Notifications = () => (
	<Page title='Notifications'>
		<Section>
			{/* Ipsum Lorem etc. etc. */}
			<button onClick={() => handleSubmit()}>Click me</button>
		</Section>
	</Page>
)

function handleSubmit(params = {}) {
	const current = [103.7740251, 1.292187]
	const coordinates = [
		[103.6632, 1.32287],
		[103.66506, 1.30803],
		[103.67088, 1.32891],
		[103.67636, 1.3354],
		[103.67669, 1.32779],
		[103.67927, 1.31477],
		[103.67927, 1.32757],
		[103.67958, 1.31458],
		[103.68508, 1.32469],
		[103.6927, 1.3386],
		[103.69367, 1.34],
		[103.69377, 1.37058],
		[103.69431, 1.37161],
		[103.69519, 1.35543],
		[103.69538, 1.34725],
		[103.6961, 1.33667],
		[103.696918716667, 1.35110788333333],
		[103.69731, 1.35],
		[103.698615333333, 1.33590666666667],
		[103.69975, 1.35],
		[103.70129, 1.34],
		[103.70247, 1.34],
		[103.70366, 1.34],
		[103.70394, 1.33948],
		[103.70403, 1.34081],
		[103.704697166667, 1.33546383333333],
		[103.70504, 1.34],
		[103.706281333333, 1.344646],
		[103.70689, 1.34464],
	]
	const distances = []
	coordinates.sort((a, b) => a[1] - b[1])
	coordinates.forEach(([index, distance]) => console.log(index, ':', distance))

	for (let i = 0; i < 3; i++) {
		console.log(coordinates)
	}

	// fetch('https://api.data.gov.sg/v1/transport/taxi-availability')
	// 	.then(function (response) {
	// 		return response.json()
	// 	})
	// 	.then(function (data) {
	// 		console.log(data.features[0].geometry.coordinates[0])
	// 	})
}

export default Notifications
