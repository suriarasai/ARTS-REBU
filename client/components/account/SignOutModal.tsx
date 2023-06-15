import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '@/context/UserContext';

export const SignOutModal = () => {
	const router = useRouter();
	const [showModal, setShowModal] = useState<boolean>(false);
	const [logoutSuccessful, setLogoutSuccessful] = useState<boolean>(false);

	const { setUser } = useContext(UserContext);

	const handleSignOut = () => {
		setLogoutSuccessful(true);
		setUser({})
		localStorage.clear()
		router.push('/');
	};

	return (
		<div>
			<div className='mt-12' onClick={() => setShowModal(true)}>
				<p className='font-medium text-red-600'>Logout</p>
			</div>

			{showModal ? (
				<div className='dark-overlay'>
					<div className='modal-container'>
						<p className='mx-4 mt-3 mb-5 text-center'>
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
