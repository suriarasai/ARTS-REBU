import { UserContext } from '@/context/UserContext'
import { getBooking, getTaxi } from '@/server'
import { useCallback, useContext, useEffect, useState } from 'react'
import RebuLogo from '@/public/images/rebu-logo.png'
import Image from 'next/image'
import { FaRegArrowAltCircleLeft } from 'react-icons/fa'
import { LoadingScreen } from '@/components/ui/LoadingScreen'

const Receipt = ({ bookingID, setScreen, booking = null, taxi = null }) => {
	const { user } = useContext(UserContext)
	const [bookingInformation, setBookingInformation] = useState(null)
	const [taxiInformation, setTaxiInformation] = useState(null)

	useEffect(() => {
		if (booking) {
			setBookingInformation(booking)
			setTaxiInformation(taxi)
		} else {
			getBooking(bookingID, setBookingInformation)
		}
	}, [])

	useEffect(() => {
		if (bookingInformation) {
			if (bookingInformation.status === 'requested') {
				setTaxiInformation({ status: 'requested' })
			} else if (bookingInformation.status === 'cancelled') {
				setTaxiInformation({ status: 'cancelled' })
			} else {
				getTaxi(bookingInformation.taxiID, setTaxiInformation)
				console.log('status: Booking has a taxi number')
				console.log(taxiInformation)

				if (taxiInformation === null) {
					setTaxiInformation({ status: 'missing' })
					console.log('Taxi number not found')
				}
			}
		}
	}, [bookingInformation])

	if (!bookingInformation || !taxiInformation) {
		return <LoadingScreen />
	}

	return (
		<div className='flex flex-col'>
			<button
				className='mb-5 p-2 text-3xl font-medium text-green-600'
				onClick={setScreen}
			>
				<FaRegArrowAltCircleLeft />
			</button>
			<Image
				className='mb-8'
				src={RebuLogo}
				height={100}
				width={100}
				alt='Rebu Logo'
			/>

			<label>Your booking</label>
			<p className='mb-5 flex'>
				Booking Number: <p className='ml-1 text-green-500'>{bookingID}</p>
			</p>
			<p className='mb-1 font-medium'>
				From {bookingInformation.pickUpLocation.placeName} to{' '}
				{bookingInformation.dropLocation.placeName}
			</p>
			<h5>On 06/03/2020 from 9:20 PM to 9:33 PM</h5>
			<h5>Taxi Number: SCP137123</h5>
			<hr className='my-4 border-2 border-zinc-100' />

			<label>Payment Detail</label>
			<div className='columns-2'>
				{/* TODO: List expenses only if non-zero */}
				<div className='ml-6 space-y-1'>
					<p>Base Fare</p>
					<p>Taxes</p>
					<p>Surcharges</p>
					<div className='text-green-500'>Total</div>
				</div>
				<div className='mr-8 space-y-1 text-right font-bold'>
					<div>${bookingInformation.fare}</div>
					<div>$0</div>
					<div>$0</div>
					<div className='text-green-500'>${bookingInformation.fare}</div>
				</div>
			</div>
			<hr className='my-4 border-2 border-zinc-100' />

			<label>Payment</label>
			<div className='w-full columns-2'>
				<div>
					<p className='ml-6'>VISA ****6904</p>
				</div>
				<div className='mr-8 text-right'>
					<b>${bookingInformation.fare}</b>
				</div>
			</div>
			<h5 className='ml-6'>
				{new Date(bookingInformation.pickUpTime).toLocaleString([], {
					year: 'numeric',
					month: 'numeric',
					day: 'numeric',
					hour: '2-digit',
					minute: '2-digit',
				})}
			</h5>
			<button className='ml-auto mr-auto mt-7 w-3/4 rounded-xl bg-green-300 px-4 py-2 text-white shadow-sm'>
				Print receipt
			</button>
		</div>
	)
}

export default Receipt
