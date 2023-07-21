import {
	FaCalendar,
	FaCreditCard,
	FaHashtag,
	FaQrcode,
	FaTimes,
	FaUser,
} from 'react-icons/fa'
import WalletIcon from '@/public/images/walletIcon.png'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { AddPaymentMethod } from '@/server'
import { useRecoilState } from 'recoil'
import { userAtom } from '@/utils/state'

export const AddCard = ({
	customerID,
	setScreen,
	setCards,
	cards,
}: {
	customerID: number
	setScreen: React.Dispatch<React.SetStateAction<string>>
	setCards: any
	cards: any
}) => {
	const [user, setUser] = useRecoilState(userAtom)
	const {
		register: register,
		handleSubmit: handleSubmit,
		formState: { errors: errors },
	} = useForm()
	const onSubmit = handleSubmit((data) => {
		AddPaymentMethod(customerID, data)
		setUser({ ...user, paymentMethods: [...cards, data] })
		setCards([...cards, data])
		setScreen('main')
	})

	return (
		<div className='dark-overlay h-screen w-screen overflow-hidden p-4'>
			<div className='add-payment-modal relative overflow-hidden'>
				<div className='absolute right-0 top-0 mr-5 mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-green-500'>
					<FaTimes
						className='text-xl text-zinc-600'
						onClick={() => setScreen('main')}
					/>
				</div>
				<Image
					src={WalletIcon}
					width={110}
					height={110}
					alt='Wallet Icon'
					className='ml-auto mr-auto'
				/>
				<h1 className='!font-semibold'>Add payment card</h1>

				<p>
					By adding card, I accept the <b>Terms of Service</b> and have read the{' '}
					<b>Privacy Policy</b>.
				</p>

				<form onSubmit={onSubmit} className='overflow-y-auto'>
					<div className='space-y-3'>
						<div className='relative'>
							<FaUser
								className={`payment-icon ${
									errors.cardHolder ? 'text-red-700' : ''
								}`}
							/>
							<input
								{...register('cardHolder', {
									required: true,
									minLength: 2,
									pattern: /^[a-zA-Z]/i,
								})}
								className='payment-input'
								placeholder='Name'
							/>
						</div>
						<div className='relative'>
							<FaCreditCard
								className={`payment-icon ${
									errors.cardNumber ? 'text-red-700' : ''
								}`}
							/>
							<input
								{...register('cardNumber', {
									required: true,
									minLength: 16,
									maxLength: 16,
									pattern: /^[0-9]*$/i,
								})}
								className='payment-input'
								placeholder='#### #### #### ####'
								type='number'
							/>
						</div>
						<div className='relative flex space-x-2'>
							<div className='relative w-1/2'>
								<FaCalendar
									className={`payment-icon ${
										errors.expiryDate ? 'text-red-700' : ''
									}`}
								/>
								<input
									{...register('expiryDate', {
										required: true,
										minLength: 4,
										maxLength: 4,
										pattern: /^[0-9]*$/i,
									})}
									className='payment-input'
									placeholder='MMYY'
									type='number'
								/>
							</div>
							<div className='relative w-1/2'>
								<FaHashtag
									className={`payment-icon ${errors.cvv ? 'text-red-700' : ''}`}
								/>
								<input
									{...register('cvv', {
										required: true,
										minLength: 3,
										maxLength: 3,
										pattern: /^[0-9]*$/i,
									})}
									className='payment-input'
									placeholder='###'
									type='number'
								/>
							</div>
						</div>
					</div>

					<div className='mt-7 flex space-x-3'>
						<button className='flex w-1/2 items-center justify-center space-x-5 rounded-xl bg-zinc-50 p-3 text-zinc-800'>
							<FaQrcode className='mr-3 text-xl text-zinc-700' />
							Scan card
						</button>
						<button className='flex w-1/2 items-center justify-center rounded-xl bg-green-500 p-3 text-zinc-50'>
							Add Card
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
