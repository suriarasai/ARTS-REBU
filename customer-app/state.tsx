import { DispatchEvent, User } from '@/types'
import { atom } from 'recoil'
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

export const screenAtom = atom({
	key: 'screen-atom',
	default: '',
})

export const validInputAtom = atom({
	key: 'validInput-atom',
	default: false,
})

export const destInputAtom = atom({
	key: 'destInput-atom',
	default: '',
})

export const originInputAtom = atom({
	key: 'originInput-atom',
	default: '',
})

export const taxiETAAtom = atom({
	key: 'taxiETA-atom',
	default: { regular: null, plus: null },
})

export const etaCounterAtom = atom({
	key: 'etaCounter-atom',
	default: '-' as number | string,
})

export const arrivalAtom = atom({
	key: 'arrival-atom',
	default: false,
})

export const clickedOptionAtom = atom({
	key: 'clickedOption-atom',
	default: null as number | null,
})

export const selectedCardAtom = atom({
	key: 'selectedCard-atom',
	default: 'Cash',
})

export const poiAtom = atom({
	key: 'poi-atom',
	default: true,
})

export const routesAtom = atom({
	key: 'routes-atom',
	default: {},
})

export const tripStatsAtom = atom({
	key: 'tripStats-atom',
	default: {} as any,
})