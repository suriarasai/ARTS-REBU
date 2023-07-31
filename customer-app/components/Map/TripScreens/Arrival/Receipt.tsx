import { getBooking, getTaxi } from '@/server'
import { createRef, useEffect, useState } from 'react'
import RebuLogo from '@/public/images/rebu-logo.png'
import Image from 'next/image'
import { FaDownload, FaPrint, FaShare } from 'react-icons/fa'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { Popup } from '@/components/ui/Popup'
import { PDFExport } from '@progress/kendo-react-pdf'
import { formatCreditCardNumber } from '@/utils/formatCreditCardNumber'
import { useRecoilValue } from 'recoil'
import { userSelector } from '@/state'
import { bookingEvent } from '@/types'

const ref: any = createRef()

const Receipt = ({
	bookingID,
	setScreen,
	booking = null,
	taxi = null,
}: {
	bookingID: number
	setScreen: React.Dispatch<React.SetStateAction<string>>
	booking?: any
	taxi?: any
}) => {
	const user = useRecoilValue(userSelector)
	const [bookingInformation, setBookingInformation] =
		useState<bookingEvent | null>(null)
	const [taxiInformation, setTaxiInformation] = useState<any>(null)
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
				getTaxi(bookingInformation.sno as number, setTaxiInformation)
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
		<div className='absolute top-0 left-0 z-50 flex flex-col pt-12 h-screen w-screen p-4 bg-zinc-100 text-sm'>
			<PDFExport paperSize='A4' margin='0.5cm' ref={ref}>
				<Image className='mb-8' src={RebuLogo} width={100} alt='Rebu Logo' />

				<label>Your booking</label>
				<BookingInformation
					bookingID={bookingID}
					pickUpLocation={bookingInformation.pickUpLocation!}
					dropLocation={bookingInformation.dropLocation!}
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
					paymentMethod={bookingInformation.paymentMethod}
				/>
			</PDFExport>

			<MenuOptions setScreen={setScreen} setPopup={setPopup} />
		</div>
	)
}

export default Receipt

const BookingInformation = ({
	bookingID,
	pickUpLocation,
	dropLocation,
	pickUpTime,
	dropTime,
	taxiNumber,
}: bookingEvent) => (
	<>
		<p className='mb-5 flex'>
			Booking Number: <b className='ml-1 text-green-500'>{bookingID}</b>
		</p>
		<p className='mb-1 font-medium'>
			From <u>{pickUpLocation!.placeName}</u> to{' '}
			<u>{dropLocation!.placeName}</u>
		</p>
		<h5>
			{new Date(pickUpTime as number).toLocaleString([], {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
			})}{' '}
			from{' '}
			{new Date(pickUpTime as number).toLocaleString([], {
				hour: '2-digit',
				minute: '2-digit',
			})}{' '}
			to{' '}
			{new Date(dropTime as number).toLocaleString([], {
				hour: '2-digit',
				minute: '2-digit',
			})}
		</h5>
		<h5>Taxi Number: {taxiNumber}</h5>
	</>
)

const FareBreakdown = ({ fare }: { fare: number }) => (
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

const PaymentInformation = ({
	fare,
	dropTime,
	paymentMethod,
}: bookingEvent) => (
	<>
		<div className='w-full columns-2'>
			<div>
				<p className='ml-6'>
					{paymentMethod === 'Cash'
						? 'Cash'
						: 'VISA ' + formatCreditCardNumber(paymentMethod as string)}
				</p>
			</div>
			<div className='mr-8 text-right'>
				<b>${fare}</b>
			</div>
		</div>
		<h5 className='ml-6'>
			{new Date(dropTime as number).toLocaleString([], {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			})}
		</h5>
	</>
)

const MenuOptions = ({
	setScreen,
	setPopup,
}: {
	setScreen: React.MouseEventHandler<HTMLButtonElement> | any
	setPopup: React.Dispatch<React.SetStateAction<string | null>> | any
}) => (
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
