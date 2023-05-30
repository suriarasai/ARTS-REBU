import api from '@/api/axiosConfig'
import { User } from './redux/types'

// Settings: Tracking sign out time
export const addSignOutTime = async (_id: string) => {
	await api.post('/api/v1/customers/addSignOutTime', {
		id: _id,
	})
}

// Account Settings: Updates user information
export const UpdateUser = async (data: User, _id: string) => {
	const response = await api.post('/api/v1/customers/updateUser', {
		_id: _id,
		firstName: data.firstName,
		lastName: data.lastName,
		prefix: data.prefix,
		birthdate: data.birthdate!.replace(/\//g, '-'),
		email: data.email,
		password: data.password,
		countryCode: data.countryCode,
		mobileNumber: data.countryCode + ' ' + data.mobileNumber,
	})
	return response.data
}

// Registration: Registering a new user by updating their information
export const RegisterUser = async (data: User, _id) => {
    const response = await api.post('/api/v1/customers/updateUser', {
        _id: _id,
        firstName: data.firstName,
        lastName: data.lastName,
        prefix: data.prefix,
        birthdate: data.birthdate!.replace(/\//g, '-'),
        email: data.email,
        password: data.password,
    })
    return response.data
}

// Reward Points: Consuming points and updating the user reward history
export const RewardPointsAPI = async (id: string, newCount: number) => {
    const response = await api.post(
        '/api/v1/customers/updateRewardPoints',
        {
            id: id,
            newCount: newCount,
        }
    )
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
