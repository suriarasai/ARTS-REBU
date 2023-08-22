import { markers } from '@/pages/map'
import { produceKafkaChatEvent, produceKafkaTaxiLocatorEvent } from '@/server'
import { dispatchAtom } from '@/state'
import { DispatchEvent } from '@/types'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

let taxiMovementTimer: any

export default function MockDriver() {
	const dispatch = useRecoilValue(dispatchAtom)

	useEffect(() => {
		if (!dispatch) return

		const taxiPos = markers.nearbyTaxis[0].getPosition()

		drawLine(
			{ lat: taxiPos.lat(), lng: taxiPos.lng() },
			dispatch.pickUpLocation,
			(line) => MoveTaxiMarker(line, 0, dispatch, handleArrivalToUser)
		)

		const socket = new SockJS('http://localhost:8080/ws')
		const client = Stomp.over(socket)
		let res

		client.connect({}, () => {
			client.subscribe(
				'/user/d' + dispatch.driverID + '/queue/chatEvent',
				(message: any) => {
					res = JSON.parse(message.body)
					if (res.type === 'cancelTrip') {
						console.log('User cancelled trip')
						clearTimeout(taxiMovementTimer)
					}
				}
			)
		})

		return () => {
			client.disconnect(() => console.log('Disconnected from server'))
		}
	}, [dispatch])

	const handleArrivalToUser = () => {
		drawLine(dispatch.pickUpLocation, dispatch.dropLocation, (line) =>
			MoveTaxiMarker(line, 0, dispatch, handleArrivalToDestination)
		)
		produceKafkaChatEvent(
			JSON.stringify({
				recipientID: 'c' + dispatch.customerID,
				type: 'arrivedToUser',
			})
		)
	}

	const handleArrivalToDestination = () => {
		produceKafkaChatEvent(
			JSON.stringify({
				recipientID: 'c' + dispatch.customerID,
				type: 'arrivedToDestination',
			})
		)
	}
}

const drawLine = (a, b, _callback) => {
	const directionsService = new google.maps.DirectionsService()
	directionsService.route(
		{
			origin: new google.maps.LatLng(a.lat, a.lng),
			destination: new google.maps.LatLng(b.lat, b.lng),
			travelMode: google.maps.TravelMode.DRIVING,
		},
		function (result, status) {
			if (status == 'OK') _callback(result.routes[0].overview_path)
		}
	)
}

export function MoveTaxiMarker(
	polyline: any,
	iter: number,
	dispatch: DispatchEvent,
	_callback: Function
) {
	if (polyline.length - 1 >= iter) {
		produceKafkaTaxiLocatorEvent(
			JSON.stringify({
				tmdtid: dispatch.tmdtid,
				driverID: dispatch.driverID,
				taxiNumber: dispatch.taxiNumber,
				currentPosition: {
					lat: polyline[iter].lat(),
					lng: polyline[iter].lng(),
				},
				availabilityStatus: false,
			})
		)

		taxiMovementTimer = setTimeout(function () {
			MoveTaxiMarker(polyline, iter + 1, dispatch, _callback)
		}, 250)
	} else {
		// the taxi has 'arrived'
		_callback()
	}
}
