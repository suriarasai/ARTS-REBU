import api from '@/api/axiosConfig'
import { Location, Rating, User, option } from './types'
import { getAddress } from './components/Map/utils/calculations'
import axios from 'axios'
import { renderDirections } from './components/Map/utils/viewport'

export async function produceKafkaBookingEvent(message: string) {
	api.post('/api/v1/Kafka/bookingEvent', {
		message: message,
	})
}

export async function produceKafkaDispatchEvent(message: string) {
	api.post('/api/v1/Kafka/dispatchEvent', {
		message: message,
	})
}

export async function produceKafkaTaxiLocatorEvent(message: string) {
	api.post('/api/v1/Kafka/taxiLocatorEvent', {
		message: message,
	})
}

// Account Settings: Updates user information
export const UpdateUser = async (data: User | any, customerID: number) => {
	const response = await api.post('/api/v1/Customer/updateUser', {
		customerID: customerID,
		customerName: data.customerName,
		contactTitle: data.contactTitle,
		memberCategory: 'NA',
		age: data.age,
		gender: data.gender,
		countryCode: data.countryCode,
		email: data.email,
		password: data.password,
		phoneCountryCode: data.phoneCountryCode,
		phoneNumber: data.phoneNumber,
	})

	return response.data
}

// Registration: Registering a new user by updating their information
export const RegisterUser = async (data: User | any, customerID: number) => {
	const prefixByGender: any = {
		'Mr.': 'M',
		'Ms.': 'F',
		'Mrs.': 'F',
		Other: 'NA',
	}
	const response = await api.post('/api/v1/Customer/updateUser', {
		customerID: customerID,
		contactTitle: data.contactTitle,
		customerName: data.customerName,
		age: data.age,
		gender: prefixByGender[data.contactTitle],
		email: data.email,
		password: data.password,
		memberCategory: 'NA',
	})
	return response.data
}

// Saved Places: Removes a saved location
export const RemovePlaceAPI = async (customerID: number, placeID: string) => {
	await api.post('/api/v1/Customer/removeSavedLocation', {
		customerID: customerID,
		placeID: placeID,
	})
}

// Saved Places: Adds a saved location
export const AddPlaceAPI = async (customerID: number, location: Location) => {
	await api.post('/api/v1/Customer/addSavedLocation', {
		customerID: customerID,
		location: location,
	})
}

export const getUser = async (customerID: number) => {
	await api.get('/api/v1/Customer/' + customerID)
}

// Payment Methods: Remove a payment method
export const RemovePaymentMethod = async (
	customerID: number,
	cardNumber: string
) => {
	await api.post('/api/v1/Customer/removePaymentMethod', {
		customerID: customerID,
		cardNumber: cardNumber,
	})
}

// Payment Methods: Add a payment method
export const AddPaymentMethod = async (
	customerID: number,
	paymentMethodDetails: any
) => {
	await api.post('/api/v1/Customer/addPaymentMethod', {
		customerID: customerID,
		paymentMethod: paymentMethodDetails,
	})
}

// Payment Methods: Sets default payment method
export const SetDefaultPaymentMethod = async (
	customerID: number,
	cardNumber: string
) => {
	await api.post('/api/v1/Customer/setDefaultPaymentMethod', {
		customerID: customerID,
		cardNumber: cardNumber,
	})
}

// Payment Methods: Get all the user's payment methods
export const GetPaymentMethod = async (
	customerID: number,
	_callback: Function
) => {
	const response = await api.post('/api/v1/Customer/getPaymentMethods', {
		customerID: customerID,
	})
	_callback(response.data)
}

export const setPaymentMethod = async (
	bookingID: number,
	cardNumber: string
) => {
	await api.post('/api/v1/Booking/setPaymentMethod', {
		bookingID: bookingID,
		paymentMethod: cardNumber.toString(),
	})
}

// Saved Places: Sets the home location
export const SetHome = async (customerID: number, location: Location) => {
	await api.post('/api/v1/Customer/setHome', {
		customerID: customerID,
		location: location,
	})
}

// Saved Places: Sets the home location
export const addRating = async (data: Rating) => {
	await api.post('/api/v1/Review/createReview', {
		customerID: data.customerID,
		driverID: data.driverID,
		messageReceivedTime: +new Date(),
		rating: data.rating,
		reviewBody: data.reviewBody,
		areasOfImprovement: data.areasOfImprovement,
	})
}

// Saved Places: Sets the work location
export const SetWork = async (customerID: number, location: Location) => {
	await api.post('/api/v1/Customer/setWork', {
		customerID: customerID,
		location: location,
	})
}

// Retrieves all bookings associated with a customerID
export const getBookingsByCustomerID = async (
	customerID: number,
	setTripList: Function
) => {
	const response = await api.get('/api/v1/Booking/customer/' + customerID)
	setTripList(response.data)
}

