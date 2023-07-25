/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import {
	FaAngleLeft,
	FaAngleUp,
	FaCar,
	FaCarAlt,
	FaFileAlt,
	FaThumbsUp,
} from 'react-icons/fa'
import {
	GetPaymentMethod,
	cancelBooking,
	completeBooking,
	createBooking,
	matchedBooking,
	produceKafkaBookingEvent,
	setPaymentMethod,
	taxiArrived,
} from '@/server'
import { moveToStep } from '@/utils/moveTaxiMarker'
import { expandArray } from '@/utils/expandArray'
import { Popup } from '../ui/Popup'
import {
	DriverInformation,
	TripInformation,
	PaymentInformation,
} from './UI/PostMatchingUI'
import { CompleteTripUI } from './UI/CompleteTripUI'
import { LiveTripUI } from './UI/LiveTripUI'
import { WaitingUI } from './UI/MatchingUI'
import { RouteConfirmation } from './UI/ConfirmationUI'
import { ShowOption } from './UI/ConfirmationUI'
import setMarkerVisibility from '@/utils/setMarkerVisibility'
import Receipt from './UI/Receipt'
import Rating from './Rating'
import SelectPaymentMethod from '../payment/SelectPaymentMethod'
import {
	bookingAtom,
	bookingEvent,
	clickedOptionAtom,
	screenAtom,
	selectedCardAtom,
	taxiETAAtom,
	userAtom,
} from '@/utils/state'
import { useRecoilState, useRecoilValue } from 'recoil'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import computeFare from '@/utils/computeFare'

export let taxiRouteDisplay: any
let matchedTaxi: any

