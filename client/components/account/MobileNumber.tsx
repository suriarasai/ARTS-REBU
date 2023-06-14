// Form elements for adding/editing a country code and mobile number

import { ProfileInterface } from '@/redux/types'
import React from 'react'

export const MobileNumber = ({
	register,
	errors,
	newUser = true,
	populateData = {},
}: ProfileInterface) => {
	/*
		Register 		: assigns names to each input field to be accessed when reading the form
		Errors 			: defines error conditions for validation checks
		newUser		 	: whether the user is registering or editing their information
		populateData	: populating form data for when the user wants to update their information
	*/

	return (
		<div className='-mx-3 mb-2 flex flex-wrap'>
			{/* Input fields */}
			<div className='mb-3 w-1/4 px-3 md:mb-0'>
				<label>Area</label>
				<div className='relative'>
					<select
						{...register('phoneCountryCode')}
						defaultValue={
							populateData['phoneCountryCode']
								? populateData['phoneCountryCode']
								: ''
						}
						className='px-4 py-2'
					>
						<option value='' disabled>
							+
						</option>
						<option value={60}>+60</option>
						<option value={61}>+61</option>
						<option value={62}>+62</option>
						<option value={65}>+65</option>
						<option value={852}>+852</option>
					</select>
					<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
						<svg
							className='h-4 w-4 fill-current'
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 20 20'
						>
							<path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
						</svg>
					</div>
				</div>
			</div>

			<div className='w-3/4 px-3 pb-3 md:mb-0'>
				<label>Mobile Number</label>
				<input
					type='text'
					className='px-4 py-2'
					placeholder='12345678'
					defaultValue={populateData['phoneNumber']}
					{...register('phoneNumber', {
						required: true,
						minLength: 8,
						maxLength: 8,
						pattern: /^-?[0-9]\d*\.?\d*$/i,
					})}
				/>
				{errors.mobileNumber && (
					<p className='text-error'>Please enter a 8-digit mobile number</p>
				)}
			</div>
		</div>
	)
}
