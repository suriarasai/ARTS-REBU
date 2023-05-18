import React from 'react'
import { useForm } from 'react-hook-form'

export const MobileNumber = ({register, errors, newUser = true}) => {
	return (
		<div className='-mx-3 mb-2 flex flex-wrap'>
			<div className='mb-3 w-1/4 px-3 md:mb-0'>
				<label>Area</label>
				<div className='relative'>
					<select {...register('countryCode')} defaultValue='+60'>
						<option>+60</option>
						<option>+61</option>
						<option>+62</option>
						<option>+65</option>
						<option>+852</option>
					</select>
				</div>
			</div>

			<div className='w-3/4 px-3 pb-3 md:mb-0'>
				<label>Mobile Number</label>
				<input
					type='text'
					placeholder='12345678'
					{...register('mobileNumber', {
						required: newUser ? true : false,
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
