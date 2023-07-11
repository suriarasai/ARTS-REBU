import api from '@/api/axiosConfig'
import { User } from './redux/types'
import { getAddress } from './utils/getAddress'
import axios from 'axios'
import { renderDirections } from './utils/renderDirections'

// Account Settings: Updates user information
export const UpdateUser = async (data: User | any, customerID) => {
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
export const RegisterUser = async (data: User | any, customerID) => {
	const prefixByGender = {
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
export const RemovePlaceAPI = async (customerID, placeID) => {
	await api.post('/api/v1/Customer/removeSavedLocation', {
		customerID: customerID,
		placeID: placeID,
	})
}

// Saved Places: Adds a saved location
export const AddPlaceAPI = async (customerID, location) => {
	await api.post('/api/v1/Customer/addSavedLocation', {
		customerID: customerID,
		location: location,
	})
}

export const getUser = async (customerID) => {
	await api.get('/api/v1/Customer/' + customerID)
}

// Payment Methods: Remove a payment method
export const RemovePaymentMethod = async (customerID, cardNumber) => {
	await api.post('/api/v1/Customer/removePaymentMethod', {
		customerID: customerID,
		cardNumber: cardNumber,
	})
}

// Payment Methods: Add a payment method
export const AddPaymentMethod = async (customerID, paymentMethodDetails) => {
	await api.post('/api/v1/Customer/addPaymentMethod', {
		customerID: customerID,
		paymentMethod: paymentMethodDetails,
	})
}

// Payment Methods: Sets default payment method
export const SetDefaultPaymentMethod = async (customerID, cardNumber) => {
	await api.post('/api/v1/Customer/setDefaultPaymentMethod', {
		customerID: customerID,
		cardNumber: cardNumber,
	})
}

// Payment Methods: Get all the user's payment methods
export const GetPaymentMethod = async (customerID, _callback) => {
	const response = await api.post('/api/v1/Customer/getPaymentMethods', {
		customerID: customerID,
	})
	_callback(response.data)
}

export const setPaymentMethod = async (bookingID, cardNumber) => {
	await api.post('/api/v1/Booking/setPaymentMethod', {
		bookingID: bookingID,
		paymentMethod: cardNumber.toString(),
	})
}

// Saved Places: Sets the home location
export const SetHome = async (customerID, location) => {
	await api.post('/api/v1/Customer/setHome', {
		customerID: customerID,
		location: location,
	})
}

// Saved Places: Sets the home location
export const addRating = async (data) => {
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
export const SetWork = async (customerID, location) => {
	await api.post('/api/v1/Customer/setWork', {
		customerID: customerID,
		location: location,
	})
}

// Retrieves all bookings associated with a customerID
export const getBookingsByCustomerID = async (customerID, setTripList) => {
	const response = await api.get('/api/v1/Booking/customer/' + customerID)
	setTripList(response.data)
}

// Retrieves all bookings associated with a bookingID
export const getBooking = async (bookingID, setBookingInformation) => {
	const response = await api.get('/api/v1/Booking/' + bookingID)
	setBookingInformation(response.data)
}

// Retrieves taxi information based on the ID (sno)
export const getTaxi = async (sno, setTaxiInformation) => {
	const response = await api.get('/api/v1/Taxi/' + sno)
	setTaxiInformation(response.data)
}

// Creates a new booking with the 'requested' status
export const createBooking = async (
	user: User,
	option,
	origin,
	destination,
	setBookingID,
	setStopStream,
	_callback
) => {
	const response = await api.post('/api/v1/Booking/createBooking', {
		customerID: user.customerID,
		messageSubmittedTime: +new Date(),
		customerName: user.customerName,
		phoneNumber: user.phoneNumber,
		taxiType: option.taxiType,
		fareType: 'metered',
		fare: option.fare,
		distance: option.distance,
		paymentMethod: 'Cash',
		pickUpLocation: origin,
		dropLocation: destination,
	})

	setBookingID(response.data.bookingID)
	setStopStream(false)
	_callback(response.data.bookingID)
	return response.data
}

export const matchedBooking = async (bookingID, driverID, taxiID) => {
	const response = await api.post('/api/v1/Booking/matchedBooking', {
		bookingID: bookingID,
		driverID: driverID,
		taxiID: taxiID,
	})
	return response
}

export const taxiArrived = async (bookingID) => {
	const response = await api.post('/api/v1/Booking/taxiArrived', {
		bookingID: bookingID,
		pickUpTime: +new Date(),
	})
	return response
}

export const cancelBooking = async (bookingID) => {
	const response = await api.post('/api/v1/Booking/cancelBooking', {
		bookingID: bookingID,
	})
	return response
}

export const completeBooking = async (bookingID) => {
	const response = await api.post('/api/v1/Booking/completeBooking', {
		bookingID: bookingID,
		dropTime: +new Date(),
	})
	return response
}

export async function CoordinateToAddress(coordinates, setLocation) {
	await fetch(
		`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates[0]},${coordinates[1]}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
	)
		.then(function (response) {
			return response.json()
		})
		.then(function (data) {
			try {
				setLocation(getAddress(data.results[0], true))
			} catch (e) {
				// Some state function to run a popup error...
			}
		})
}

// Loads the nearest N taxis onto the map
// TODO: Return list of objects with taxiID, driverID values
export const loadTaxis = (map, coord, N = 1, setTaxis) => {
	fetch('https://api.data.gov.sg/v1/transport/taxi-availability')
		.then(function (response) {
			return response.json()
		})
		.then(function (data) {
			const coordinates = data.features[0].geometry.coordinates
			const distances = []

			// Calculating the Euclidean distance
			coordinates.forEach(([a, b], index) =>
				distances.push({
					distance: Math.pow(a - coord[0], 2) + Math.pow(b - coord[1], 2),
					lng: a,
					lat: b,
					index: index+1,
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
async function PlaceIDToAddress(id, setLocation) {
	await fetch(
		`https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
	)
		.then(function (response) {
			return response.json()
		})
		.then(function (data) {})
}

export const getDirections = (
	map,
	origin,
	destination,
	setRoute,
	setPolyline,
	callback
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
			setRoute(response.data.routes[0])
			renderDirections(map, response.data.routes[0], setPolyline)
			callback()
		})
}
