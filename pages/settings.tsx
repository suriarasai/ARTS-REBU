import Page from '@/components/page'
import Section from '@/components/section'

const Settings = () => (
	<Page title="Settings">
		<Section>
			<h2 className='text-xl font-semibold'>Ingredients</h2>

			<div className='mt-2'>
				<p className='text-zinc-600 dark:text-zinc-400'>
					Like any good recipe, we appreciate community offerings to cultivate a
					delicous dish.
				</p>
			</div>
		</Section>
	</Page>
)

export default Settings
