import { showOptionInterface } from "@/redux/types";
import React from "react";
import {
	FaCrosshairs,
	FaFontAwesomeFlag
} from 'react-icons/fa';

export const RouteConfirmation = ({ data }) => (
	<table className='mb-5'>
		<tbody className='mb-3 pb-2 pl-2'>
			<tr className='flex items-center'>
				<th className='p-1 text-right'>
					<FaCrosshairs className='text-xl text-green-500' />
				</th>
				<th className='text-left'>
					<p className='p-2 text-sm'>
						<b>{data.origin.placeName}</b>, Singapore {data.origin.postcode}
					</p>
				</th>
			</tr>
			<tr className='flex items-center'>
				<th className='p-1 text-right'>
					<FaFontAwesomeFlag className='text-xl text-green-500' />
				</th>
				<th className='text-left'>
					<p className='p-2 text-sm'>
						<b>{data.destination.placeName}</b>, Singapore{' '}
						{data.destination.postcode}
					</p>
				</th>
			</tr>
		</tbody>
	</table>
);// helper component to show rides
export const ShowOption = ({
	option, setClickedOption, disabled = false,
}: showOptionInterface) => (
	/*
		option				: the ride option
		setClickedOption	: tracks which ride option was clicked
	*/
	<div
		className={`ride-option ${disabled ? 'pointer-events-none' : ''}`}
		key={option.id}
		onClick={() => setClickedOption(option.id)}
	>
		<div className='float-left items-center p-2 pr-4 text-2xl text-green-500'>
			{/* @ts-ignore */}
			{option.icon}
		</div>
		<div className='float-left'>
			<b>{option.taxiType}</b>
			<p className='text-sm'>
				{/* @ts-ignore */}
				1-{option.taxiPassengerCapacity} seats ({option.desc})
			</p>
		</div>
		<div className='float-right mr-8'>
			<b className='text-lg'>${option.fare}</b>
			<p className='text-sm'>
				<span className='float-right'>
					{option.pickUpTime}
					{' min.'}
				</span>
			</p>
		</div>
	</div>
)

