import React, { useEffect, useState } from 'react'
import { showOptionInterface } from '@/redux/types'
import {
	FaAngleDown,
	FaAngleUp,
	FaCar,
	FaCarAlt,
	FaClock,
	FaCoins,
	FaCrosshairs,
	FaFlag,
	FaFontAwesomeFlag,
} from 'react-icons/fa'
import {
	cancelBooking,
	completeBooking,
	createBooking,
	matchedBooking,
} from '@/server'
import { moveToStep } from '@/utils/moveTaxiMarker'
import { expandArray } from '@/utils/expandArray'
import { Popup } from '../ui/Popup'

let taxiRouteDisplay

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
	}, [])

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
				dropTime: (data.duration + ETA[1] / 60).toFixed(1),
				pickUpTime: (ETA[1] / 60).toFixed(1),
				icon: <FaCarAlt />,
				desc: 'Find the closest car',
			},
			{
				id: 2,
				taxiType: 'RebuPlus',
				taxiPassengerCapacity: 2,
				fare: (4.1 + data.distance / 400).toFixed(2),
				dropTime: ((data.duration + ETA[2] / 60) * 1.2).toFixed(1),
				pickUpTime: (ETA[2] / 60).toFixed(1),
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
		setRideConfirmed(true)

		createBooking(
			data.user,
			options[clickedOption - 1],
			data.origin,
			data.destination,
			setBookingID
		) // API to create booking
	}

	function handleMatched() {
		matchedBooking(bookingID, 1, 1) // API for matching
		setScreen('confirmed') // TODO: Invocation not immediate; wait for API
		const taxiRoute = taxiRouteDisplay.directions.routes[0].overview_path
		const polyline = expandArray(taxiRoute, 10)
		const stepsPerMinute = Math.round(
			(polyline.length - 1) / (taxiETA[clickedOption] / 60) + 1
		)

		console.log(stepsPerMinute, polyline.length)

		moveToStep(
			data.taxis[clickedOption - 1],
			polyline,
			0,
			50,
			taxiETA,
			setTaxiETA,
			stepsPerMinute,
			clickedOption
		)
	}

	useEffect(() => {
		if (screen !== 'confirmed') return

		// Proximity notification @ 1 min
		if (Math.round(taxiETA[clickedOption] / 60) === 1) {
			console.log('1 minute ETA')
			setNotification(true)
		} else if (Math.round(taxiETA[clickedOption] / 60) === 0) {
			console.log('arriving now')
		}
	}, [taxiETA])

	function handleCancelled(matchedStatus) {
		matchedStatus && cancelBooking(bookingID) // API for trip cancellation
		erasePolyline()

		data.onCancel()
	}

	function handleCompleted() {
		completeBooking(bookingID) // API for trip completion
	}

	function handleChooseAnotherOption() {
		erasePolyline()
		setClickedOption(null)
	}

	return (
		<>
			{!rideConfirmed && (
				<button
					className='cancel-button absolute left-0 top-0 z-10 m-5'
					onClick={() => handleCancelled(false)}
				>
					Cancel
				</button>
			)}
			{notification && <Popup clear={setNotification} />}
			<div className='absolute bottom-0 z-50 w-screen rounded-lg border bg-white pb-2 md:pb-4 lg:w-6/12 lg:pb-4'>
				{AccordionHeader(
					clickedOption,
					setCollapsed,
					collapsed,
					screen,
					taxiETA
				)}

				{collapsed ? null : (
					<div className='accordion-content pb-4 pl-4 pr-4'>
						{!clickedOption ? (
							<div>
								{/* Show available taxis */}
								{options.map((option) => (
									<ShowOption
										option={option}
										key={option.id}
										setClickedOption={setClickedOption}
									/>
								))}
							</div>
						) : screen === '' ? (
							<div>
								{/* Confirm details */}
								<ShowOption
									option={options[clickedOption - 1]}
									key={options[clickedOption - 1].id}
									setClickedOption={setClickedOption}
									disabled={true}
								/>

								{/* Origin and Destination Confirmation */}
								<label className='mt-2'>Route</label>
								{RouteConfirmation(data)}

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
							</div>
						) : screen === 'waiting' ? (
							<div>
								<h5>Please wait..</h5>
								<button
									className='green-button mt-5 w-full'
									onClick={handleMatched}
								>
									Skip
								</button>
							</div>
						) : screen === 'confirmed' ? (
							<div>
								{/* Driver and Vehicle Information */}
								<DriverInformation onCancel={handleCancelled} />

								{/* Trip Information */}
								<TripInformation
									placeName={data.destination.placeName}
									postcode={data.destination.postcode}
									dropTime={options[clickedOption - 1].dropTime}
								/>

								{/* Payment Information */}
								<PaymentInformation fare={options[clickedOption - 1].fare} />
							</div>
						) : (
							<div>Error: Option not found</div>
						)}
					</div>
				)}
			</div>
			{screen === 'waiting' && (
				<div className='absolute left-0 top-0 z-20 h-full w-full backdrop-brightness-50'></div>
			)}
		</>
	)
}

