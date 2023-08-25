import { Popup } from '@/components/ui/Popup';
import { NOTIF } from '@/constants';
import { notificationAtom } from '@/state';
import { useRecoilValue } from 'recoil';


export function ProximityNotifications() {
	const notification = useRecoilValue(notificationAtom)

	return (
		<>
			{notification === 'waiting' ? (
				<Popup msg={NOTIF.WAITING} />
			) : notification === 'arrivingSoon' ? (
				<Popup msg={NOTIF.ARRIVINGSOON} />
			) : notification === 'arrivedToUser' ? (
				<Popup msg={NOTIF.ARRIVEDTOUSER} />
			) : notification === 'arrivedToDestination' ? (
				<Popup msg={NOTIF.ARRIVEDTODEST} />
			) : null}
		</>
	)
}
