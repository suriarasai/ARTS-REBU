import { UseFormRegister, FieldValues, FieldErrors } from 'react-hook-form'

// Context provider
export type UserContextType = {
	user: User
	setUser: React.Dispatch<React.SetStateAction<User>>
}

// User data schema
export type User = {
	id?: number
	firstName?: string
	lastName?: string
	birthdate?: string
	prefix?: string
	countryCode?: number
	email?: string
	password?: string
	mobileNumber?: string
	joinedDate?: string
	rating?: number
	activity?: any
	savedLocations?: SavedLocation
	favoriteLocations?: Array<FavoriteLocation>
	rewardPoints?: number
	rewardHistory?: Array<any>
	reviewsAboutCustomer?: Array<any>
	reviewsFromCustomer?: Array<any>

	temp?: Array<any>
	tripInfo?: any
	addr?: String[]
}

export interface SavedLocation {
	work?: Array<number>
	workName?: string
	home?: Array<number>
	homeName?: string
}
interface FavoriteLocation {
	name: string
	address: string
	coordinates: Array<number>
}

// Booking
export interface optionsInterface {
	map: any
	addr: string
	distance?: number
}

export interface option {
	id: number
	dropoff: string
	type: string
	people: number
	price: number
}

export interface showOptionInterface {
	option: option
	setClickedOption: React.Dispatch<React.SetStateAction<number | null>>
}

export interface SearchFieldInterface {
	fromLocation: boolean
	searchQueryVisible: boolean
	type: string
	map: any
	setToLocation: React.Dispatch<React.SetStateAction<boolean>>
	setSearchQueryVisible: React.Dispatch<React.SetStateAction<boolean>>
	setShowRides: React.Dispatch<React.SetStateAction<boolean>>
	setLocation: Function
	setToAddress: React.Dispatch<React.SetStateAction<String>>
	toAddress: string
}

export interface SearchLocationInterface {
	type: string
	setSearchQueryVisible:React.Dispatch<React.SetStateAction<boolean>>
	setToLocation:React.Dispatch<React.SetStateAction<boolean>>
	setFromLocation:React.Dispatch<React.SetStateAction<boolean>>
	callback: Function
}

// EmailForm
export interface EmailInterface {
	register: UseFormRegister<FieldValues>
	errors: FieldErrors<FieldValues>
	existingUser?: boolean
	signInError?: boolean
}

// General errors: Email, Mobile, AccountInformation
export interface Errors {
	mobileNumber?: string
	firstName?: string
	lastName?: string
	email?: string
	password?: string
	birthdate?: string
}

// AccountInformation
export interface ProfileInterface {
	register: UseFormRegister<FieldValues>
	errors: FieldErrors<FieldValues>
	newUser?: boolean
	populateData?: User
}

// Reward Points
export interface rewardPoints {
	date: String
	points: number
	totalPoints: number
}
