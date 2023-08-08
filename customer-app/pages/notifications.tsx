import Page from "@/components/ui/page"
import api from '@/api/axiosConfig'

export default function Notifications() {
return (

	<Page>
		<button onClick={findNearestTaxis}>Calculate</button>
	</Page>
)
}


export async function findNearestTaxis() {
	const response = await api.post('/api/v1/Kafka/findNearestTaxis', {
		message: {
			lat: 1.2973069,
			lng: 103.7884249
		},
	})
	console.log(response)
}
