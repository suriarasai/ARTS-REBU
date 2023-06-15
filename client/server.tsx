import api from '@/api/axiosConfig'
import { User } from './redux/types'

// Account Settings: Updates user information
export const UpdateUser = async (data: User | any, customerID) => {
	const response = await api.post('/api/v1/Customer/updateUser', {
		customerID: customerID,
		customerName: data.firstName + ' ' + data.lastName,
		contactTitle: data.contactTitle,
		memberCategory: "NA",
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
	const response = await api.post('/api/v1/Customer/updateUser', {
		customerID: customerID,
		contactTitle: data.contactTitle,
		customerName: data.firstName + ' ' + data.lastName,
		age: data.age,
		gender: data.gender,
		email: data.email,
		password: data.password,
		memberCategory: "NA",
	})
	return response.data
}

// Saved Places: Removes a saved location
export const RemovePlaceAPI = async (customerID, placeID) => {
	console.log('testatapi')
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
export async function CoordinateToAddress(coordinates, setLocation) {
	await fetch(
		`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates[0]},${coordinates[1]}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
	)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			setLocation(data.results[0].formatted_address);
		});
}