function drawTaxiRoute(
	taxis,
	destination,
	map,
	setRoutes,
	setTaxiETA,
	_callback
) {
	taxiRouteDisplay = new google.maps.DirectionsRenderer({
		polylineOptions: { strokeColor: '#65a30d', strokeWeight: 5 },
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

const DriverInformation = ({ onCancel }) => {
	// "Sno":3,"TaxiNumber":"SHX6464","TaxiType":"Standard","TaxiFeature":{"TaxiMakeModel":"Toyota Prius","TaxiPassengerCapacity":4,"TaxiColor":"Blue"},"TMDTID":"TMA12020","RegisteredDrivers":[{"DriverName":"Fazil","DriverPhone":85152186},{"DriverName":"Chen Lee","DriverPhone":92465573},{"DriverName":"Muthu","DriverPhone":96839679}]}
	return (
		<div className='mt-2 w-full rounded bg-zinc-50 p-3 px-5'>
			<div className='mb-3 flex flex-wrap items-center justify-center'>
				<div className='mr-5 flex h-16 w-16 items-center justify-center rounded-full border border-green-500'>
					DN
				</div>
				<div className='w-2/5'>
					<p className='font-medium'>{'[ Taxi Driver Name ]'}</p>
					<p>{'[ Car Model ]'}</p>
				</div>
				<div className='flex h-10 w-2/5 items-center justify-center rounded border border-green-700 text-xl text-green-700 '>
					{'[ Car Plate ]'}
				</div>
			</div>
			<hr className='mb-2' />
			<button className='w-1/2 p-1 text-red-700' onClick={() => onCancel(true)}>
				<p className='font-normal'>Cancel</p>
			</button>
			<button className='w-1/2 p-1 text-green-700'>
				<p className='font-normal'>Contact</p>
			</button>
		</div>
	)
}

const PaymentInformation = ({ fare }) => {
	return (
		<div className='mt-2 flex w-full flex-wrap items-center rounded bg-zinc-50 p-3 px-5'>
			<div className='flex w-11/12 flex-row items-center'>
				<FaCoins className='mx-5 text-lg text-green-500' />
				<div>
					$<b className='font-normal'>{fare}</b>
					<p className='text-sm'>Cash</p>
				</div>
			</div>
			<div className='float-right'>
				<FaAngleDown className='text-lg text-green-500' />
			</div>
		</div>
	)
}

const TripInformation = (props) => {
	const { placeName, postcode, dropTime } = props
	return (
		<div className='mt-2 w-full rounded bg-zinc-50 p-3 px-5'>
			<b className='text-sm'>Your current trip</b>
			<div className='ml-5 mt-2 flex w-full items-center'>
				<FaFlag className='text-lg text-green-500' />
				<div className='w-4/5 p-2 px-5'>
					{placeName + ', Singapore ' + postcode}
				</div>
				<div className='float-right -ml-3'>
					<p>Change</p>
				</div>
			</div>
			<hr className='my-2' />
			<div className='ml-5 flex items-center'>
				<FaClock className='text-lg text-green-500' />
				<div className='p-2 px-5'>{Math.round(dropTime / 60) + ' min.'}</div>
			</div>
		</div>
	)
}

// helper component to show rides
const ShowOption = ({
	option,
	setClickedOption,
	disabled = false,
}: showOptionInterface) => (
	/*
		option				: the ride option
		setClickedOption	: tracks which ride option was clicked 
	*/
	<div
		className={`ride-option ${disabled ? 'pointer-events-none' : ''}`}
		key={option.id}
		onClick={() => setClickedOption(option.id)}
	>
		<div className='float-left items-center p-2 pr-4 text-2xl text-green-500'>
			{/* @ts-ignore */}
			{option.icon}
		</div>
		<div className='float-left'>
			<b>{option.taxiType}</b>
			<p className='text-sm'>
				{/* @ts-ignore */}
				1-{option.taxiPassengerCapacity} seats ({option.desc})
			</p>
		</div>
		<div className='float-right mr-8'>
			<b className='text-lg'>${option.fare}</b>
			<p className='text-sm'>
				<span className='float-right'>
					{option.pickUpTime}
					{' min.'}
				</span>
			</p>
		</div>
	</div>
)

function RouteConfirmation(data: any) {
	return (
		<table className='mb-5'>
			<tbody className='mb-3 pb-2 pl-2'>
				<tr className='flex items-center'>
					<th className='p-1 text-right'>
						<FaCrosshairs className='text-xl text-green-500' />
					</th>
					<th className='text-left'>
						<p className='p-2 text-sm'>
							<b>{data.origin.placeName}</b>, Singapore {data.origin.postcode}
						</p>
					</th>
				</tr>
				<tr className='flex items-center'>
					<th className='p-1 text-right'>
						<FaFontAwesomeFlag className='text-xl text-green-500' />
					</th>
					<th className='text-left'>
						<p className='p-2 text-sm'>
							<b>{data.destination.placeName}</b>, Singapore{' '}
							{data.destination.postcode}
						</p>
					</th>
				</tr>
			</tbody>
		</table>
	)
}

// Dynamic header text in bottom screen
function AccordionHeader(
	clickedOption: number,
	setCollapsed: React.Dispatch<React.SetStateAction<boolean>>,
	collapsed: boolean,
	screen: string,
	taxiETA
) {
	return (
		<div className='accordion-header flex flex-wrap pl-4 pt-4'>
			<label className={clickedOption ? 'w-11/12' : 'w-9/12'}>
				{!clickedOption ? (
					'Suggested Rides'
				) : screen === '' ? (
					'Confirm Details'
				) : screen === 'waiting' ? (
					'Confirming your Ride'
				) : screen === 'confirmed' ? (
					<>
						En Route
						<div className='float-right pr-4'>
							{Math.round(taxiETA[clickedOption] / 60)} min.
						</div>
					</>
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
