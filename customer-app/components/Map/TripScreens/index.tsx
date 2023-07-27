import { Matching, Dispatch, LiveTrip, Arrival } from '@/pages/map'

import { screenAtom } from '@/state'
import { useRecoilValue } from 'recoil'
import { TaxiSelection } from './Selection'

export function TripScreens() {
	const screen = useRecoilValue(screenAtom)
	return (
		<>
			{screen === 'select' ? (
				<TaxiSelection />
			) : screen === 'match' ? (
				<Matching />
			) : screen === 'dispatch' ? (
				<Dispatch />
			) : screen === 'trip' ? (
				<LiveTrip />
			) : screen === 'arrival' ? (
				<Arrival />
			) : null}
		</>
	)
}