// Shows options of rides to choose from
export const RideConfirmation = (data: any) => {
	const [options, setOptions] = useState<Array<any>>([])
	const [clickedOption, setClickedOption] = useRecoilState<number | any>(
		clickedOptionAtom
	)
	const [collapsed, setCollapsed] = useState<boolean>(false)
	const [screen, setScreen] = useRecoilState(screenAtom)
	const [booking, setBooking] = useRecoilState<bookingEvent | any>(bookingAtom)
	const [rideConfirmed, setRideConfirmed] = useState(false)
	const [routes, setRoutes] = useState<any>({ 1: null, 2: null })
	const [taxiETA, setTaxiETA] = useRecoilState(taxiETAAtom)
	const [notification, setNotification] = useState<string | null>(null)
	const [stopStream, setStopStream] = useState<boolean>(true)
	const [selectedCard, setSelectedCard] = useRecoilState(selectedCardAtom)
	const [selectPaymentMethod, setSelectPaymentMethod] = useState(false)
	const [user, setUser] = useRecoilState(userAtom)

	const collapseMenu = () => setCollapsed(!collapsed)

	// Render routes from taxis to pickup location
	useEffect(() => {
		drawTaxiRoute(
			data.taxis,
			data.origin,
			data.map,
			setRoutes,
			setTaxiETA,
			initializeOptions
		)
	}, [data.taxis])

	// Identify default payment method
	useEffect(() => {
		GetPaymentMethod(
			user.customerID!,
			(data: any) =>
				data?.length > 0 &&
				data.map((item: any) => {
					item.defaultPaymentMethod && setSelectedCard(item.cardNumber)
				})
		)
	}, [])

	// Websocket: Listening for dispatch event
	useEffect(() => {
		if (stopStream) return

		const socket = new SockJS('http://localhost:8080/ws')
		const client = Stomp.over(socket)

		client.connect({}, () => {
			client.subscribe(
				'/user/' + user.customerID + '/queue/dispatchEvent',
				(message) => {
					const res = JSON.parse(message.body)
					setBooking({
						...booking,
						tmdtid: res.tmdtid,
						taxiNumber: res.taxiNumber,
						taxiMakeModel: res.taxiMakeModel,
						taxiColor: res.taxiColor,
						driverID: res.driverID,
						driverName: res.driverName,
						driverPhoneNumber: res.driverPhoneNumber,
						rating: res.rating,
						sno: res.sno,
					})
					handleMatched(res)
				}
			)
		})

		return () => {
			client.disconnect(() => console.log('Disconnected from server'))
		}
	}, [stopStream])

	// Generating ride options
	function initializeOptions(ETA: any) {
		if (!ETA[2]) return

		setOptions([
			{
				id: 1,
				taxiType: 'Rebu Regular',
				taxiPassengerCapacity: 4,
				fare: computeFare(
					'regular',
					data.destination.postcode.toString(),
					data.distance,
					+new Date()
				),
				dropTime: null,
				pickUpTime: null,
				taxiETA: Math.round(ETA[1] / 60),
				tripDuration: null,
				distance: data.distance,
				icon: <FaCarAlt />,
				desc: 'Find the closest car',
			},
			{
				id: 2,
				taxiType: 'RebuPlus',
				taxiPassengerCapacity: 2,
				fare: computeFare(
					'plus',
					data.destination.postcode.toString(),
					data.distance,
					+new Date()
				),
				dropTime: null,
				pickUpTime: null,
				taxiETA: Math.round(ETA[2] / 60),
				tripDuration: null,
				distance: data.distance,
				icon: <FaCar />,
				desc: 'Better cars',
			},
		])
	}

	// Render a particular route upon selecting a taxi
	useEffect(() => {
		if (clickedOption) {
			taxiRouteDisplay.setDirections(routes[clickedOption])
		}
	}, [clickedOption])

	// Confirming a taxi selection
	function handleConfirmation(e: any) {
		e.preventDefault()
		setScreen('waiting')
		setRideConfirmed(true)

		createBooking(
			user,
			options[clickedOption - 1],
			data.origin,
			data.destination,
			setStopStream,

			(bookingID: number) => {
				setBooking({
					bookingID: bookingID,
					customerID: user.customerID,
					messageSubmittedTime: +new Date(),
					customerName: user.customerName,
					phoneNumber: user.phoneNumber,
					taxiType: options[clickedOption - 1].taxiType,
					fareType: 'metered',
					fare: options[clickedOption - 1].fare,
					distance: options[clickedOption - 1].distance,
					paymentMethod: 'Cash',
					eta: data.duration,
					pickUpLocation: data.origin.placeName,
					dropLocation: data.destination.placeName,
				})

				produceKafkaBookingEvent(
					JSON.stringify({
						bookingID: bookingID,
						customerID: user.customerID,
						messageSubmittedTime: +new Date(),
						customerName: user.customerName,
						phoneNumber: user.phoneNumber,
						taxiType: options[clickedOption - 1].taxiType,
						fareType: 'metered',
						fare: options[clickedOption - 1].fare,
						distance: options[clickedOption - 1].distance,
						paymentMethod: 'Cash',
						eta: data.duration,
						pickUpLocation: data.origin,
						dropLocation: data.destination,
						status: 'requested',
					})
				)
			}
		)
	}

	useEffect(() => {
		if (!(screen === 'confirmed' || screen === 'liveTrip')) return

		const socket = new SockJS('http://localhost:8080/ws')
		const client = Stomp.over(socket)

		const tempMarker = new google.maps.Marker({
			position: { lat: 1.291862, lng: 103.776291 },
			map: data.map,
			icon: {
				url: 'https://www.svgrepo.com/show/375861/pin2.svg',
				scaledSize: new google.maps.Size(30, 30),
			},
		})

		client.connect({}, () => {
			client.subscribe('/topic/taxiLocatorEvent', (message) => {
				tempMarker.setPosition(new google.maps.LatLng(JSON.parse(message.body).currentPosition))
				console.log(JSON.parse(message.body))
			})
		})

		return () => {
			client.disconnect(() => console.log('Disconnected from server'))
		}
	}, [screen])

	// Upon getting matched with a driver
	function handleMatched(event: any) {
		matchedBooking(booking.bookingID, event.driverID, event.sno) // API for matching

		setScreen('confirmed')
		setStopStream(true)
		const taxiRoute = taxiRouteDisplay.directions.routes[0].overview_path
		const polyline = expandArray(taxiRoute, 10)
		const stepsPerMinute = Math.round(
			(polyline.length - 1) / ((taxiETA as any)[clickedOption] / 60) + 1
		)

		setMarkerVisibility(data.taxis)

		matchedTaxi = new google.maps.Marker({
			position: {
				lat: data.taxis[clickedOption - 1].lat,
				lng: data.taxis[clickedOption - 1].lng,
			},
			map: data.map,
			icon: {
				url: 'https://www.svgrepo.com/show/375911/taxi.svg',
				scaledSize: new google.maps.Size(30, 30),
			},
		})

		moveToStep(
			matchedTaxi,
			polyline as any,
			0,
			50,
			handleTaxiArrived,
			taxiETA,
			setTaxiETA,
			stepsPerMinute,
			clickedOption
		)
	}

	// Upon taxi arrival to pickup location
	function handleTaxiArrived() {
		setBooking((booking: bookingEvent) => ({
			...booking,
			dropTime: new Date(+new Date() + data.duration * 1000)
				.toLocaleTimeString('en-US')
				.replace(/(.*)\D\d+/, '$1'),
			pickUpTime: +new Date(),
			tripDuration: Math.round(data.duration / 60),
		}))

		taxiArrived(booking.bookingID)
		setNotification('arrived')
		setScreen('liveTrip')
		erasePolyline()

		const polyline = expandArray(data.tripPolyline, 10)
		moveToStep(matchedTaxi, polyline as any, 0, 10, handleCompleted)
	}

	// Proximity notifications
	useEffect(() => {
		if (screen !== 'confirmed') return

		// Proximity notification @ 1 min
		if (Math.round((taxiETA as any)[clickedOption] / 60) === 1) {
			setNotification('arrivingSoon')
		} else if (Math.round((taxiETA as any)[clickedOption] / 60) === 0) {
		}
	}, [taxiETA])

	// Selecting a payment method
	useEffect(() => {
		booking.bookingID && setPaymentMethod(booking.bookingID, selectedCard)
	}, [selectedCard])

	// Upon cancelling a trip
	function handleCancelled(matchedStatus: boolean) {
		if (matchedStatus) {
			cancelBooking(booking.bookingID) // API for trip cancellation
			matchedTaxi.setMap(null)
		}
		erasePolyline()
		setStopStream(true)
		setRideConfirmed(false)
		data.onCancel()
	}

	// Upon completing a trip
	function handleCompleted() {
		completeBooking(booking.bookingID) // API for trip completion
		console.log('Trip fini')
		setScreen('completeTrip')
		setNotification(null)
	}

	// Upon user acknowledgement of a completed trip
	function handleCompletedCleanup() {
		erasePolyline()
		matchedTaxi.setMap(null)
		setScreen('')
		data.onCancel()
	}

	// Upon choosing another taxi option
	function handleChooseAnotherOption() {
		erasePolyline()
		setClickedOption(null)
	}

	return (
		<div className='responsive w-full lg:w-1/2'>
			{!rideConfirmed && (
				<button
					className='cancel-button absolute left-0 top-0 z-10 m-5'
					onClick={() => handleCancelled(false)}
				>
					Cancel
				</button>
			)}
			{notification === 'arrivingSoon' && (
				<Popup
					clear={setNotification}
					msg='Your ride is arriving soon - please get ready and enjoy the trip!'
				/>
			)}
			{notification === 'arrived' && (
				<Popup
					clear={setNotification}
					msg='The wait is over! Please make your way to the taxi'
				/>
			)}
			<div className='absolute bottom-0 z-50 w-screen rounded-lg border bg-white md:pb-4 lg:w-6/12 lg:pb-4'>
				{AccordionHeader(
					collapseMenu,
					booking.dropTime,
					setSelectPaymentMethod,
					selectPaymentMethod
				)}

				{collapsed ? null : (
					<div className='accordion-content pb-4 pl-4 pr-4'>
						{!clickedOption ? (
							<>
								{/* Show available taxis */}
								{options.map((option) => (
									<ShowOption option={option} key={option.id} />
								))}
							</>
						) : screen === '' ? (
							<>
								{/* Confirm details */}
								<ShowOption
									option={options[clickedOption - 1]}
									key={options[clickedOption - 1].id}
									disabled={true}
								/>

								{/* Origin and Destination Confirmation */}
								<label className='mt-2'>Route</label>
								<RouteConfirmation data={data} />

								<div className='flex items-center justify-center gap-5'>
									<button
										className='grey-button w-1/4'
										onClick={handleChooseAnotherOption}
									>
										Go Back
									</button>
									<button
										className='green-button w-3/4 text-white'
										onClick={handleConfirmation}
									>
										Confirm
									</button>
								</div>
							</>
						) : screen === 'waiting' ? (
							<WaitingUI />
						) : screen === 'confirmed' ? (
							selectPaymentMethod ? (
								<SelectPaymentMethod set={setSelectPaymentMethod} />
							) : (
								<>
									<DriverInformation onCancel={handleCancelled} />
									<TripInformation
										placeName={data.destination.placeName}
										postcode={data.destination.postcode}
										tripETA={data.duration}
										taxiETA={options[clickedOption - 1].taxiETA * 60}
									/>
									<PaymentInformation
										fare={options[clickedOption - 1].fare}
										set={setSelectPaymentMethod}
									/>
								</>
							)
						) : screen === 'liveTrip' ? (
							selectPaymentMethod ? (
								<SelectPaymentMethod set={setSelectPaymentMethod} />
							) : (
								<LiveTripUI
									data={data}
									option={options[clickedOption - 1]}
									onCancel={handleCancelled}
									set={setSelectPaymentMethod}
								/>
							)
						) : screen === 'completeTrip' ? (
							<>
								<CompleteTripUI
									option={options[clickedOption - 1]}
									tripETA={booking.tripDuration}
									pickUpTime={booking.pickUpTime}
									data={data}
								/>
								<FinishTrip handleCompletedCleanup={handleCompletedCleanup} />
							</>
						) : screen === 'receipt' ? (
							<div className='-mt-5'>
								<Receipt
									bookingID={booking.bookingID}
									setScreen={() => setScreen('completeTrip')}
								/>
							</div>
						) : screen === 'review' ? (
							<>
								<Rating closeModal={() => setScreen('completeTrip')} />
								<FinishTrip handleCompletedCleanup={handleCompletedCleanup} />
							</>
						) : (
							'Error: Option not found'
						)}
					</div>
				)}
			</div>
			{screen === 'waiting' && (
				<div className='absolute left-0 top-0 z-20 h-full w-full backdrop-brightness-50'></div>
			)}
		</div>
	)
}

