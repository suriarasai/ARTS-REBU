import api from '@/api/axiosConfig'
import { User } from './redux/types'
import { icon } from './redux/types/constants'
import { getAddress } from './utils/getAddress'

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

// Saved Places: Sets the home location
export const SetHome = async (customerID, location) => {
	await api.post('/api/v1/Customer/setHome', {
		customerID: customerID,
		location: location,
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

// Creates a new booking with the 'requested' status
export const createBooking = async (
	user: User,
	option,
	origin,
	destination,
	setBookingID
) => {
	const response = await api.post('/api/v1/Booking/createBooking', {
		customerID: user.customerID,
		messageSubmittedTime: +new Date(),
		customerName: user.customerName,
		phoneNumber: user.phoneNumber,
		pickUpTime: option.pickUpTime, // TODO: Time
		taxiType: option.taxiType,
		fareType: 'metered',
		fare: option.fare,
		distance: option.distance,
		paymentMethod: 'cash',
		pickUpLocation: origin,
		dropLocation: destination,
	})

	setBookingID(response.data.bookingID)
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

export const cancelBooking = async (bookingID) => {
	const response = await api.post('/api/v1/Booking/cancelBooking', {
		bookingID: bookingID,
	})
	return response
}

export const completeBooking = async (bookingID) => {
	const response = await api.post('/api/v1/Booking/completeBooking', {
		bookingID: bookingID,
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
} // Loads the nearest N taxis onto the map

export const loadTaxis = (map, coord, N = 1, setTaxis) => {
	fetch('https://api.data.gov.sg/v1/transport/taxi-availability')
		.then(function (response) {
			return response.json()
		})
		.then(function (data) {
			const coordinates: [number, number] =
				data.features[0].geometry.coordinates
			const distances: [number, number, number][] = []

			// Calculating the Euclidean distance
			coordinates.forEach(([a, b]: any) =>
				distances.push([
					Math.pow(a - coord[0], 2) + Math.pow(b - coord[1], 2),
					a,
					b,
				])
			)

			// Sorting the distances
			distances.sort()

			let coords
			let newTaxi
			let nearbyTaxiMarkers = []

			// Saving the marker to the state variable
			for (let i = 0; i < N; i++) {
				coords = distances[i].slice(1, 3)
				newTaxi = new google.maps.Marker({
					map: map,
					position: { lat: coords[1], lng: coords[0] },
					icon: {
						path: icon.taxiMarker,
						fillColor: '#d9f99d',
						fillOpacity: 1,
						scale: 0.03,
						strokeColor: '#65a30d',
						strokeWeight: 0.5,
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
