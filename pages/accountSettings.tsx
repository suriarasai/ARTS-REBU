// For viewing and modifying account information

import React from 'react'
import { useForm, Resolver } from 'react-hook-form'
import Page from '@/components/page'
import Section from '@/components/section'
import { MobileNumber } from '@/components/MobileNumber'
import { useRouter } from 'next/router'

// Main component
const AccountSettings = () => {
	const router = useRouter()
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()
	const onSubmit = handleSubmit((data) => {})

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
		'Nov',
		'Dec',
	]
	// Array containing years from 1940 to 2010
	const yearsArr = Array.from({ length: 70 }).map((_, i) => i + 1940)
	// Array containing days from 1 to 31
	const daysArr = Array.from({ length: 31 }).map((_, i) => i + 1)
	const honorificsArr = ['Ms.', 'Mr.', 'Mrs.']

	return (
		<Page title='Settings'>
			<Section>
				<h2 className='mt-3 mb-8 text-center text-xl font-bold'>Profile</h2>

				<form className='flex w-full flex-col'>
					<div className='-mx-3 mb-6 flex flex-wrap'>
						<div className='mb-6 w-full md:mb-0 md:w-1/5'>
							<DropDown label='Prefix' array={honorificsArr} />
						</div>
						<div className='mb-6 w-full md:mb-0 md:w-2/5'>
							<TextField label='First Name' placeholder='First Name' />
						</div>
						<div className='w-full md:w-2/5'>
							<TextField label='Last Name' placeholder='Last Name' />
						</div>
					</div>
					<div className='-mx-3 mb-6 flex flex-wrap'>
						<TextField label='Email' placeholder='youremail@site.domain' />
					</div>

					{MobileNumber(register, errors)}

					{/* TODO: Replace with DatePicker... need to find a library */}
					<div className='-mx-3 mb-2 flex flex-wrap'>
						<DropDown label='Year' array={yearsArr} />
						<DropDown label='Month' array={monthsArr} />
						<DropDown label='Day' array={daysArr} />
					</div>

					<div className='-mx-3 mb-6 mt-8 flex justify-center md:self-end'>
						<button
							className='grey-button mr-3'
							onClick={() => router.push('/settings')}
						>
							{'Discard Changes'}
						</button>
						<button className='blue-button mr-4'>{'Save Changes'}</button>
					</div>
				</form>
			</Section>
		</Page>
	)
}

const TextField = ({ label, placeholder }: any) => (
	<div className='w-full px-3'>
		<label>{label}</label>
		<input placeholder={placeholder} />
	</div>
)

const DropDown = ({ label, array }: any) => (
	<div className={`w-full px-3 ${label === 'Prefix' ? '' : 'w-1/3'}`}>
		<label>{label}</label>
		<div className='relative'>
			<select>
				<option value='0'>{label}</option>
				{array.map((option: any) => (
					<option key={option}>{option}</option>
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

export default AccountSettings
