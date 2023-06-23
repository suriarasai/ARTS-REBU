import React from 'react';
import {
	FaAngleDown, FaClock,
	FaCoins, FaFlag
} from 'react-icons/fa';

export const DriverInformation = ({ onCancel }) => {
	// "Sno":3,"TaxiNumber":"SHX6464","TaxiType":"Standard","TaxiFeature":{"TaxiMakeModel":"Toyota Prius","TaxiPassengerCapacity":4,"TaxiColor":"Blue"},"TMDTID":"TMA12020","RegisteredDrivers":[{"DriverName":"Fazil","DriverPhone":85152186},{"DriverName":"Chen Lee","DriverPhone":92465573},{"DriverName":"Muthu","DriverPhone":96839679}]}
	return (
		<div className='mt-2 w-full rounded bg-zinc-50 p-3 px-5'>
			<div className='mb-3 flex flex-wrap items-center justify-center'>
				<div className='mr-5 flex h-16 w-16 items-center justify-center rounded-full border border-green-500'>
					DN
				</div>
				<div className='w-2/5'>
					<p className='font-medium'>{'[ Taxi Driver Name ]'}</p>
					<p>{'[ Car Model ]'}</p>
				</div>
				<div className='flex h-10 w-2/5 items-center justify-center rounded border border-green-700 text-xl text-green-700 '>
					{'[ Car Plate ]'}
				</div>
			</div>
			<hr className='mb-2' />
			<button className='w-1/2 p-1 text-red-700' onClick={() => onCancel(true)}>
				<p className='font-normal'>Cancel</p>
			</button>
			<button className='w-1/2 p-1 text-green-700'>
				<p className='font-normal'>Contact</p>
			</button>
		</div>
	);
};
export const PaymentInformation = ({ fare }) => {
	return (
		<div className='mt-2 flex w-full flex-wrap items-center rounded bg-zinc-50 p-3 px-5'>
			<div className='flex w-11/12 flex-row items-center'>
				<FaCoins className='mx-5 text-lg text-green-500' />
				<>
					$<b className='font-normal'>{fare}</b>
					<p className='text-sm'>Cash</p>
				</>
			</div>
			<div className='float-right'>
				<FaAngleDown className='text-lg text-green-500' />
			</div>
		</div>
	);
};
export const TripInformation = (props) => {
	const { placeName, postcode, dropTime } = props;
	return (
		<div className='mt-2 w-full rounded bg-zinc-50 p-3 px-5'>
			<b className='text-sm'>Your current trip</b>
			<div className='ml-5 mt-2 flex w-full items-center'>
				<FaFlag className='text-lg text-green-500' />
				<div className='w-4/5 p-2 px-5'>
					{placeName + ', Singapore ' + postcode}
				</div>
				<div className='float-right -ml-3'>
					<p>Change</p>
				</div>
			</div>
			<hr className='my-2' />
			<div className='ml-5 flex items-center'>
				<FaClock className='text-lg text-green-500' />
				<div className='p-2 px-5'>{Math.round(dropTime / 60) + ' min.'}</div>
			</div>
		</div>
	);
};
