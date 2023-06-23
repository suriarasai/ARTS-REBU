import Page from '@/components/ui/page'
import Section from '@/components/ui/section'
import { Title } from '@/redux/types/constants'
import { useState } from 'react'
import { Popup } from '../components/ui/Popup'

export default function Notifications() {
	const [notification, setNotification] = useState('')

	return (
		<Page title={Title.NOTIFICATIONS}>
			<Section>
				<button className='rect-button' onClick={() => setNotification('1min')}>
					Experiment
				</button>

				{notification === '1min' && <Popup clear={setNotification} />}

				{notification === '0min' && <Popup clear={setNotification} />}
			</Section>
		</Page>
	)
}