// Retrieves all bookings associated with a bookingID
export const getBooking = async (
	bookingID: number,
	setBookingInformation: Function
) => {
	const response = await api.get('/api/v1/Booking/' + bookingID)
	setBookingInformation(response.data)
}

// Retrieves taxi information based on the ID (sno)
export const getTaxi = async (sno: number, setTaxiInformation: Function) => {
	const response = await api.get('/api/v1/Taxi/' + sno)
	setTaxiInformation(response.data)
}

// Creates a new booking with the 'requested' status
export const createBooking = async (data, _callback: Function) => {
	const response = await api.post('/api/v1/Booking/createBooking', data)
	_callback(response.data.bookingID)
	return response.data
}

export const matchedBooking = async (
	bookingID: number,
	driverID: number,
	sno: number
) => {
	const response = await api.post('/api/v1/Booking/matchedBooking', {
		bookingID: bookingID,
		driverID: driverID,
		sno: sno,
	})
	return response
}

export const taxiArrived = async (bookingID: number) => {
	const response = await api.post('/api/v1/Booking/taxiArrived', {
		bookingID: bookingID,
		pickUpTime: +new Date(),
	})
	return response
}

export const cancelBooking = async (bookingID: number) => {
	const response = await api.post('/api/v1/Booking/cancelBooking', {
		bookingID: bookingID,
	})
	return response
}

export const completeBooking = async (bookingID: number) => {
	const response = await api.post('/api/v1/Booking/completeBooking', {
		bookingID: bookingID,
		dropTime: +new Date(),
	})
	return response
}

export function CoordinateToAddress(
	coordinates: google.maps.LatLng,
	setLocation: Function,
	setText?: Function
) {
	fetch(
		`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.lat()},${coordinates.lng()}&key=${
			process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
		}`
	)
		.then((response) => response.json())
		.then((data) => {
			const extractedAddress = getAddress(data.results[0], true)
			setLocation(extractedAddress)
			setText && setText(extractedAddress.placeName)
		})
		.catch((e) => console.error('Reverse geocoding failed', e))
}

// Loads the nearest N taxis onto the map
// TODO: Return list of objects with sno, driverID values
export const loadTaxis = (
	map: google.maps.Map,
	coord: number[],
	N = 1,
	setTaxis: Function
) => {
	fetch('https://api.data.gov.sg/v1/transport/taxi-availability')
		.then(function (response) {
			return response.json()
		})
		.then(function (data) {
			const coordinates = data.features[0].geometry.coordinates

			const distances: Array<{
				distance: number
				lng: number
				lat: number
				index: number
			}> = []

			// Calculating the Euclidean distance
			coordinates.forEach(([a, b]: number[], index: number) =>
				distances.push({
					distance: Math.pow(a - coord[0], 2) + Math.pow(b - coord[1], 2),
					lng: a,
					lat: b,
					index: index + 1,
				})
			)

			// Sorting the distances in ascending order
			distances.sort((a, b) => a.distance - b.distance)

			let newTaxi
			let nearbyTaxiMarkers = []

			// Saving the marker to the state variable
			for (let i = 0; i < N; i++) {
				newTaxi = new google.maps.Marker({
					map: map,
					title: distances[i].index.toString(),
					position: { lat: distances[i].lat, lng: distances[i].lng },
					icon: {
						url: 'https://www.svgrepo.com/show/375911/taxi.svg',
						scaledSize: new google.maps.Size(30, 30),
					},
				})
				nearbyTaxiMarkers.push(newTaxi)
			}
			setTaxis(nearbyTaxiMarkers)
		})
}

// (unused) API: Extracts data from Google Maps place_id
async function PlaceIDToAddress(id: string, setLocation: Function) {
	await fetch(
		`https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
	)
		.then(function (response) {
			return response.json()
		})
		.then(function (data) {})
}

export const getDirections = (
	origin: Location,
	destination: Location,
	callback: Function
) => {
	axios
		.post(
			`https://routes.googleapis.com/directions/v2:computeRoutes?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
			{
				origin: {
					location: {
						latLng: {
							latitude: origin.lat,
							longitude: origin.lng,
						},
					},
				},
				destination: {
					location: {
						latLng: {
							latitude: destination.lat,
							longitude: destination.lng,
						},
					},
				},
				travelMode: 'DRIVE',
				routingPreference: 'TRAFFIC_AWARE',
				departureTime: '2023-10-15T15:01:23.045123456Z',
				computeAlternativeRoutes: false,
				extraComputations: ['TRAFFIC_ON_POLYLINE'],
				routeModifiers: {
					avoidTolls: false,
					avoidHighways: false,
					avoidFerries: false,
				},
				languageCode: 'en-US',
				units: 'IMPERIAL',
			},
			{
				headers: {
					'Content-Type': 'application/json',
					'X-Goog-FieldMask':
						'routes.duration,routes.distanceMeters,routes.polyline,routes.legs.polyline,routes.travelAdvisory,routes.legs.travelAdvisory',
				},
			}
		)
		.then((response) => {
			callback(response.data.routes[0])
		})
}
