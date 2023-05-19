// For viewing and modifying account information

import React from 'react'
import { MobileNumber } from '@/components/MobileNumber'
import { useRouter } from 'next/router'

// Main component
const AccountInformation = ({ register, errors, newUser = false }) => {
	/*
		Register 		: assigns names to each input field to be accessed when reading the form
		Errors 			: defines error conditions for validation checks
		newUser 		: whether the user is registering or editing their information
	*/
	const router = useRouter()

	// Array containing days from 0 to 31
	const monthsArr = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	]
	// Array containing years from 1940 to 2010
	const yearsArr = Array.from({ length: 70 }).map((_, i) => i + 1940)
	// Array containing days from 1 to 31
	const daysArr = Array.from({ length: 31 }).map((_, i) => i + 1)
	// Array containing months from 1 to 12
	const monthsArrNumeric = Array.from({ length: 12 }).map((_, i) => i + 1)
	const honorificsArr = ['Ms.', 'Mr.', 'Mrs.']

	return (
		<div className='flex w-full flex-col'>
			<div className='-mx-3 mb-6 flex flex-wrap'>
				{/* Input fields */}
				<div className='mb-6 w-1/4 md:mb-0 md:w-1/5'>
					<DropDown
						register={register}
						name='prefix'
						label='Prefix'
						array={honorificsArr}
						errors={errors}
					/>
				</div>
				<div className='mb-6 w-3/4 md:mb-0 md:w-2/5'>
					<div className='w-full px-3'>
						<label>First Name</label>
						<input
							placeholder='First Name'
							{...register('firstName', {
								required: newUser ? true : false,
							})}
						/>
						{errors.firstName && (
							<p className='text-error px-3'>Please enter your last name</p>
						)}
					</div>
				</div>
				<div className='w-full md:w-2/5'>
					<div className='w-full px-3'>
						<label>Last Name</label>
						<input
							placeholder='Last Name'
							{...register('lastName', {
								required: newUser ? true : false,
							})}
						/>
						{errors.lastName && (
							<p className='text-error px-3'>Please enter your last name</p>
						)}
					</div>
				</div>
			</div>

			{newUser ? null : (
				<>
					<div className='-mx-3 mb-6 flex flex-wrap'>
						<div className='w-full px-3'>
							<label>Email</label>
							<input
								{...register(newUser ? 'nullEmail' : 'email', {})}
								placeholder='youremail@site.domain'
							/>
						</div>
					</div>
					<div className='w-full pb-6 md:mb-0'>
						<label>Password</label>
						<input
							{...register(newUser ? 'nullPassword' : 'password', {})}
							type='password'
							placeholder='********'
						/>
					</div>

					<MobileNumber register={register} errors={errors} newUser={newUser} />
				</>
			)}

			{/* TODO: Replace with DatePicker... need to find a library */}
			<div className='-mx-3 mb-2 flex flex-wrap'>
				<DropDown
					register={register}
					name='year'
					label='Birth Year'
					array={yearsArr}
					value='Year'
					errors={errors}
				/>
				<DropDown
					register={register}
					name='month'
					label='Birth Month'
					arrayVal={monthsArrNumeric}
					array={monthsArr}
					value='Month'
					errors={errors}
				/>
				<DropDown
					register={register}
					name='day'
					label='Birth Day'
					array={daysArr}
					value='Day'
					errors={errors}
				/>
			</div>

			{/* Buttons for submiting data */}
			{newUser ? null : (
				<div className='-mx-3 mb-6 mt-8 flex justify-center md:self-end'>
					<button
						className='grey-button mr-3'
						onClick={() => router.push('/settings')}
					>
						{'Go Back'}
					</button>
					<button type='submit' className='blue-button mr-4'>
						{'Save Changes'}
					</button>
				</div>
			)}
		</div>
	)
}

const DropDown = ({
	label,
	array,
	arrayVal = array,
	value = label,
	register,
	errors,
	name,
}: any) => (
	<div className={`w-full px-3 ${label === 'Prefix' ? '' : 'w-1/3'}`}>
		<label>{label}</label>
		<div className='relative'>
			<select
				{...(register(name), { required: true, minLength: 1 })}
				defaultValue=''
			>
				<option value='' disabled selected>
					{value}
				</option>
				{array.map((option: any, index) => (
					<option value={arrayVal[index]} key={option}>
						{option}
					</option>
				))}
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
)

export default AccountInformation
