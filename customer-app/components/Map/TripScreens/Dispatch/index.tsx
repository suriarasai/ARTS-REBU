import Rating from '@/components/Map/TripScreens/Arrival/Rating'
import { mark } from '@/components/Map/utils/markers'
import { MARKERS } from '@/constants'
import { markers } from '@/pages/map'
import { completeBooking, taxiArrived } from '@/server'
import {
	arrivalAtom,
	bookingAtom,
	dispatchAtom,
	etaCounterAtom,
	notificationAtom,
	originAtom,
	screenAtom,
	statusAtom,
	taxiETAAtom,
	userLocationAtom,
} from '@/state'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { expandArray, moveTaxiMarker, taxiMovementTimer } from '../../utils/calculations'
import { DriverInformation, RateTrip, RouteInformation, TripInformation } from './tripInformation'

let taxiRoute

export function Dispatch({ map }) {
	const [, setScreen] = useRecoilState(screenAtom)
	const [taxiETA, setTaxiETA] = useRecoilState(taxiETAAtom)
	const [, setStatus] = useRecoilState(statusAtom)
	const [arrived, setArrived] = useRecoilState(arrivalAtom)
	const [showRatingForm, setShowRatingForm] = useState(false)
	const origin = useRecoilValue(originAtom)
	const userLocation = useRecoilValue(userLocationAtom)
	const [, setNotification] = useRecoilState(notificationAtom)
	const dispatch = useRecoilValue(dispatchAtom)
	const booking = useRecoilValue(bookingAtom)
	const [counter, setCounter] = useState(0)
	const [etaCounter, setETACounter] = useRecoilState(etaCounterAtom)
	const setETA = (newETA) =>
		setTaxiETA({ ...taxiETA, [booking.taxiType]: newETA })

	useEffect(() => {
		setStatus('dispatched')
		const userPos = origin.address ? origin : userLocation
		const socket = new SockJS('http://localhost:8080/ws')
		const client = Stomp.over(socket)
		let pos // taxi position
		let prevPos // previous taxi position
		let res // response from the chat websocket
		let interpolatedArray // expanded array between pos and prevPos for smoother marker movement

		client.connect({}, () => {
			client.subscribe('/topic/taxiLocatorEvent', (message) => {
				pos = JSON.parse(message.body).currentPosition
				!arrived && setCounter((counter) => counter + 1)
				clearTimeout(taxiMovementTimer)

				if (markers.taxi) {
					interpolatedArray = expandArray(pos, prevPos, 10)
					moveTaxiMarker(interpolatedArray, 0)
				} else {
					markers.taxi = mark(map, pos, MARKERS.TAXI, false)
					drawTaxiRoute(map, pos, userPos, (eta) => {
						setETA(eta)
						setETACounter(eta)
					})
				}
				prevPos = pos
			})
			client.subscribe(
				'/user/c' + dispatch.customerID + '/queue/chatEvent',
				(message) => {
					res = JSON.parse(message.body)

					if (res.type === 'arrivedToUser') {
						setArrived(true)
						taxiRoute?.setMap(null)
						taxiRoute = null
						taxiArrived(booking.bookingID)
						console.log('Taxi arrived to User')
					} else if (res.type === 'arrivedToDestination') {
						setStatus('completed')
						completeBooking(booking.bookingID)
						console.log('Taxi arrived to Destination')
						setNotification('arrivedToDestination')
						setScreen('arrival')
					}
				}
			)
		})

		return () => {
			client.disconnect(() => console.log('Disconnected from server'))
			taxiRoute?.setMap(null)
			taxiRoute = null
			setNotification('')
			clearTimeout(taxiMovementTimer)
		}
	}, [])

	useEffect(() => {
		if (taxiRoute && !arrived) {
			setETACounter(
				Math.round(
					taxiETA[booking.taxiType] *
						(1 - counter / taxiRoute.getPath().getLength())
				)
			)
		}
	}, [counter])

	useEffect(() => {
		if (taxiRoute && !arrived) {
			if (etaCounter === 2) {
				setNotification('arrivingSoon')
			} else if (etaCounter === 0) {
				setNotification('arrivedToUser')
			}
		}
	}, [etaCounter])

	return (
		<>
			{showRatingForm ? (
				<Rating closeModal={() => setShowRatingForm(false)} />
			) : (
				<>
					<DriverInformation />
					{arrived && <RateTrip setShowRatingForm={setShowRatingForm} />}
					<RouteInformation />
					<TripInformation />
				</>
			)}
		</>
	)
}

export function drawTaxiRoute(map, origin, dest, setETA) {
	const directionsService = new google.maps.DirectionsService()
	directionsService.route(
		{
			origin: new google.maps.LatLng(origin.lat, origin.lng),
			destination: new google.maps.LatLng(dest.lat, dest.lng),
			travelMode: google.maps.TravelMode.DRIVING,
		},
		function (result, status) {
			if (status == 'OK') {
				taxiRoute = new google.maps.Polyline({
					path: result.routes[0].overview_path,
					strokeColor: '#16a34a',
					strokeOpacity: 1,
					strokeWeight: 4,
				})
				taxiRoute.setMap(map)
				setETA(Math.round(result.routes[0].legs[0].duration.value / 60))
			}
		}
	)
}