const FinishTrip = ({
	handleCompletedCleanup,
}: {
	handleCompletedCleanup: any
}) => {
	const [, setScreen] = useRecoilState(screenAtom)
	return (
		<div className='mt-3 flex w-full space-x-3'>
			<button
				className='w-10/12 rounded-full border border-green-500 bg-white p-2 text-green-500'
				onClick={handleCompletedCleanup}
			>
				Back to home
			</button>
			<button
				className='flex h-12 w-12 items-center justify-center rounded-full border bg-green-500 p-2 text-white'
				onClick={() => setScreen('receipt')}
			>
				<FaFileAlt />
			</button>
			<button
				className='flex h-12 w-12 items-center justify-center rounded-full border bg-green-500 p-2 text-white'
				onClick={() => setScreen('review')}
			>
				<FaThumbsUp />
			</button>
		</div>
	)
}

// Dynamic header text in bottom screen
function AccordionHeader(
	collapseMenu: any,
	dropTime: number,
	setSelectPaymentMethod: React.Dispatch<React.SetStateAction<boolean>>,
	selectPaymentMethod: boolean
) {
	const screen = useRecoilValue(screenAtom)
	const taxiETA = useRecoilValue(taxiETAAtom)
	const clickedOption = useRecoilValue(clickedOptionAtom)
	return (
		<div className='accordion-header flex flex-wrap pl-4 pt-4'>
			<label className={clickedOption ? 'w-11/12' : 'w-9/12'}>
				{!clickedOption ? (
					'Suggested Rides'
				) : screen === '' ? (
					'Confirm Details'
				) : screen === 'waiting' ? (
					''
				) : screen === 'confirmed' ? (
					selectPaymentMethod ? (
						<p className='mb-3 mt-5 flex items-center font-medium text-zinc-500'>
							<FaAngleLeft
								className='mx-5 text-2xl'
								onClick={() => setSelectPaymentMethod(false)}
							/>
							Choose a payment
						</p>
					) : (
						<>
							En Route
							<div className='float-right pr-4'>
								{Math.round((taxiETA as any)[clickedOption] / 60)} min.
							</div>
						</>
					)
				) : screen === 'liveTrip' ? (
					selectPaymentMethod ? (
						<p className='mb-3 mt-5 flex items-center font-medium text-zinc-500'>
							<FaAngleLeft
								className='mx-5 text-2xl'
								onClick={() => setSelectPaymentMethod(false)}
							/>
							Choose a payment
						</p>
					) : (
						<>
							Heading to your destination
							<div className='float-right pr-4'>{dropTime} ETA</div>
						</>
					)
				) : screen === 'completeTrip' ? (
					"You've arrived"
				) : screen === 'receipt' ? (
					''
				) : screen === 'review' ? (
					'Trip Review'
				) : (
					''
				)}
			</label>

			{!clickedOption && (
				<label className='bold w-2/12 text-green-500'>View All</label>
			)}

			<div className='flex w-1/12' onClick={collapseMenu}>
				<FaAngleUp />
			</div>
		</div>
	)
}

