import React, { useEffect, useState } from 'react'
import { FaAngleDown, FaAngleUp, FaCar, FaCarAlt } from 'react-icons/fa'
import {
	cancelBooking,
	completeBooking,
	createBooking,
	matchedBooking,
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
import { doc, onSnapshot } from 'firebase/firestore'
import {
	createBookingRequest,
	setBookingCancelled,
	setBookingCompleted,
} from '@/utils/taxiBookingSystem'
import { db } from '@/utils/firebase'
import setMarkerVisibility from '@/utils/setMarkerVisibility'

export let taxiRouteDisplay
let matchedTaxi
let booking = {
	dropTime: null,
	pickUpTime: null,
	taxiETA: null,
	tripDuration: null,
}

// Shows options of rides to choose from
export const RideConfirmation = (data) => {
	const [options, setOptions] = useState<Array<any>>([])
	const [clickedOption, setClickedOption] = useState<number | null>(null)
	const [collapsed, setCollapsed] = useState<boolean>(false)
	const [screen, setScreen] = useState<string>('')
	const [bookingID, setBookingID] = useState<number>(null)
	const [rideConfirmed, setRideConfirmed] = useState(false)
	const [routes, setRoutes] = useState({ 1: null, 2: null })
	const [taxiETA, setTaxiETA] = useState({ 1: null, 2: null })
	const [notification, setNotification] = useState(null)

	useEffect(() => {
		drawTaxiRoute(
			data.taxis,
			data.origin,
			data.map,
			setRoutes,
			setTaxiETA,
			initializeOptions
		)
		console.log('Trip Duration', data.duration)
	}, [data.taxis])

	const [stopStream, setStopStream] = useState(true)

	// Firestore real-time database listener
	useEffect(() => {
		if (stopStream) {
			return
		}

		const unsubscribe = onSnapshot(
			doc(db, 'BookingEvent', data.user.customerID.toString()),
			(snapshot) => {
				if (snapshot.data().status === 'dispatched') {
					console.log('Matched')
					handleMatched()
				}
				console.log(snapshot.data())
			}
		)

		return () => {
			unsubscribe()
		}
	}, [stopStream])

	function initializeOptions(ETA) {
		// distance in meters
		// duration in seconds
		// TODO: Get routes for each path and render all but highlight clicked
		// TODO: taxiDistance needs to be pre-calculated

		if (!ETA[2]) return

		setOptions([
			{
				id: 1,
				taxiType: 'Rebu Regular',
				taxiPassengerCapacity: 4,
				fare: (3.9 + data.distance / 500).toFixed(2),
				dropTime: null,
				pickUpTime: null,
				taxiETA: Math.round(ETA[1] / 60),
				tripDuration: null,
				icon: <FaCarAlt />,
				desc: 'Find the closest car',
			},
			{
				id: 2,
				taxiType: 'RebuPlus',
				taxiPassengerCapacity: 2,
				fare: (4.1 + data.distance / 400).toFixed(2),
				dropTime: null,
				pickUpTime: null,
				taxiETA: Math.round(ETA[2] / 60),
				tripDuration: null,
				icon: <FaCar />,
				desc: 'Better cars',
			},
		])
	}

	useEffect(() => {
		if (clickedOption) {
			taxiRouteDisplay.setDirections(routes[clickedOption])
		}
	}, [clickedOption])

	function handleConfirmation(e) {
		e.preventDefault()
		setScreen('waiting')
		// setScreen('completeTrip')
		setRideConfirmed(true)

		createBooking(
			data.user,
			options[clickedOption - 1],
			data.origin,
			data.destination,
			setBookingID,
			setStopStream,

			(bookingID) =>
				createBookingRequest({
					...data.user,
					...options[clickedOption - 1],
					pickUpLocation: data.origin.placeName,
					dropLocation: data.destination.placeName,
					fareType: 'metered',
					paymentMethod: 'cash',
					sno: 1,
					driverID: 1,
					bookingID: bookingID,
				})
		) // API to create booking
	}

	function handleMatched() {
		matchedBooking(bookingID, 1, 1) // API for matching
		setScreen('confirmed') // TODO: Invocation not immediate; wait for API
		setStopStream(true)
		const taxiRoute = taxiRouteDisplay.directions.routes[0].overview_path
		const polyline = expandArray(taxiRoute, 10)
		const stepsPerMinute = Math.round(
			(polyline.length - 1) / (taxiETA[clickedOption] / 60) + 1
		)

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

		setMarkerVisibility(data.taxis)

		moveToStep(
			matchedTaxi,
			polyline,
			0,
			50,
			handleTaxiArrived,
			taxiETA,
			setTaxiETA,
			stepsPerMinute,
			clickedOption
		)
	}

	function handleTaxiArrived() {
		console.log('book')
		booking = {
			...options[clickedOption - 1],
			dropTime: new Date(+new Date() + data.duration * 1000)
				.toLocaleTimeString('en-US')
				.replace(/(.*)\D\d+/, '$1'),
			pickUpTime: +new Date(),
			tripDuration: Math.round(data.duration / 60),
		}

		setNotification('arrived')
		setScreen('liveTrip')
		console.log('Taxi has arrived')
		erasePolyline()

		const polyline = expandArray(data.tripPolyline, 10)
		moveToStep(matchedTaxi, polyline, 0, 10, handleCompleted)
	}

	useEffect(() => {
		if (screen !== 'confirmed') return

		// Proximity notification @ 1 min
		if (Math.round(taxiETA[clickedOption] / 60) === 1) {
			console.log('1 minute ETA')
			setNotification('arrivingSoon')
		} else if (Math.round(taxiETA[clickedOption] / 60) === 0) {
			console.log('arriving now')
		}
	}, [taxiETA])

	function handleCancelled(matchedStatus) {
		setBookingCancelled(data.user.customerID.toString())
		if (matchedStatus) {
			cancelBooking(bookingID) // API for trip cancellation
			matchedTaxi.setMap(null)
		}
		erasePolyline()
		setStopStream(true)
		data.onCancel()
	}

	function handleCompleted() {
		setBookingCompleted(data.user.customerID.toString())
		completeBooking(bookingID) // API for trip completion
		console.log('Trip fini')
		setScreen('completeTrip')
		setNotification(null)
	}

	function handleCompletedCleanup() {
		erasePolyline()
		matchedTaxi.setMap(null)
		data.onCancel()
	}

	function handleChooseAnotherOption() {
		erasePolyline()
		setClickedOption(null)
	}

	return (
		<div className='responsive'>
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
			<div className='absolute bottom-0 z-50 w-screen rounded-lg border bg-white pb-2 md:pb-4 lg:w-6/12 lg:pb-4'>
				{AccordionHeader(
					clickedOption,
					setCollapsed,
					collapsed,
					screen,
					taxiETA,
					booking.dropTime
				)}

				{collapsed ? null : (
					<div className='accordion-content pb-4 pl-4 pr-4'>
						{!clickedOption ? (
							<>
								{/* Show available taxis */}
								{options.map((option) => (
									<ShowOption
										option={option}
										key={option.id}
										setClickedOption={setClickedOption}
									/>
								))}
							</>
						) : screen === '' ? (
							<>
								{/* Confirm details */}
								<ShowOption
									option={options[clickedOption - 1]}
									key={options[clickedOption - 1].id}
									setClickedOption={setClickedOption}
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
							<>
								<DriverInformation onCancel={handleCancelled} />
								<TripInformation
									placeName={data.destination.placeName}
									postcode={data.destination.postcode}
									tripETA={data.duration}
									taxiETA={options[clickedOption - 1].taxiETA * 60}
								/>
								<PaymentInformation fare={options[clickedOption - 1].fare} />
							</>
						) : screen === 'liveTrip' ? (
							<LiveTripUI
								data={data}
								options={options}
								clickedOption={clickedOption}
								onCancel={handleCancelled}
							/>
						) : screen === 'completeTrip' ? (
							<CompleteTripUI
								options={options}
								clickedOption={clickedOption}
								tripETA={booking.tripDuration}
								pickUpTime={booking.pickUpTime}
								dropTime={booking.dropTime}
								data={data}
								handleCompletedCleanup={handleCompletedCleanup}
							/>
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

// Dynamic header text in bottom screen
function AccordionHeader(
	clickedOption: number,
	setCollapsed: React.Dispatch<React.SetStateAction<boolean>>,
	collapsed: boolean,
	screen: string,
	taxiETA,
	dropTime
) {
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
					<>
						En Route
						<div className='float-right pr-4'>
							{Math.round(taxiETA[clickedOption] / 60)} min.
						</div>
					</>
				) : screen === 'liveTrip' ? (
					<>
						Heading to your destination
						<div className='float-right pr-4'>{dropTime} ETA</div>
					</>
				) : screen === 'completeTrip' ? (
					"You've arrived"
				) : (
					''
				)}
			</label>

			{!clickedOption && (
				<label className='bold w-2/12 text-green-500'>View All</label>
			)}

			<div className='flex w-1/12' onClick={() => setCollapsed(!collapsed)}>
				{collapsed ? <FaAngleUp /> : <FaAngleDown />}
			</div>
		</div>
	)
}

function erasePolyline() {
	if (taxiRouteDisplay != null) {
		taxiRouteDisplay.set('directions', null)
		// taxiRouteDisplay.setMap(null)
		// taxiRouteDisplay = null
	}
}

export function drawTaxiRoute(
	taxis,
	destination,
	map,
	setRoutes,
	setTaxiETA,
	_callback
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
		let tempObj = { 1: null, 2: null }
		let tempETA = { 1: null, 2: null }

		for (let i = 0; i < 2; i++) {
			directionsService.route(
				{
					origin: taxis[i].getPosition(),
					destination: destination,
					travelMode: google.maps.TravelMode.DRIVING,
				},
				function (result, status) {
					if (status == 'OK') {
						taxiRouteDisplay.setMap(map)
						tempObj[i + 1] = result
						tempETA[i + 1] = result.routes[0].legs[0].duration.value
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
