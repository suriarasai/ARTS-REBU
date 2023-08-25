import Page from '@/components/ui/page'
import api from '@/api/axiosConfig'

export default function Notifications() {
	return (
		<Page>
			<button onClick={findNearestTaxis}>Calculate</button>
		</Page>
	)
}

async function findNearestTaxis() {
	const response = await api.post('/api/v1/Kafka/findNearestTaxis', {
		lat: 1.2973069,
		lng: 103.7884249,
	})
}
