import api from '@/api/axiosConfig'
import { User } from './redux/types'

// Account Settings: Updates user information
export const UpdateUser = async (data: User | any, customerID) => {
	const response = await api.post('/api/v1/Customer/updateUser', {
		customerID: customerID,
		customerName: data.firstName + ' ' + data.lastName,
		contactTitle: data.contactTitle,
		memberCategory: data.memberCategory,
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
		memberCategory: 'NA'
	})
	return response.data
}

// Saved Places: Removes a saved location
export const RemovePlaceAPI = async (customerID, name) => {
	await api.post('/api/v1/Customer/removeFavoriteLocation', {
		customerID: customerID,
		name: name,
	})
}

// Saved Places: Adds a saved location
export const AddPlaceAPI = async (data) => {
	await api.post('/api/v1/Customer/addFavoriteLocation', {
		...data,
	})
}

// Saved Places: Sets the home location
export const SetHome = async (coordinates, name, customerID) => {
	await api.post('/api/v1/Customer/setHome', {
		home: coordinates,
		homeName: name,
		customerID: customerID,
	})
}

// Saved Places: Sets the work location
export const SetWork = async (coordinates, name, customerID) => {
	await api.post('/api/v1/Customer/setWork', {
		work: coordinates,
		workName: name,
		customerID: customerID,
	})
}
