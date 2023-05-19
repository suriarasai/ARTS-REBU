// For viewing and modifying account information

import React from 'react'
import { MobileNumber } from '@/components/MobileNumber'

// Main component
const AccountInformation = ({
	register,
	errors,
	newUser = false,
	populateData = {},
}) => {
	/*
		Register 		: assigns names to each input field to be accessed when reading the form
		Errors 			: defines error conditions for validation checks
		newUser 		: whether the user is registering or editing their information
		populateData	: populating form data for when the user wants to update their information
	*/

	return (
		<div className='flex w-full flex-col'>
			<div className='-mx-3 mb-6 flex flex-wrap'>
				{/* Input fields */}
				<div className='mb-6 w-1/4 md:mb-0 md:w-1/5'>
					<div className='w-full px-3'>
						<label>Prefix</label>
						<div className='relative'>
							<select
								{...(register('prefix'))}
								defaultValue={populateData['prefix']}
							>
								<option value=''>Prefix</option>
								<option value='Mr.'>Mr.</option>
								<option value='Ms.'>Ms.</option>
								<option value='Mrs.'>Mrs.</option>
								<option value='Other.'>Other</option>
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
				</div>
				<div className='mb-6 w-3/4 md:mb-0 md:w-2/5'>
					<div className='w-full px-3'>
						<label>First Name</label>
						<input
							placeholder='First Name'
							{...register('firstName', {
								required: newUser ? true : false,
							})}
							defaultValue={populateData['firstName']}
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
							defaultValue={populateData['lastName']}
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
								defaultValue={populateData['email']}
							/>
						</div>
					</div>
					<div className='w-full pb-6 md:mb-0'>
						<label>Password</label>
						<input
							{...register(newUser ? 'nullPassword' : 'password', {})}
							type='password'
							placeholder='********'
							defaultValue={populateData['password']}
						/>
					</div>

					<MobileNumber
						register={register}
						errors={errors}
						newUser={newUser}
						populateData={populateData}
					/>
				</>
			)}

			<div className='-mx-3 mb-6 flex flex-wrap'>
				<div className='w-full px-3'>
					<label>Date of Birth</label>
					<input
						{...register('birthdate', { required: true })}
						type='date'
						defaultValue={populateData['birthdate']}
					/>
					{errors.birthdate && (
						<p className='text-error px-3'>Please enter your date of birth</p>
					)}
				</div>
			</div>
		</div>
	)
}

export default AccountInformation
