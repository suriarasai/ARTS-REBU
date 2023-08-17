/* eslint-disable react-hooks/exhaustive-deps */
import { SelectPaymentMethod } from './payment'
import { TaxiSelectionUI } from './options'
import {
	GetPaymentMethod,
	computeNearbyTaxis,
	createBooking,
	getTaxi,
	produceKafkaBookingEvent,
} from '@/server'
import { User } from '@/types'
import computeFare from '../../utils/calculations'
import {
	bookingAtom,
	destinationAtom,
	originAtom,
	screenAtom,
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
import { markers } from '@/pages/map'

export function TaxiSelection({ map }) {
	const user = useRecoilValue<User>(userAtom)
	const origin = useRecoilValue(originAtom)
	const dest = useRecoilValue(destinationAtom)
	const userLocation = useRecoilValue(userLocationAtom)
	const [booking, setBooking] = useRecoilState(bookingAtom)
	const [taxiETA, setTaxiETA] = useRecoilState(taxiETAAtom)

	const [selectedTaxi, setSelectedTaxi] = useState<string>('regular')
	const [selectedCard, setSelectedCard] = useRecoilState(selectedCardAtom)
	const [selectPaymentMethod, setSelectPaymentMethod] = useState(false)
	const handleShowPaymentMethod = () => setSelectPaymentMethod(true)
	const handleChangeSelection = () =>
		setSelectedTaxi(selectedTaxi === 'regular' ? 'plus' : 'regular')
	const tripStats = useRecoilValue(tripStatsAtom)
	const [options, setOptions] = useState(null)
	const [, setScreen] = useRecoilState(screenAtom)

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

		computeNearbyTaxis(origin.address ? origin : userLocation, (res) => {
			const computeETA = (distance, count) => {
				if (count === 0) return 0
				return Math.sqrt(distance / count) * 111139 * 0.3
			}

			processTaxis(res, (data) => {
				setTaxiETA({
					regular: computeETA(data.regDistance, data.regCount),
					plus: computeETA(data.plusDistance, data.plusCount),
				})
			})
		})
	}, [])

	const processTaxis = (res, _callback) => {
		let newTaxi
		let nearbyTaxiMarkers = []
		let regularTaxiDistance = 0
		let regularTaxiCount = 0
		let plusTaxiDistance = 0
		let plusTaxiCount = 0

		// Saving the marker to the state variable
		for (let i = 0; i < res.length; i++) {
			newTaxi = new google.maps.Marker({
				map: map,
				title: res[i].driverID.toString(),
				position: new google.maps.LatLng(res[i].lat, res[i].lng),
				icon: {
					url: 'https://www.svgrepo.com/show/375911/taxi.svg',
					scaledSize: new google.maps.Size(30, 30),
				},
			})

			getTaxi(res[i].driverID, (taxi) => {
				if (taxi === '') {
					console.log('Taxi not found')
				} else {
					if (taxi.taxiType === 'Plus') {
						plusTaxiDistance += res[i].distance
						plusTaxiCount++
					} else if (taxi.taxiType === 'Regular') {
						regularTaxiDistance += res[i].distance
						regularTaxiCount++
					}
					if (i === res.length - 1) {
						if (regularTaxiCount === 0) console.log('No regular taxis')
						if (plusTaxiCount === 0) console.log('No plus taxis')
						_callback({
							regDistance: regularTaxiDistance,
							regCount: regularTaxiCount,
							plusDistance: plusTaxiDistance,
							plusCount: plusTaxiCount,
						})
					}
				}
			})

			nearbyTaxiMarkers.push(newTaxi)
		}
		markers.nearbyTaxis = nearbyTaxiMarkers
	}

	useEffect(() => {
		if (!tripStats.distance || !taxiETA.regular || !taxiETA.plus) return

		setOptions({
			regular: {
				taxiType: 'regular',
				taxiPassengerCapacity: 4,
				fare: computeFare(
					'regular',
					origin.postcode.toString(),
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
					origin.postcode.toString(),
					dest.postcode.toString(),
					tripStats.distance,
					+new Date()
				),
				taxiETA: Math.round(taxiETA.plus / 60),
				icon: <FaCar />,
				desc: 'Better cars',
			},
		})
	}, [tripStats, taxiETA])

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
			setScreen('match')
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
