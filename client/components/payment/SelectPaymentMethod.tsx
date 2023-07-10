import { UserContext } from '@/context/UserContext'
import { GetPaymentMethod } from '@/server'
import { useContext, useEffect, useState } from 'react'
import { FaCheck, FaCreditCard, FaMoneyBill } from 'react-icons/fa'
import { LoadingScreen } from '../ui/LoadingScreen'
import { formatCreditCardNumber } from '@/utils/formatCreditCardNumber'

const SelectPaymentMethod = ({ selectedCard, setSelectedCard, set }) => {
	const [cards, setCards] = useState([])
	const { user } = useContext(UserContext)
	const [tempCard, setTempCard] = useState(selectedCard)

	useEffect(() => {
		if (user) {
			GetPaymentMethod(user.customerID, (data) => {
				setCards(data)
				data.map(
					(item) =>
						item.defaultPaymentMethod && setSelectedCard(item.cardNumber)
				)
			})
		}
	}, [user])

	if (!user) {
		return <LoadingScreen />
	}

	function handleSelectCard() {
		setSelectedCard(tempCard)
		set(false)
	}

	return (
		<div className='ml-auto mr-auto mt-5 flex flex-col bg-white'>
			{/* <p className='mb-3 mt-5 flex items-center font-medium text-zinc-500'>
				<FaAngleLeft className='mx-5 text-2xl' onClick={_callback} />
				Choose a payment
			</p> */}
			<Card
				cardNumber='Cash'
				set={setTempCard}
				isCard={false}
				selected={tempCard}
			/>
			{cards.map((card, index) => (
				<Card
					cardNumber={card.cardNumber}
					key={index}
					set={setTempCard}
					selected={tempCard}
				/>
			))}
			<button className='mt-8 w-full rounded-md bg-green-300 py-3' onClick={handleSelectCard}>
				<h2>Select</h2>
			</button>
		</div>
	)
}

const Card = ({ cardNumber, set, selected, isCard = true }) => {
	return (
		<div
			className={`flex items-center px-5 py-3 ${
				selected === cardNumber
					? 'border-2 border-green-500'
					: 'border-b border-zinc-200'
			}`}
			onClick={() => set(cardNumber)}
		>
			{isCard ? (
				<FaCreditCard className='mr-5 text-lg text-green-600' />
			) : (
				<FaMoneyBill className='mr-5 text-lg text-green-600' />
			)}
			{isCard ? formatCreditCardNumber(cardNumber.toString()) : cardNumber}
			<div className='ml-auto text-lg text-green-600'>
				{selected === cardNumber && <FaCheck />}
			</div>
		</div>
	)
}

export default SelectPaymentMethod
