import Page from '@/components/ui/page'
import { useContext, useEffect, useRef, useState } from 'react'
import {
	FaCoins,
	FaCreditCard,
	FaEllipsisV,
	FaPlusCircle,
} from 'react-icons/fa'
import { UserContext } from '@/context/UserContext'
import { GetPaymentMethod, RemovePaymentMethod, SetDefaultPaymentMethod } from '@/server'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { AddCard } from '../components/payment/AddCard'
import { formatCreditCardNumber } from '../utils/formatCreditCardNumber'

const PaymentOptions = ({}) => {
	const [screen, setScreen] = useState<String>('main')
	const { user } = useContext(UserContext)
	const [cards, setCards] = useState([])

	useEffect(() => {
		if (user) {
			GetPaymentMethod(user.customerID, (data) => setCards(data))
		}
	}, [user])

	if (!user) {
		return <LoadingScreen />
	}

	return (
		<Page title='Manage Payment Methods'>
			{screen === 'addPaymentMethod' && (
				<AddCard
					setScreen={setScreen}
					customerID={user.customerID}
					setCards={setCards}
					cards={cards}
				/>
			)}

			<div className='space-y-5'>
				<div className='flex items-center rounded-lg bg-white px-5 py-2 shadow-sm'>
					<FaCoins className='mr-5 text-2xl text-green-500' />
					<div className='flex-1'>
						<h2 className='font-medium'>Cash</h2>
						<h5>Pay after the ride</h5>
					</div>
					{/* <h5 className='ml-auto flex items-center rounded-xl border border-zinc-300 bg-zinc-200 px-3 py-1'>
						Default
					</h5> */}
				</div>

				<div className='flex flex-col space-y-3 rounded-lg bg-white px-3 py-6 shadow-sm'>
					<h2 className='font-medium'>Cards</h2>

					{cards.length > 0
						? cards.map((card, index) => (
								<Card
									card={card}
									setCards={setCards}
									cards={cards}
									key={index}
								/>
						  ))
						: 'No cards found'}
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
	const { user } = useContext(UserContext)
	const { card, setCards, cards } = props
	const [showCardOptions, setShowCardOptions] = useState(false)
	const dropdownRef = useRef(null)

	const toggleOpen = () => setShowCardOptions(!showCardOptions)

	const handleClickOutside = (event) => {
		if (dropdownRef.current && !event.target.closest('.card-options-menu')) {
			setShowCardOptions(false)
		}
	}

	function handleSetDefault() {
		setCards(
			cards.map((item) => {
				if (item.cardNumber === card.cardNumber) {
					return { ...item, defaultPaymentMethod: true }
				} else {
					return { ...item, defaultPaymentMethod: false }
				}
			})
		)
		SetDefaultPaymentMethod(user.customerID, card.cardNumber)
		setShowCardOptions(false)
	}

	function handleEdit() {
		setShowCardOptions(false)
	}

	function handleDelete() {
		const filteredCards = cards.filter(
			(item) => item.cardNumber !== card.cardNumber
		)
		setCards(filteredCards)
		RemovePaymentMethod(user.customerID, card.cardNumber)
		setShowCardOptions(false)
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
			{formatCreditCardNumber(card.cardNumber.toString())}
			<div
				ref={dropdownRef}
				className='!ml-auto mt-1 flex items-center space-x-4 text-lg text-zinc-400'
			>
				{card.defaultPaymentMethod && (
					<h5 className='rounded-xl border border-zinc-300 bg-zinc-200 px-3 py-1'>
						Default
					</h5>
				)}
				<FaEllipsisV onClick={toggleOpen} />
			</div>
			{showCardOptions && (
				<div className='card-options-menu absolute right-0 top-0 z-50 !mr-3 mt-10 rounded-lg border border-zinc-100 bg-white px-3 shadow-sm'>
					<button className='w-full py-3 text-left' onClick={handleSetDefault}>
						Set as default
					</button>
					<hr />
					<button className='w-full py-3 text-left'>Edit</button>
					<hr />
					<button
						className='w-full py-3 text-left text-red-600'
						onClick={handleDelete}
					>
						Delete
					</button>
				</div>
			)}
		</div>
	)
}

export default PaymentOptions
