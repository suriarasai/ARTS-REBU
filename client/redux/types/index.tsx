import {UseFormRegister, FieldValues } from 'react-hook-form'

// Context provider
export type UserContextType = {
    user: User,
    setUser: React.Dispatch<React.SetStateAction<User>>
}

// User data schema
export type User = {
    id?: number,
    firstName?: string,
    lastName?: string,
    birthdate?: string,
    prefix?: string,
    countryCode?: number,
    email?: string,
    password?: string,
    mobileNumber?: string,
    joinedDate?: string,
    rating?: number,
    activity?: any,
    savedLocations?: Array<any>,
    favoriteLocations?: Array<string>,
    rewardPoints?: number,
    rewardHistory?: Array<any>,
    reviewsAboutCustomer?: Array<any>,
    reviewsFromCustomer?: Array<any>,

    temp?: Array<any>,
    tripInfo?: any,
    addr?: String[]
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
}

// EmailForm
export interface EmailInterface {
	register: UseFormRegister<FieldValues>
	errors: Errors
	existingUser?: boolean
	signInError?: boolean
}

// General errors: Email, Mobile, AccountInformation
export interface Errors {
    mobileNumber: string
    firstName: string
    lastName: string
    email: string
    password: string
    birthdate: string
}

// AccountInformation
export interface ProfileInterface {
    register: UseFormRegister<FieldValues>
    errors: Errors
    newUser?: boolean
    populateData?: User
}