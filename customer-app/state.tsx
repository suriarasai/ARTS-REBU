import { DispatchEvent, User } from '@/types'
import { atom, selector } from 'recoil'
import { bookingEvent } from './types'

export const userAtom = atom({
	key: 'user-atom',
	default: {} as User,
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
	default: {} as bookingEvent,
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

export const dispatchAtom = atom({
	key: 'dispatch-atom',
	default: {} as DispatchEvent,
	effects: [
		({ onSet }) => {
			onSet((data) => {
				localStorage.setItem('dispatch', JSON.stringify(data))
				console.log('Updated Dispatch Data (state.tsx): ', data)
			})
		},
	],
})

export const dispatchSelector = selector({
	key: 'dispatch-modifier',
	get: ({ get }) => {
		return get(dispatchAtom)
	},
})

export const statusAtom = atom({
	key: 'status-atom',
	default: '',
	effects: [
		({ onSet }) => {
			onSet((data) => {
				localStorage.setItem('status', JSON.stringify(data))
				console.log('Updated status data (state.tsx): ', data)
			})
		},
	],
})

export const statusSelector = selector({
	key: 'status-modifier',
	get: ({ get }) => {
		return get(statusAtom)
	},
})

export const notificationAtom = atom({
	key: 'notification-atom',
	default: '',
	effects: [
		({ onSet }) => {
			onSet((data) => {
				localStorage.setItem('notification', JSON.stringify(data))
				console.log('Updated notification data (state.tsx): ', data)
			})
		},
	],
})

export const notificationSelector = selector({
	key: 'notification-modifier',
	get: ({ get }) => {
		return get(notificationAtom)
	},
})

export const taxiLocationAtom = atom({
	key: 'taxiLocation-atom',
	default: '',
	effects: [
		({ onSet }) => {
			onSet((data) => {
				console.log('Updated taxiLocation data (state.tsx): ', data)
			})
		},
	],
})

export const taxiLocationSelector = selector({
	key: 'taxiLocation-modifier',
	get: ({ get }) => {
		return get(taxiLocationAtom)
	},
})

export const destinationAtom = atom({
	key: 'destination-atom',
	default: {
		placeID: null,
		lat: null,
		lng: null,
		postcode: null,
		address: null,
		placeName: null,
	},
	effects: [
		({ onSet }) => {
			onSet((data) => {
				localStorage.setItem('destination', JSON.stringify(data))
				console.log('Updated destination data (state.tsx): ', data)
			})
		},
	],
})

export const destinationSelector = selector({
	key: 'destination-modifier',
	get: ({ get }) => {
		return get(destinationAtom)
	},
})

export const originAtom = atom({
	key: 'origin-atom',
	default: {
		placeID: null,
		lat: null,
		lng: null,
		postcode: null,
		address: null,
		placeName: null,
	},
	effects: [
		({ onSet }) => {
			onSet((data) => {
				localStorage.setItem('origin', JSON.stringify(data))
				console.log('Updated origin data (state.tsx): ', data)
			})
		},
	],
})

export const originSelector = selector({
	key: 'origin-modifier',
	get: ({ get }) => {
		return get(originAtom)
	},
})

export const userLocationAtom = atom({
	key: 'userLocation-atom',
	default: {
		placeID: null,
		lat: null,
		lng: null,
		postcode: null,
		address: null,
		placeName: null,
	},
	effects: [
		({ onSet }) => {
			onSet((data) => {
				console.log('Updated user location (state.tsx): ', data)
			})
		},
	],
})

export const userLocationSelector = selector({
	key: 'userLocation-modifier',
	get: ({ get }) => {
		return get(userLocationAtom)
	},
})

export const searchTypeAtom = atom({
	key: 'searchType-atom',
	default: 0,
	effects: [
		({ onSet }) => {
			onSet((data) => {
				localStorage.setItem('searchType', JSON.stringify(data))
				console.log('Updated searchType data (state.tsx): ', data)
			})
		},
	],
})

export const searchTypeSelector = selector({
	key: 'searchType-modifier',
	get: ({ get }) => {
		return get(searchTypeAtom)
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

export const validInputAtom = atom({
	key: 'validInput-atom',
	default: false,
})

export const validInputSelector = selector({
	key: 'validInput-modifier',
	get: ({ get }) => {
		return get(validInputAtom)
	},
})

export const destInputAtom = atom({
	key: 'destInput-atom',
	default: '',
})

export const destInputSelector = selector({
	key: 'destInput-modifier',
	get: ({ get }) => {
		return get(destInputAtom)
	},
})

export const originInputAtom = atom({
	key: 'originInput-atom',
	default: '',
})

export const originInputSelector = selector({
	key: 'originInput-modifier',
	get: ({ get }) => {
		return get(originInputAtom)
	},
})

export const taxiETAAtom = atom({
	key: 'taxiETA-atom',
	default: { regular: null, plus: null },
})

export const taxiETASelector = selector({
	key: 'taxiETA-modifier',
	get: ({ get }) => {
		return get(taxiETAAtom)
	},
})

export const clickedOptionAtom = atom({
	key: 'clickedOption-atom',
	default: null as number | null,
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

export const poiAtom = atom({
	key: 'poi-atom',
	default: true,
})

export const poiSelector = selector({
	key: 'poi-modifier',
	get: ({ get }) => {
		return get(poiAtom)
	},
})

export const routesAtom = atom({
	key: 'routes-atom',
	default: {},
})

export const routesSelector = selector({
	key: 'routes-modifier',
	get: ({ get }) => {
		return get(routesAtom)
	},
})

export const tripStatsAtom = atom({
	key: 'tripStats-atom',
	default: {} as any,
})

export const tripStatsSelector = selector({
	key: 'tripStats-modifier',
	get: ({ get }) => {
		return get(tripStatsAtom)
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
