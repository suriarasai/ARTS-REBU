import React from 'react'
import { FaSearch } from 'react-icons/fa'

export const WaitingUI = (): React.ReactNode => (
	<>
		<div className='flex flex-col items-center justify-center'>
			<FaSearch className='my-5 text-3xl text-green-300' />
			<h1 className='my-5 font-medium'>Looking for a driver...</h1>
			<h5 className='mb-5'>This may take some time</h5>
		</div>
	</>
)
