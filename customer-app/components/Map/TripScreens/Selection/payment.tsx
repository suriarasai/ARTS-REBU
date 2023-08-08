import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { GetPaymentMethod } from '@/server'
import { formatCreditCardNumber } from '@/components/payment/formatCreditCardNumber'
import { selectedCardAtom, userAtom } from '@/state'
import { useState, useEffect } from 'react'
import { FaMoneyBill, FaAngleDown, FaCheck, FaCreditCard } from 'react-icons/fa'
import { useRecoilState, useRecoilValue } from 'recoil'

export function PaymentOptions({ handleShowPaymentMethod }) {
	const selectedCard = useRecoilValue(selectedCardAtom)

	return (
		<>
			<FaMoneyBill className='mr-2 text-lg text-green-100' />
			{selectedCard !== 'Cash'
				? '**** ' + selectedCard.toString().substring(12)
				: selectedCard}
			<FaAngleDown
				className='text-lg text-green-100'
				onClick={handleShowPaymentMethod}
			/>
		</>
	)
}

export const SelectPaymentMethod = ({ set }: { set: Function }) => {
	const [cards, setCards] = useState([])
	const [selectedCard, setSelectedCard] = useRecoilState(selectedCardAtom)
	const user = useRecoilValue(userAtom)
	const [tempCard, setTempCard] = useState(selectedCard)

	useEffect(() => {
		if (user) {
			GetPaymentMethod(user.customerID!, (data: any) => {
				setCards(data)
			})
		}
	}, [])

	if (!user) {
		return <LoadingScreen />
	}

	function handleSelectCard() {
		setSelectedCard(tempCard)
		console.log(tempCard)
		set(false)
	}

	return (
		<div className='ml-auto mr-auto mt-5 flex flex-col bg-gray-700'>
			<Card
				cardNumber='Cash'
				set={setTempCard}
				isCard={false}
				selected={tempCard}
			/>
			{cards.map((card: any, index) => (
				<Card
					cardNumber={card.cardNumber}
					key={index}
					set={setTempCard}
					selected={tempCard}
				/>
			))}
			<button
				className='mt-8 w-full rounded-md bg-green-200 py-2'
				onClick={handleSelectCard}
			>
				<h2>Select</h2>
			</button>
		</div>
	)
}

const Card = ({
	cardNumber,
	set,
	selected,
	isCard = true,
}: {
	cardNumber: string
	set: Function
	selected: string
	isCard?: boolean
}) => {
	return (
		<div
			className={`flex items-center rounded-md px-5 py-3 text-zinc-50 ${
				selected === cardNumber
					? 'border-2 border-green-200'
					: 'border-b border-gray-700'
			}`}
			onClick={() => set(cardNumber)}
		>
			{isCard ? (
				<FaCreditCard className='mr-5 text-lg text-green-200' />
			) : (
				<FaMoneyBill className='mr-5 text-lg text-green-200' />
			)}
			{isCard ? formatCreditCardNumber(cardNumber.toString()) : cardNumber}
			<div className='ml-auto text-lg text-green-200'>
				{selected === cardNumber && <FaCheck />}
			</div>
		</div>
	)
}
