import { UserContext } from '@/context/UserContext'
import { getBooking, getTaxi } from '@/server'
import { createRef, useContext, useEffect, useState } from 'react'
import RebuLogo from '@/public/images/rebu-logo.png'
import Image from 'next/image'
import {
	FaDownload,
	FaPrint,
	FaShare,
} from 'react-icons/fa'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { Popup } from '@/components/ui/Popup'
import { PDFExport } from '@progress/kendo-react-pdf'

const ref: any = createRef()

const Receipt = ({ bookingID, setScreen, booking = null, taxi = null }) => {
	const { user } = useContext(UserContext)
	const [bookingInformation, setBookingInformation] = useState(null)
	const [taxiInformation, setTaxiInformation] = useState(null)
	const [popup, setPopup] = useState(null)

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
		<div className='flex flex-col pt-12'>
			{popup === 'downloaded' && (
				<Popup clear={setPopup} msg={`Invoice emailed to ${user.email}`} />
			)}

			<PDFExport paperSize='A4' margin='0.5cm' ref={ref}>
				<Image
					className='mb-8'
					src={RebuLogo}
					width={100}
					alt='Rebu Logo'
				/>

				<label>Your booking</label>
				<BookingInformation
					bookingID={bookingID}
					origin={bookingInformation.pickUpLocation.placeName}
					destination={bookingInformation.dropLocation.placeName}
					pickUpTime={bookingInformation.pickUpTime}
					dropTime={bookingInformation.dropTime}
					taxiNumber={taxiInformation.taxiNumber}
				/>

				<hr className='my-4 border-2 border-zinc-100' />

				<label>Payment Detail</label>
				<FareBreakdown fare={bookingInformation.fare} />

				<hr className='my-4 border-2 border-zinc-100' />

				<label>Payment</label>
				<PaymentInformation
					fare={bookingInformation.fare}
					dropTime={bookingInformation.dropTime}
				/>
			</PDFExport>

			<MenuOptions setScreen={setScreen} setPopup={setPopup} />
		</div>
	)
}

export default Receipt

const BookingInformation = ({
	bookingID,
	origin,
	destination,
	pickUpTime,
	dropTime,
	taxiNumber,
}) => (
	<>
		<p className='mb-5 flex'>
			Booking Number: <b className='ml-1 text-green-500'>{bookingID}</b>
		</p>
		<p className='mb-1 font-medium'>
			From <u>{origin}</u> to <u>{destination}</u>
		</p>
		<h5>
			{new Date(pickUpTime).toLocaleString([], {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
			})}{' '}
			from{' '}
			{new Date(pickUpTime).toLocaleString([], {
				hour: '2-digit',
				minute: '2-digit',
			})}{' '}
			to{' '}
			{new Date(dropTime).toLocaleString([], {
				hour: '2-digit',
				minute: '2-digit',
			})}
		</h5>
		<h5>Taxi Number: {taxiNumber}</h5>
	</>
)

const FareBreakdown = ({ fare }) => (
	<div className='columns-2'>
		<div className='ml-6 space-y-1'>
			<p>Base Fare</p>
			<p>Taxes</p>
			<p>Surcharges</p>
			<div className='text-green-500'>Total</div>
		</div>
		<div className='mr-8 space-y-1 text-right font-bold'>
			<div>${fare}</div>
			<div>$0</div>
			<div>$0</div>
			<div className='text-green-500'>${fare}</div>
		</div>
	</div>
)

const PaymentInformation = ({ fare, dropTime }) => (
	<>
		<div className='w-full columns-2'>
			<div>
				<p className='ml-6'>VISA ****6904</p>
			</div>
			<div className='mr-8 text-right'>
				<b>${fare}</b>
			</div>
		</div>
		<h5 className='ml-6'>
			{new Date(dropTime).toLocaleString([], {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			})}
		</h5>
	</>
)

const MenuOptions = ({ setScreen, setPopup }) => (
	<div className='ml-auto mr-auto mt-7 flex w-full items-center justify-center space-x-2'>
		<button
			className='w-1/2 rounded-xl bg-zinc-400 px-4 py-2 text-white shadow-sm'
			onClick={setScreen}
		>
			Go Back
		</button>
		<button className='receipt-button' onClick={() => setPopup(null)}>
			<FaDownload
				onClick={() => {
					if (ref.current) {
						ref.current.save()
					}
				}}
			/>
		</button>
		<button className='receipt-button' onClick={() => setPopup('downloaded')}>
			<FaShare />
		</button>
		<button className='receipt-button' onClick={() => setPopup(null)}>
			<FaPrint />
		</button>
	</div>
)
