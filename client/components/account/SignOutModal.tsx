import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '@/components/context/UserContext';
import { addSignOutTime } from '@/server';

export const SignOutModal = () => {
	const router = useRouter();
	const [showModal, setShowModal] = useState<boolean>(false);
	const [logoutSuccessful, setLogoutSuccessful] = useState<boolean>(false);

	const { user } = useContext(UserContext);

	const handleSignOut = () => {
		addSignOutTime(user.id);
		setLogoutSuccessful(true);
		router.push('/');
	};

	return (
		<div>
			<div className='mt-12' onClick={() => setShowModal(true)}>
				<p className='font-medium text-red-600'>Logout</p>
			</div>

			{showModal ? (
				<div className='absolute left-0 top-0 flex h-full w-full items-center justify-center backdrop-brightness-50'>
					<div className='absolute left-0 right-0 top-1/3 ml-auto mr-auto flex h-auto w-1/2 flex-col items-center justify-center rounded-lg bg-zinc-50 p-7 shadow-xl'>
						<p className='font-medium mx-4 mt-3 mb-5 text-center text-gray-700'>
							Are you sure you want to log out?
						</p>
						<div className='flex gap-5'>
							<button
								className='blue-button-hollow'
								onClick={() => setShowModal(false)}
								disabled={logoutSuccessful ? true : false}
							>
								Cancel
							</button>
							<button
								className={`${logoutSuccessful ? 'green-button' : 'red-button text-red-500'}  hover:text-white`}
								onClick={() => handleSignOut()}
								disabled={logoutSuccessful ? true : false}
							>
								<div>{logoutSuccessful ? 'Logging out...' : 'Log out'}</div>
							</button>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
};
