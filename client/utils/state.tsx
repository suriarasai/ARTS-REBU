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