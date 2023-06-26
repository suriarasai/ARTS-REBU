import { useContext, useEffect, useState } from 'react'
import { db } from '@/utils/firebase'
import { collection, onSnapshot } from 'firebase/firestore'
import Admin from '@/components/ui/admin'

export default function Dashboard() {
	const [bookings, setBookings] = useState([])
	const bookingRequestRef = collection(db, 'BookingEvent')

	useEffect(() => {
		const unsubscribe = onSnapshot(bookingRequestRef, (snapshot) => {
			setBookings(
				snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
			)
		})

		return () => {
			unsubscribe()
		}
	}, [])

	return (
		<Admin title='Admin Dashboard'>
			<div className='px-10 py-6'>
				<h1 className='!font-medium'>TBS | Taxi Booking System</h1>

				<div className='flex flex-col'>
					<div className='overflow-x-auto sm:-mx-6 lg:-mx-8'>
						<div className='inline-block min-w-full py-2 sm:px-6 lg:px-8'>
							<div className='overflow-hidden'>
								<table className='min-w-full text-left text-sm font-light'>
									<thead className='border-b font-medium dark:border-neutral-500'>
										<tr>
											<th scope='col' className='px-6 py-4'>
												Booking
											</th>
											<th scope='col' className='px-6 py-4'>
												Status
											</th>
											<th scope='col' className='px-6 py-4'>
												Customer Name
											</th>
											<th scope='col' className='px-6 py-4'>
												Customer
											</th>
											<th scope='col' className='px-6 py-4'>
												Driver
											</th>
											<th scope='col' className='px-6 py-4'>
												Taxi
											</th>
											<th scope='col' className='px-6 py-4'>
												Set Status
											</th>
										</tr>
									</thead>
									<tbody>
										{bookings.map((item) => (
											<tr
												className='border-b dark:border-neutral-500'
												key={item.id}
											>
												<td className='whitespace-nowrap px-6 py-4 font-medium'>
													{item.data.bookingID}
												</td>
												<td className='whitespace-nowrap px-6 py-4'>
													{item.data.status}
												</td>
												<td className='whitespace-nowrap px-6 py-4'>
													{item.data.customerName}
												</td>
												<td className='whitespace-nowrap px-6 py-4'>
													{item.data.customerID}
												</td>
												<td className='whitespace-nowrap px-6 py-4'>
													{item.data.driverID}
												</td>
												<td className='whitespace-nowrap px-6 py-4'>
													{item.data.sno}
												</td>
												<td className='whitespace-nowrap px-6 py-4'>Approve</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Admin>
	)
}
