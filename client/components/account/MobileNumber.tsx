// Form elements for adding/editing a country code and mobile number
// NOTE: Since phoneNumber is an integer, leading zeros are prohibited
// but this is alright because phoneNumbers can't start with a 0

import { HREF, icon } from '@/constants'
import { useForm } from 'react-hook-form'
import api from '@/api/axiosConfig'
import { FaAngleRight } from 'react-icons/fa'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { userAtom } from '@/utils/state'
import { useState } from 'react'

export const MobileNumber = ({ newUser = true, populateData = {} }: any) => {
	/*
		Register 		: assigns names to each input field to be accessed when reading the form
		Errors 			: defines error conditions for validation checks
		newUser		 	: whether the user is registering or editing their information
		populateData	: populating form data for when the user wants to update their information
	*/

	const router = useRouter()

	const [triggerOTP, setTriggerOTP] = useState(false)

	const {
		register: register,
		handleSubmit: handleSubmit,
		formState: { errors: errors },
	} = useForm()

	const onSubmit = handleSubmit((data) => {
		// @ts-ignore
		checkIfUserExists(data.phoneNumber, data.phoneCountryCode)
		setTriggerOTP(true)
	})

	const handleRouting = () => {
		if (triggerOTP && user.customerName) {
			router.push(HREF.HOME)
		} else if (triggerOTP) {
			router.push(HREF.REGISTRATION)
		}
	}

	const [user, setUser] = useRecoilState(userAtom)

	async function checkIfUserExists(
		phoneNumber: string,
		phoneCountryCode: number
	) {
		const response = await api.post('/api/v1/Customer/exists', {
			phoneCountryCode: phoneCountryCode,
			phoneNumber: phoneNumber,
		})

		// If the user does not exist...
		if (response.data === '') {
			const createUser = await api.post('/api/v1/Customer', {
				phoneNumber: phoneNumber,
				phoneCountryCode: phoneCountryCode,
			})
			setUser(createUser.data)
			// If the user exists but they haven't completed registration...
		} else if (response.data.customerName === null) {
			setUser(response.data)
			// If the user exists
		} else {
			setUser(response.data)
		}
	}

	return (
		<form className='-mx-3 mb-2 flex flex-wrap' onSubmit={onSubmit}>
			{/* Input fields */}
			{triggerOTP ? (
				<OTP setTriggerOTP={setTriggerOTP} />
			) : (
				<>
					<PhoneCountryCode
						populateData={populateData}
						register={register}
						errors={errors}
					/>
					<PhoneNumber
						populateData={populateData}
						register={register}
						errors={errors}
						newUser={newUser}
					/>
				</>
			)}

			{newUser && (
				// Submit Button
				<button
					type='submit'
					className='rect-button rounded-r-lg shadow-md'
					onClick={handleRouting}
				>
					<FaAngleRight />
				</button>
			)}
		</form>
	)
}

const PhoneNumber = ({
	populateData,
	register,
	errors,
	newUser,
}: {
	populateData: any
	register: any
	errors: any
	newUser: boolean
}) => (
	<div className={`pb-3 md:mb-0 ${newUser ? 'w-3/5' : 'w-4/5'}`}>
		<input
			className='white-input'
			placeholder='Enter your mobile number'
			defaultValue={populateData['phoneNumber']}
			{...register('phoneNumber', {
				required: true,
				minLength: 8,
				maxLength: 8,
				pattern: /^-?[0-9]\d*\.?\d*$/i,
			})}
		/>
		{errors.phoneNumber && (
			<p className='text-error mt-1 px-3'>
				Please enter a 8-digit mobile number
			</p>
		)}
	</div>
)

const PhoneCountryCode = ({
	register,
	populateData,
	errors,
}: {
	register: any
	populateData: any
	errors: any
}) => (
	<div className='mb-3 w-1/5'>
		<div className='relative'>
			<select
				{...register('phoneCountryCode', {
					required: true,
					minLength: 2,
				})}
				defaultValue={
					populateData['phoneCountryCode']
						? populateData['phoneCountryCode']
						: ''
				}
				className='white-input rounded-l-lg'
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
			<div className='pointer-events-none absolute right-0 top-0 mt-3.5 flex items-center px-2 text-gray-700'>
				<svg
					className='h-4 w-4 fill-current'
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 20 20'
				>
					<path d={icon.dropdown} />
				</svg>
			</div>
			{errors.phoneCountryCode && (
				<p className='text-error mt-1 px-3'>Select a value</p>
			)}
		</div>
	</div>
)

const OTP = ({
	setTriggerOTP,
}: {
	setTriggerOTP: React.Dispatch<React.SetStateAction<boolean>>
}) => (
	<>
		<div className='w-1/5 pb-3'>
			<button
				className='rect-button w-full rounded-l-lg !bg-zinc-200 text-zinc-500'
				onClick={() => setTriggerOTP(false)}
			>
				Cancel
			</button>
		</div>
		<div className='w-3/5 pb-3'>
			<input
				defaultValue=''
				className='white-input'
				placeholder='Enter the 6-digit OTP'
			/>
		</div>
	</>
)
