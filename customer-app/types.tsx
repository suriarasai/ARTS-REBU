import { UseFormRegister, FieldValues, FieldErrors } from 'react-hook-form'

// Context provider
export type UserContextType = {
	user: User
	setUser: React.Dispatch<React.SetStateAction<User>>
}

// User data schema
export type User = {
	customerID?: number
	customerName?: string
	memberCategory?: string
	age?: number
	gender?: string
	amountSpent?: number
	address?: Location
	city?: string
	countryCode?: string
	contactTitle?: string
	phoneNumber?: number
	email?: string
	password?: string
	phoneCountryCode?: number
	home?: Location
	work?: Location
	savedLocations?: Array<Location>
	paymentMethods?: Array<PaymentMethod>

	temp?: any
}

export type DispatchEvent = {
	customerID: number
	customerName: string
	customerPhoneNumber: number
	pickUpLocation: Location
	dropLocation: Location
	status: string
	tmdtid: number
	taxiNumber: string
	taxiPassengerCapacity: number
	taxiMakeModel: string
	taxiColor: string
	driverID: number
	driverName: string
	driverPhoneNumber: number
	sno: number
	rating: number
}

interface PaymentMethod {
	cardHolder: string
	cardNumber: number
	expiryDate: number
	cvv: number
	defaultPaymentMethod: boolean
}

export interface Location {
	placeID?: string
	lat: number
	lng: number
	postcode?: string
	address?: string
	placeName?: string
}

export interface Rating {
	customerID: number
	driverID: number
	messageReceivedTime?: number
	rating: number | null
	reviewBody: string | null
	areasOfImprovement: string
}

export interface areasOfImprovement {
	cleanliness: boolean
	politeness: boolean
	punctuality: boolean
	bookingProcess: boolean
	waitTime: boolean
}

export interface SavedLocation {
	work?: Array<number>
	workName?: string
	home?: Array<number>
	homeName?: string
}
export interface FavoriteLocation {
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
	arrival: string
	taxiETA: number
	taxiType: string
	dropTime: number
	pickUpTime: number
	icon: any
	taxiPassengerCapacity: number
	fare: number
	distance?: number
	duration?: number
}

export interface showOptionInterface {
	option: option
	setClickedOption: React.Dispatch<React.SetStateAction<number | null>>
	disabled?: boolean
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
	setToAddress: React.Dispatch<React.SetStateAction<string>>
	setSearchBoxSuggestions: React.Dispatch<React.SetStateAction<any>>
	toAddress: string
}

export interface SearchLocationInterface {
	type: string
	setSearchQueryVisible: React.Dispatch<React.SetStateAction<boolean>>
	setToLocation: React.Dispatch<React.SetStateAction<boolean>>
	setFromLocation: React.Dispatch<React.SetStateAction<boolean>>
	setToAddress: React.Dispatch<React.SetStateAction<string>>
	searchBoxSuggestions: any
	callback: Function
	searchBoxInput: string
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
	date: string
	points: number
	totalPoints: number
}
export interface navButtonProps {
	label: string
	href: string
	icon: any
	className?: string
}

export interface PlacesAutocompleteServiceSuggestion {
	id: string
	label: string
}

// 1. On page load >>> pickUpLocation, customerID, customerName, phoneNumber
// 2. On location input >>> pickUpLocation, dropLocation
// 3. On taxi selection >>> taxiPassengerCapacity, taxiType, fareType, fare, eta, distance, paymentMethod, bookingID, status
// 4. On dispatch >>> tmdtid, taxiNumber, taxiMakeModel, driverID, driverName, driverPhoneNumber, status
// 5. On pickup >>> pickUpTime
// 6. On arrival >>> dropTime, status
export interface bookingEvent {
	// From bookingEvent
	customerID?: number
	messageSubmittedTime?: string | number
	messageReceivedTime?: string | number
	customerName?: string
	phoneNumber?: number
	pickUpLocation?: {
		placeID: string
		lat: number
		lng: number
		postcode: string
		address: string
		placeName: string
	}
	taxiPassengerCapacity?: number
	pickUpTime?: number
	dropLocation?: {
		placeID: string
		lat: number
		lng: number
		postcode: string
		address: string
		placeName: string
	}
	taxiType?: string
	fareType?: string
	fare?: number
	eta?: number

	// Appended from dispatch event
	tmdtid?: number
	taxiNumber?: string
	taxiMakeModel?: string
	driverID?: number
	driverName?: string
	driverPhoneNumber?: number

	// Addition fields (dispatch)
	taxiColor?: string
	sno?: number // I think this is the query ID? Or was it tmdtid...

	// Additional fields (not in the current stream data model)
	distance?: number // in meters
	paymentMethod?: string // 'Cash' or [card number]
	status?: string // 'requested', 'dispatched', 'cancelled', 'completed'
	dropTime?: number // in miliseconds from epoch
	bookingID?: number
	rating?: number
}