function erasePolyline() {
	if (taxiRouteDisplay != null) {
		taxiRouteDisplay.set('directions', null)
	}
}

export function drawTaxiRoute(
	taxis: any,
	destination: Location | any,
	map: google.maps.Map,
	setRoutes: React.Dispatch<React.SetStateAction<any>>,
	setTaxiETA: React.Dispatch<React.SetStateAction<any>>,
	_callback: Function
) {
	taxiRouteDisplay = new google.maps.DirectionsRenderer({
		polylineOptions: {
			strokeColor: '#bef264',
			strokeOpacity: 1.0,
			strokeWeight: 3,
		},
		suppressMarkers: true,
	})

	if (taxis.length > 0) {
		const directionsService = new google.maps.DirectionsService()
		let tempObj: any
		let tempETA: any

		for (let i = 0; i < 2; i++) {
			directionsService.route(
				{
					origin: taxis[i].getPosition(),
					destination: destination,
					travelMode: google.maps.TravelMode.DRIVING,
				},
				function (result: any, status) {
					if (status == 'OK') {
						taxiRouteDisplay.setMap(map)
						tempObj = { ...tempObj, [i + 1]: result }
						tempETA = {
							...tempETA,
							[i + 1]: result.routes[0].legs[0].duration.value,
						}
						setRoutes(tempObj)
						setTaxiETA(tempETA)
						_callback(tempETA)
					} else {
						console.log('Error: Taxi directions API failed')
					}
				}
			)
		}
	} else {
		console.log('Error: Taxis not done loading')
	}
}
