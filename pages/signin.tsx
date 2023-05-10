import Section from '@/components/section'
import Page from '@/components/page'

interface SelectProps {
	options: string[]
	defaultOption?: string
	className?: string
}

const SignIn = () => (
	<main className='mx-auto max-w-screen-md pt-20 pb-16 px-safe sm:pb-0'>
		<div className='p-6 flex flex-col'>
			<h2 className='text-xl font-semibold'>Welcome to Rebu</h2>

			<div className='mt-8'>
				<p className='pb-6 text-zinc-600 dark:text-zinc-400'>
					Enter your mobile number
				</p>
			</div>

			<div className='grid grid-cols-4 w-full'>
				<span className='mb-3 text-xs md:mb-0 md:w-1/2'>
					<Select options={['+60', '+61', '+62', '+65', '+852']} />
				</span>
				<span className='col-span-3 w-full md:w-1/2'>
					<input
						className='block flex items-center rounded border-b py-2 px-4 text-xs shadow focus:outline-none'
						id='grid-last-name'
						type='text'
						placeholder='Enter your mobile number'
					/>
				</span>
			</div>

			<div className='grid grid-cols-5'>
				<span className='col-span-3 md:w-1/2'>
					<input
						className='block flex items-center rounded border-b py-2 px-4 text-xs shadow focus:outline-none'
						id='grid-last-name'
						type='text'
						placeholder='Enter your OTP'
					/>
				</span>
				<span className='col-span-2 mb-6 pl-3 text-xs md:mb-0 md:w-1/2'>
					<button
						type='submit'
						className='rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700'
					>
						Get OTP
					</button>
				</span>
			</div>

			<button
				type='submit'
				className='self-end rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 text-xs'
			>
				Continue
			</button>

		</div>
	</main>
)

// Dropdown for selecting country code
const Select: React.FC<SelectProps> = ({ options, defaultOption = '+' }) => {
	return (
		<div className={'w-18 relative inline-block'}>
			<select className='focus:shadow-outline block appearance-none rounded border-b bg-white px-2 py-2 pr-6 shadow hover:border-gray-500 focus:outline-none'>
				{defaultOption && <option disabled>{defaultOption}</option>}
				{options.map((option) => (
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
	)
}

export default SignIn
