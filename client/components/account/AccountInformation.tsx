// For viewing and modifying account information

import React, { useContext } from 'react'
import { MobileNumber } from '@/components/account/MobileNumber'
import { ProfileInterface } from '@/redux/types'
import { UserContext } from '@/context/UserContext'
import { icon } from '@/redux/types/constants'
import { FaUser } from 'react-icons/fa'

// Main component
const AccountInformation = ({
	register,
	errors,
	newUser = false,
	populateData = {},
}: ProfileInterface) => {
	/*
		Register 		: assigns names to each input field to be accessed when reading the form
		Errors 			: defines error conditions for validation checks
		newUser 		: whether the user is registering or editing their information
		populateData	: populating form data for when the user wants to update their information
	*/

	const { user } = useContext(UserContext)

	const ageArray = Array.from({ length: 82 }).map((_, i) => i + 18)

	return (
		<div className='flex w-full flex-col'>
			<div className='-mx-3 mb-6 flex flex-wrap'>
				{/* Input fields */}
				<div className='w-1/4 pr-3'>
					<div className='relative'>
						<select
							{...register('contactTitle', {
								required: true,
								minLength: 1,
							})}
							defaultValue={populateData['contactTitle']}
							className='white-input rounded-md px-4 py-2 shadow-sm'
						>
							<option value=''>Prefix</option>
							<option value='Mr.'>Mr.</option>
							<option value='Ms.'>Ms.</option>
							<option value='Mrs.'>Mrs.</option>
							<option value='Other'>Other</option>
						</select>
						<DropDownArrow mt={0} px={2} />
						{errors.contactTitle && (
							<p className='text-error mt-1'>Select a value</p>
						)}
					</div>
				</div>
				<div className='w-3/4 relative'>
					<input
						placeholder='Name'
						{...register('customerName', {
							required: true,
							minLength: 1,
						})}
						defaultValue={populateData['customerName']?.substring(
							0,
							populateData['customerName']?.lastIndexOf(' ')
						)}
						className='pl-10 white-input rounded-md py-2 shadow-sm'
					/>
					<FaUser className='absolute top-0 mt-3 ml-3 text-green-500' />
					{errors.customerName && (
						<p className='text-error mt-1'>Please enter your name</p>
					)}
				</div>
			</div>
			<div className='-mx-3 mb-6 flex flex-wrap'>
				<div className='relative w-1/2 pr-3'>
					<select
						{...register('countryCode', {
							required: true,
							minLength: 1,
						})}
						defaultValue={
							populateData['countryCode']
								? populateData['countryCode']
								: phoneCountryCodes[user.phoneCountryCode]
						}
						className='py-2 white-input rounded-md shadow-sm'
					>
						<option value=''>Country</option>
						<option value='SGP'>Singapore</option>
						<option value='MYS'>Malaysia</option>
						<option value='IDN'>Indonesia</option>
						<option value='HKG'>Hong Kong</option>
						<option value='PHL'>Philippines</option>
					</select>
					<DropDownArrow mt={1} px={6} />
					{errors.countryCode && (
						<p className='text-error mt-1'>Select a value</p>
					)}
				</div>
				<div className='relative w-1/2'>
					<select
						{...register('age', {
							required: true,
							minLength: 2,
						})}
						defaultValue={populateData['age']}
						className='px-4 py-2 white-input rounded-md shadow-sm'
					>
						<option value=''>Age</option>
						{ageArray.map((age, index) => (
							<option key={index}>{age}</option>
						))}
					</select>
					<DropDownArrow mt={1} px={6} />
					{errors.age && (
						<p className='text-error mt-1'>Select a value</p>
					)}
				</div>
			</div>

			{newUser ? null : (
				<>
					<div className='-mx-3 mb-6 flex flex-wrap'>
						<div className='w-full px-3'>
							<label>Email</label>
							<input
								{...register(newUser ? 'nullEmail' : 'email', {
									required: true,
									maxLength: 30,
									minLength: 5,
									pattern:
										/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/i,
								})}
								placeholder='youremail@site.domain'
								defaultValue={populateData['email']}
								className='px-4 py-2'
							/>
							{errors.email && (
								<p className='text-error mt-1'>Please enter a valid email</p>
							)}
						</div>
					</div>
					<div className='w-full pb-6 md:mb-0'>
						<label>Password</label>
						<input
							{...register(newUser ? 'nullPassword' : 'password', {
								required: true,
								maxLength: 20,
								minLength: 5,
							})}
							type='password'
							placeholder='********'
							defaultValue={populateData['password']}
							className='px-4 py-2'
						/>
						{errors.password && (
							<p className='text-error mt-1'>
								Please enter a password with 5-20 digits
							</p>
						)}
					</div>

					<MobileNumber
						register={register}
						errors={errors}
						newUser={newUser}
						populateData={populateData}
					/>
				</>
			)}
		</div>
	)
}

export default AccountInformation

const phoneCountryCodes = {
	65: 'SGP',
	60: 'MYS',
	62: 'IDN',
	852: 'HKG',
	63: 'PHL',
}

const DropDownArrow = ({ mt, px }) => (
	<div
		className={`pointer-events-none absolute inset-y-0 right-0 mt-${mt} flex items-center px-${px} text-gray-700`}
	>
		<svg
			className='h-4 w-4 fill-current'
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 20 20'
		>
			<path d={icon.dropdown} />
		</svg>
	</div>
)
