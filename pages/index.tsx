// First page, for signing in

import Link from 'next/link'

const SignIn = () => (
	<main className='mx-auto max-w-screen-md pt-20 pb-16 px-safe sm:pb-0'>
		<div className='p-6'>
			<h2 className='text-xl font-semibold'>Welcome to Rebu</h2>

			<div className='mt-8'>
				<p className='pb-6 text-zinc-600 dark:text-zinc-400'>
					Enter your mobile number
				</p>
			</div>

			{/* User form */}
			<form className='mt-6 w-full max-w-lg flex flex-col'>
				<div className='-mx-3 mb-4 flex flex-wrap'>
					<div className='mb-6 w-full px-3 md:mb-0 md:w-1/4'>
						<label className='mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700'>
							Country Code
						</label>
						<div className='relative'>
							<select className='block w-full appearance-none rounded border border-gray-200 bg-gray-200 py-3 px-4 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none'>
								<option>+60</option>
								<option>+61</option>
								<option>+62</option>
								<option>+65</option>
								<option>+852</option>
							</select>
						</div>
					</div>

					<div className='mb-6 w-full px-3 md:mb-0 md:w-3/4'>
						<label className='mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700'>
							Mobile Number
						</label>
						<input
							className='block w-full appearance-none rounded border border-gray-200 bg-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none'
							type='text'
							placeholder='12345678'
						/>
					</div>
				</div>

				{/* Submit button */}
				<Link key={'Continue'} href={'/booking'}>
					<button
						type='submit'
						className='self-end rounded bg-blue-500 py-3 px-4 text-xs font-bold text-white hover:bg-blue-700'
					>
						Continue
					</button>
				</Link>

			</form>
		</div>
	</main>
)

export default SignIn
