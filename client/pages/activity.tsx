// Displays user activity (ex. booked rides, reviews)

import Page from '@/components/ui/page'
import Section from '@/components/ui/section'
import { Title } from '@/redux/types/constants'

const Activity = () => {

	return (
		<Page title={Title.ACTIVITY}>
			<Section>
				Some text goes here
			</Section>
		</Page>
	)
}

export default Activity
