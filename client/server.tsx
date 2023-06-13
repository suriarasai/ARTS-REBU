import api from '@/api/axiosConfig'
import { User } from './redux/types'

// Settings: Tracking sign out time
export const addSignOutTime = async (_id: string) => {
	await api.post('/api/v1/customers/addSignOutTime', {
		id: _id,
	})
}

// Account Settings: Updates user information
export const UpdateUser = async (data: User, CustomerID) => {
	const response = await api.post('/api/v1/customers/updateUser', {
		CustomerID: CustomerID,
		CustomerName: data.CustomerName,
		ContactTitle: data.ContactTitle,
		MemberCategory: data.MemberCategory,
		Age: data.Age,
		Gender: data.Gender,
		CountryCode: data.CountryCode,
		Email: data.Email,
		Password: data.Password,
		PhoneCountryCode: data.PhoneCountryCode,
		PhoneNumber: data.PhoneNumber,
	})

	return response.data
}

// Registration: Registering a new user by updating their information
export const RegisterUser = async (data: User, CustomerID) => {
	const response = await api.post('/api/v1/customers/updateUser', {
		CustomerID: CustomerID,
		ContactTitle: data.ContactTitle,
		CustomerName: data.CustomerName,
		Age: data.Age,
		Email: data.Email,
		Password: data.Password,
	})
	return response.data
}

// Reward Points: Consuming points and updating the user reward history
export const RewardPointsAPI = async (id: string, newCount: number) => {
	const response = await api.post('/api/v1/customers/updateRewardPoints', {
		id: id,
		newCount: newCount,
	})
	return response.data
}

// Saved Places: Removes a saved location
export const RemovePlaceAPI = async (_id, name) => {
	await api.post('/api/v1/customers/removeFavoriteLocation', {
		id: _id,
		name: name,
	})
}

// Saved Places: Adds a saved location
export const AddPlaceAPI = async (data) => {
	await api.post('/api/v1/customers/addFavoriteLocation', {
		...data,
	})
}

// Saved Places: Sets the home location
export const SetHome = async (coordinates, name, _id) => {
	await api.post('/api/v1/customers/setHome', {
		home: coordinates,
		homeName: name,
		id: _id,
	})
}

// Saved Places: Sets the work location
export const SetWork = async (coordinates, name, _id) => {
	await api.post('/api/v1/customers/setWork', {
		work: coordinates,
		workName: name,
		id: _id,
	})
}
