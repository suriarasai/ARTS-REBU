import { Dispatch, Arrival } from '@/pages/map'
import { Matching } from './Matching'

import { screenAtom } from '@/state'
import { useRecoilValue } from 'recoil'
import { TaxiSelection } from './Selection'

export function TripScreens({map}) {
	const screen = useRecoilValue(screenAtom)
	return (
		<>
			{screen === 'select' ? (
				<TaxiSelection />
			) : screen === 'match' ? (
				<Matching />
			) : screen === 'dispatch' ? (
				<Dispatch map={map} />
			) : screen === 'arrival' ? (
				<Arrival />
			) : null}
		</>
	)
}
