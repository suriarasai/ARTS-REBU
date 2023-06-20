import Page from '@/components/ui/page'
import Section from '@/components/ui/section'
import { Title } from '@/redux/types/constants'
import { useRef, useState } from 'react'

export default function Notifications() {
	const inputRef = useRef(null)
	const [input, setInput] = useState('')

	return (
		<Page title={Title.NOTIFICATIONS}>
			<Section>
				Notification
				<input
					onClick={() => console.log(inputRef.current.value)}
					placeholder='Text'
					ref={inputRef}
					onChange={(e) => setInput(e.target.value)}
				/>
				<button
					onClick={() => {
						setInput('test')
						inputRef.current.value = input
					}}
				>
					Click
				</button>
			</Section>
		</Page>
	)
}
