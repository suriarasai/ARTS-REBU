import { SelectPaymentMethod } from './payment'
import { TaxiSelectionUI } from './options'
import {
	GetPaymentMethod,
	createBooking,
	produceKafkaBookingEvent,
} from '@/server'
import { User } from '@/types'
import computeFare from '../../utils/calculations'
import {
	bookingAtom,
	destinationAtom,
	originAtom,
	selectedCardAtom,
	taxiETAAtom,
	tripStatsAtom,
	userAtom,
	userLocationAtom,
} from '@/state'
import { useEffect, useState } from 'react'
import { FaCar, FaCarAlt } from 'react-icons/fa'
import { useRecoilState, useRecoilValue } from 'recoil'
import { PulseLoadingVisual } from '@/components/ui/PulseLoadingVisual'

export function TaxiSelection() {
	const user = useRecoilValue<User>(userAtom)
	const origin = useRecoilValue(originAtom)
	const dest = useRecoilValue(destinationAtom)
	const userLocation = useRecoilValue(userLocationAtom)
	const [, setBooking] = useRecoilState(bookingAtom)
	const [taxiETA, setTaxiETA] = useRecoilState(taxiETAAtom)

	const [selectedTaxi, setSelectedTaxi] = useState<string>('regular')
	const [selectedCard, setSelectedCard] = useRecoilState(selectedCardAtom)
	const [selectPaymentMethod, setSelectPaymentMethod] = useState(false)
	const handleShowPaymentMethod = () => setSelectPaymentMethod(true)
	const handleChangeSelection = () =>
		setSelectedTaxi(selectedTaxi === 'regular' ? 'plus' : 'regular')
	const tripStats = useRecoilValue(tripStatsAtom)
	const [options, setOptions] = useState(null)

	useEffect(() => {
		// Finding the default payment method
		GetPaymentMethod(
			user.customerID!,
			(data: any) =>
				data?.length > 0 &&
				data.map((item: any) => {
					item.defaultPaymentMethod && setSelectedCard(item.cardNumber)
				})
		)
	}, [])

	useEffect(() => {
		if (!tripStats.distance) return

		setOptions({
			regular: {
				taxiType: 'regular',
				taxiPassengerCapacity: 4,
				fare: computeFare(
					'regular',
					dest.postcode.toString(),
					tripStats.distance,
					+new Date()
				),
				taxiETA: Math.round(taxiETA.regular / 60),
				icon: <FaCarAlt />,
				desc: 'Find the closest car',
			},
			plus: {
				taxiType: 'plus',
				taxiPassengerCapacity: 7,
				fare: computeFare(
					'plus',
					dest.postcode.toString(),
					tripStats.distance,
					+new Date()
				),
				taxiETA: Math.round(taxiETA.plus / 60),
				icon: <FaCar />,
				desc: 'Better cars',
			},
		})
	}, [tripStats])

	if (!options || !tripStats.distance) {
		return <PulseLoadingVisual />
	}

	// onSubmit: Create and send the bookingEvent
	const onTripConfirmation = () => {
		const bookingEvent = {
			customerID: user.customerID,
			messageSubmittedTime: +new Date(),
			customerName: user.customerName,
			phoneNumber: user.phoneNumber,
			taxiType: options[selectedTaxi].taxiType,
			fareType: 'metered',
			fare: options[selectedTaxi].fare,
			distance: tripStats.distance,
			paymentMethod: selectedCard,
			eta: tripStats.duration,
			pickUpLocation: origin.address ? origin : userLocation,
			dropLocation: dest,
		}
		createBooking(bookingEvent, (bookingID: number) => {
			const updatedBooking = { ...bookingEvent, bookingID: bookingID }
			setBooking(updatedBooking)
			produceKafkaBookingEvent(JSON.stringify(updatedBooking))
			console.log('bookingID: ', bookingID)
		})
		console.log(bookingEvent)
	}

	return (
		<div className='space-y-2 px-4 py-2'>
			{selectPaymentMethod ? (
				<SelectPaymentMethod set={setSelectPaymentMethod} />
			) : (
				<TaxiSelectionUI
					options={options}
					selectedTaxi={selectedTaxi}
					handleChangeSelection={handleChangeSelection}
					handleShowPaymentMethod={handleShowPaymentMethod}
					onConfirm={onTripConfirmation}
				/>
			)}
		</div>
	)
}
