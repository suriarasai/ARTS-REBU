import Page from '@/components/ui/page'
import { useState } from 'react'
import {
	FaBarcode,
	FaCalendar,
	FaCoins,
	FaCreditCard,
	FaHashtag,
	FaPlusCircle,
	FaQrcode,
	FaUser,
} from 'react-icons/fa'
import WalletIcon from '@/public/images/walletIcon.png'
import Image from 'next/image'

const PaymentOptions = ({}) => {
	const [screen, setScreen] = useState<String>('main')

	if (screen === 'addPaymentMethod') {
		return <AddPaymentMethod setScreen={setScreen} />
	}

	return (
		<Page title='Manage Payment Methods'>
			<div className='space-y-5'>
				<div className='flex items-center rounded-lg bg-white px-5 py-2 shadow-sm'>
					<FaCoins className='mr-5 text-2xl text-green-500' />
					<div className='flex-1'>
						<h2 className='font-medium'>Cash</h2>
						<h5>Default payment method</h5>
					</div>
				</div>

				<div className='flex flex-col space-y-3 rounded-lg bg-white px-3 py-6 shadow-sm'>
					<h2 className='font-medium'>Cards</h2>
					<div className='flex w-full space-x-3 rounded-md border border-zinc-200 bg-zinc-50 px-5 py-3 hover:border-2 hover:border-green-300'>
						<FaCreditCard className='text-2xl text-green-500' />
						<div>**** **** **** 5697</div>
					</div>
					<div className='flex w-full space-x-3 rounded-md border border-zinc-200 bg-zinc-50 px-5 py-3 hover:border-2 hover:border-green-300'>
						<FaCreditCard className='text-2xl text-green-500' />
						<div>**** **** **** 5697</div>
					</div>
					<div className='flex w-full space-x-3 rounded-md border border-zinc-200 bg-zinc-50 px-5 py-3 hover:border-2 hover:border-green-300'>
						<FaCreditCard className='text-2xl text-green-500' />
						<div>**** **** **** 5697</div>
					</div>
					<button
						className='flex w-full space-x-3 rounded-md bg-green-400 px-5 py-3'
						onClick={() => setScreen('addPaymentMethod')}
					>
						<FaPlusCircle className='text-2xl text-zinc-50' />
						<p className='font-normal text-zinc-50'>Add New Method</p>
					</button>
				</div>
			</div>
		</Page>
	)
}

const AddPaymentMethod = ({ setScreen }) => {
	return (
		<div className='dark-overlay h-screen w-screen p-4'>
			<div className='h-full w-full flex-col justify-center max-w-sm space-y-7 rounded-3xl bg-white p-7 text-center shadow-md'>
				<Image src={WalletIcon} width={120} height={120} alt='Wallet Icon' className='mr-auto ml-auto' />
				<h1 className='!font-semibold'>Add payment card</h1>

				<p>
					By adding card, I accept the <b>Terms of Service</b> and have read the{' '}
					<b>Privacy Policy</b>.
				</p>

				<div className='space-y-3'>
					<div className='relative'>
						<FaUser className='absolute left-0 top-0 ml-3 mt-3.5 text-xl text-zinc-600' />
						<input
							className='pl-12 rounded-xl bg-zinc-50 p-3 shadow-none'
							placeholder='Name'
						/>
					</div>
					<div className='relative'>
						<FaCreditCard className='absolute left-0 top-0 ml-3 mt-3.5 text-xl text-zinc-600' />
						<input
							className='pl-12 rounded-xl bg-zinc-50 p-3 shadow-none'
							placeholder='#### #### #### ####'
						/>
					</div>
					<div className='relative flex space-x-2'>
						<div className='relative w-1/2'>
							<FaCalendar className='absolute left-0 top-0 ml-3 mt-3.5 text-xl text-zinc-600' />
							<input
								className='pl-12 rounded-xl bg-zinc-50 p-3 shadow-none'
								placeholder='MM/YY'
							/>
						</div>
						<div className='relative w-1/2'>
							<FaHashtag className='absolute left-0 top-0 ml-3 mt-3.5 text-xl text-zinc-600' />
							<input
								className='pl-12 rounded-xl bg-zinc-50 p-3 shadow-none'
								placeholder='###'
							/>
						</div>
					</div>
				</div>

				<div className='flex space-x-3'>
					<button className='flex w-1/2 items-center justify-center space-x-5 rounded-xl bg-zinc-50 p-3 text-zinc-800'>
						<FaQrcode className='text-xl mr-3 text-zinc-700' />
						Scan card
					</button>
					<button className='flex w-1/2 items-center justify-center rounded-xl bg-green-300 p-3 text-zinc-800' onClick={() => setScreen('main')}>
						Confirm
					</button>
				</div>
			</div>
		</div>
	)
}

export default PaymentOptions
