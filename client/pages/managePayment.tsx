import Page from '@/components/ui/page'
import { useContext, useEffect, useRef, useState } from 'react'
import {
	FaAngleLeft,
	FaCalendar,
	FaCoins,
	FaCreditCard,
	FaCross,
	FaEllipsisV,
	FaHashtag,
	FaPlusCircle,
	FaQrcode,
	FaTimes,
	FaUser,
} from 'react-icons/fa'
import WalletIcon from '@/public/images/walletIcon.png'
import Image from 'next/image'
import { UserContext } from '@/context/UserContext'
import { useForm } from 'react-hook-form'
import { AddPaymentMethod } from '@/server'

const PaymentOptions = ({}) => {
	const [screen, setScreen] = useState<String>('main')
	const { user } = useContext(UserContext)

	return (
		<Page title='Manage Payment Methods'>
			{screen === 'addPaymentMethod' && (
				<AddCard setScreen={setScreen} customerID={user.customerID} />
			)}

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

					<Card cardNumber={'**** **** **** 5697'} />
					<Card cardNumber={'**** **** **** 5697'} />
					<Card cardNumber={'**** **** **** 5697'} />
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

const Card = (props) => {
	const { cardNumber } = props
	const [showCardOptions, setShowCardOptions] = useState(false)
	const dropdownRef = useRef(null)

	const toggleOpen = () => setShowCardOptions(!showCardOptions)

	const handleClickOutside = (event) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			setShowCardOptions(false)
		}
	}

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	return (
		<div className='payment-card relative'>
			<FaCreditCard className='mr-5 text-2xl text-green-500' />
			{cardNumber}
			<div ref={dropdownRef} className='!ml-auto mt-1 text-lg text-zinc-400'>
				<FaEllipsisV onClick={toggleOpen} />
			</div>
            {
                showCardOptions && <div className='absolute right-0 top-0 bg-white p-3 rounded-lg'>Text goes here</div>
            }
		</div>
	)
}

const AddCard = ({ customerID, setScreen }) => {
	const {
		register: register,
		handleSubmit: handleSubmit,
		formState: { errors: errors },
	} = useForm()
	const onSubmit = handleSubmit((data) => {
		AddPaymentMethod(customerID, data)
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

export default PaymentOptions
