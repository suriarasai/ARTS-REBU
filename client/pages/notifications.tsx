import SelectPaymentMethod from '@/components/payment/SelectPaymentMethod'
import Page from '@/components/ui/page'
import { useState } from 'react'

const Notifications = () => {
	const [selectedCard, setSelectedCard] = useState('Cash')
	return (
		<div className='relative h-screen w-screen'>
			<div className='responsive w-full lg:w-1/2'>
				<div className='absolute bottom-0 z-50 w-screen rounded-lg border bg-white lg:w-6/12'>
					<div className='accordion-header flex flex-wrap pl-4 pt-4'>
						<label>Text</label>
					</div>
					<div className='accordion-content pb-4 pl-4 pr-4'>
						<SelectPaymentMethod
							set={() => {}}
							selectedCard={selectedCard}
							setSelectedCard={setSelectedCard}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Notifications
