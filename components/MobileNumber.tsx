import React from 'react';

export function MobileNumber(register: any, errors: any) {
	return <div className='-mx-3 mb-2 flex flex-wrap'>
		<div className='mb-6 w-full px-3 md:mb-0 w-1/4'>
			<label className='mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700'>
				Area
			</label>
			<div className='relative'>
				<select
					className='block w-full appearance-none rounded border border-gray-200 bg-gray-200 py-3 px-4 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none'
					{...register('countryCode')}
					defaultValue='+60'
				>
					<option>+60</option>
					<option>+61</option>
					<option>+62</option>
					<option>+65</option>
					<option>+852</option>
				</select>
			</div>
		</div>

		<div className='w-full px-3 pb-6 md:mb-0 w-3/4'>
			<label className='mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700'>
				Mobile Number
			</label>
			<input
				className='block w-full appearance-none rounded border border-gray-200 bg-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none'
				type='text'
				placeholder='12345678'
				{...register('mobileNumber', { required: true, minLength: 8, maxLength: 8, pattern: /^-?[0-9]\d*\.?\d*$/i })} />
			{errors.mobileNumber && (
				<p className='text-xs text-red-500'>
					Please enter a 8-digit mobile number
				</p>
			)}
		</div>
	</div>;
}
