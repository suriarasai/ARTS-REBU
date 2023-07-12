import { atom, selector } from 'recoil'

export const userAtom = atom({
	key: 'user-atom',
	default: null,
	effects: [
		({ onSet }) => {
			onSet((data) => {
				localStorage.setItem('user', JSON.stringify(data))
				console.log('Updated User Data (state.tsx): ', data)
			})
		},
	],
})

export const userSelector = selector({
	key: 'user-modifier',
	get: ({ get }) => {
		return get(userAtom)
	},
})

export const bookingAtom = atom({
	key: 'booking-atom',
	default: null,
	effects: [
		({ onSet }) => {
			onSet((data) => {
				localStorage.setItem('booking', JSON.stringify(data))
				console.log('Updated Booking Data (state.tsx): ', data)
			})
		},
	],
})

export const bookingSelector = selector({
	key: 'booking-modifier',
	get: ({ get }) => {
		return get(bookingAtom)
	},
})

export const taxiAtom = atom({
	key: 'taxi-atom',
	default: null,
	effects: [
		({ onSet }) => {
			onSet((data) => {
				localStorage.setItem('taxi', JSON.stringify(data))
				console.log('Updated Taxi Data (state.tsx): ', data)
			})
		},
	],
})

export const taxiSelector = selector({
	key: 'taxi-modifier',
	get: ({ get }) => {
		return get(taxiAtom)
	},
})

export const driverAtom = atom({
	key: 'driver-atom',
	default: null,
	effects: [
		({ onSet }) => {
			onSet((data) => {
				localStorage.setItem('driver', JSON.stringify(data))
				console.log('Updated Driver Data (state.tsx): ', data)
			})
		},
	],
})

export const driverSelector = selector({
	key: 'driver-modifier',
	get: ({ get }) => {
		return get(driverAtom)
	},
})

export const screenAtom = atom({
	key: 'screen-atom',
	default: '',
})

export const screenSelector = selector({
	key: 'screen-modifier',
	get: ({ get }) => {
		return get(screenAtom)
	},
})

export const taxiETAAtom = atom({
	key: 'taxiETA-atom',
	default: { 1: null, 2: null },
})

export const taxiETASelector = selector({
	key: 'taxiETA-modifier',
	get: ({ get }) => {
		return get(taxiETAAtom)
	},
})

export const clickedOptionAtom = atom({
	key: 'clickedOption-atom',
	default: null,
})

export const clickedOptionSelector = selector({
	key: 'clickedOption-modifier',
	get: ({ get }) => {
		return get(clickedOptionAtom)
	},
})

export const selectedCardAtom = atom({
	key: 'selectedCard-atom',
	default: 'Cash',
})

export const selectedCardSelector = selector({
	key: 'selectedCard-modifier',
	get: ({ get }) => {
		return get(selectedCardAtom)
	},
})

const temp = {
	customerID: null,
	customerName: null,
	customerPhoneNumber: null, // Renamed to phoneNumber for consistency with bookingEvent
	pickupDate: null, // Excluded - can be computed from pickUpTime (in miliseconds from epoch)
	pickupTime: null,
	pickupLocation: null,
	eta: null,
	tripFare: null, // Renamed to fare for consistency with bookingEvent
	dropLocation: null,
	tmdtid: null,
	taxiNumber: null,
	taxiType: null, // This might need to be moved to the bookingEvent as users typically select this prior to matching
	taxiPassengerCapacity: null, // This might need to be moved to the bookingEvent as users typically select this prior to matching
	taxiMakeModel: null,
	driverID: null,
	driverName: null,
	driverPhoneNumber: null,
}

// 1. On page load >>> pickUpLocation, customerID, customerName, phoneNumber
// 2. On location input >>> pickUpLocation, dropLocation
// 3. On taxi selection >>> taxiPassengerCapacity, taxiType, fareType, fare, eta, distance, paymentMethod, bookingID, status
// 4. On dispatch >>> tmdtid, taxiNumber, taxiMakeModel, driverID, driverName, driverPhoneNumber, status
// 5. On pickup >>> pickUpTime
// 6. On arrival >>> dropTime, status

interface bookingEvent {
	// From bookingEvent
	customerID: number,
	customerName: string,
	phoneNumber: number,
	pickUpLocation: {
		placeID: string,
		lat: number,
		lng: number,
		postcode: string,
		address: string,
		placeName: string,
	},
	taxiPassengerCapacity: number,
	pickUpTime: number,
	dropLocation: {
		placeID: string,
		lat: number,
		lng: number,
		postcode: string,
		address: string,
		placeName: string,
	},
	taxiType: string,
	fareType: string,
	fare: number,
	eta: number,

	// Appended from dispatch event
	tmdtid: number,
	taxiNumber: string,
	taxiMakeModel: string,
	driverID: number,
	driverName: string,
	driverPhoneNumber: number,

	// Additional fields (not in the current stream data model)
	distance: number, // in meters
	paymentMethod: string, // 'Cash' or [card number]
	status: string, // 'requested', 'dispatched', 'cancelled', 'completed'
	dropTime: number, // in miliseconds from epoch
	bookingID: number
}
