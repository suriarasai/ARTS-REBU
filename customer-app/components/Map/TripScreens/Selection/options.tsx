import Image from 'next/image'
import { PaymentOptions } from './payment'

export function TaxiSelectionUI({
	options,
	selectedTaxi,
	handleChangeSelection,
	handleShowPaymentMethod,
	onConfirm,
}) {
	const handleConfirm = () => onConfirm()

	return (
		<>
			<label className='!text-zinc-50'>Choose your taxi type</label>
			<div className='flex space-x-2 p-1 text-xs'>
				<RegularTaxi
					options={options.regular}
					handleChangeSelection={handleChangeSelection}
					selectedTaxi={selectedTaxi}
				/>
				<PlusTaxi
					options={options.plus}
					handleChangeSelection={handleChangeSelection}
					selectedTaxi={selectedTaxi}
				/>
			</div>
			<div className='flex w-full items-center space-x-2 p-1 text-xs text-zinc-50'>
				<PaymentOptions handleShowPaymentMethod={handleShowPaymentMethod} />
				<button
					className='!ml-auto w-fit rounded-md bg-green-200 p-1.5 text-gray-700'
					onClick={handleConfirm}
				>
					Confirm
				</button>
			</div>
		</>
	)
}

function RegularTaxi({ options, handleChangeSelection, selectedTaxi }) {
	const isAvail = options.taxiETA.toFixed(0) != 0
	return (
		<div
			className={`relative w-1/2 rounded-md bg-gray-600 p-2 text-zinc-50 ${
				!isAvail
					? 'border-2 border-red-200'
					: selectedTaxi === 'regular'
					? 'border-2 border-green-200'
					: ''
			}`}
			onClick={handleChangeSelection}
		>
			<label className='text-zinc-50'>Regular</label>
			{/* fare, eta, seats */}
			<p>${options.fare}</p>
			<p>{isAvail ? options.taxiETA + ' min' : 'Not Available'}</p>
			<p>1-{options.taxiPassengerCapacity} ppl</p>
			<Image
				src='https://www.svgrepo.com/show/112781/car-rounded-shape-side-view.svg'
				alt='Regular'
				height='100'
				width='100'
				className='absolute right-0 top-0'
			/>
		</div>
	)
}

function PlusTaxi({ options, handleChangeSelection, selectedTaxi }) {
	return (
		<div
			className={`relative w-1/2 rounded-md bg-gray-600 p-2 text-zinc-50 ${
				selectedTaxi === 'plus' ? 'border-2 border-green-200' : ''
			}`}
			onClick={handleChangeSelection}
		>
			<label className='text-zinc-50'>Plus</label>
			<p>${options.fare}</p>
			<p>{options.taxiETA + ' min'}</p>
			<p>1-{options.taxiPassengerCapacity} ppl</p>
			<Image
				src='https://www.svgrepo.com/show/158793/racing-car-side-view-silhouette.svg'
				alt='Regular'
				height='100'
				width='100'
				className='absolute right-0 top-0'
			/>
		</div>
	)
}
