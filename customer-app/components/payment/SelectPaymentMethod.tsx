import { GetPaymentMethod } from '@/server'
import { useEffect, useState } from 'react'
import { FaCheck, FaCreditCard, FaMoneyBill } from 'react-icons/fa'
import { LoadingScreen } from '../ui/LoadingScreen'
import { formatCreditCardNumber } from '@/utils/formatCreditCardNumber'
import { selectedCardAtom, userSelector } from '@/utils/state'
import { useRecoilState, useRecoilValue } from 'recoil'

const SelectPaymentMethod = ({ set }: { set: Function }) => {
	const [cards, setCards] = useState([])
	const [selectedCard, setSelectedCard] = useRecoilState(selectedCardAtom)
	const user = useRecoilValue(userSelector)
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
			className={`flex items-center text-zinc-50 rounded-md px-5 py-3 ${
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

export default SelectPaymentMethod
