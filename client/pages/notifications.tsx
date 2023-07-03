import Receipt from '@/components/booking/UI/Receipt'
import Page from '@/components/ui/page'
import Section from '@/components/ui/section'
import { Title } from '@/redux/types/constants'
import { FaSearch } from 'react-icons/fa'

export default function Notifications() {
	return (
		<div className='responsive bg-white h-screen w-screen px-10 py-3'>
			<Receipt bookingID={4} setScreen={() => {}}/>
		</div>
	)
}
