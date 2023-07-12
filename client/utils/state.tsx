import { atom, selector } from 'recoil'

export const userAtom = atom({
	key: 'user-atom',
	default: null,
	effects: [
		({onSet}) => {
			onSet(data => {
				localStorage.setItem('user', JSON.stringify(data))
				console.log("Updated User Data (state.tsx): ", data)
			})
		}
	]
})

export const bookingAtom = atom({
	key: 'booking-atom',
	default: null,
})

export const taxiAtom = atom({
	key: 'taxi-atom',
	default: null,
})

export const driverAtom = atom({
	key: 'driver-atom',
	default: null,
})

export const userSelector = selector({
	key: 'user-modifier',
	get: ({ get }) => {
		const user = get(userAtom)
		return user
	},
})

export const bookingSelector = selector({
	key: 'booking-modifier',
	get: ({ get }) => {
		const booking = get(bookingAtom)
		return booking
	},
})

export const taxiSelector = selector({
	key: 'taxi-modifier',
	get: ({ get }) => {
		const taxi = get(taxiAtom)
		return taxi
	},
})

export const driverSelector = selector({
	key: 'driver-modifier',
	get: ({ get }) => {
		const driver = get(driverAtom)
		return driver
	},
})
