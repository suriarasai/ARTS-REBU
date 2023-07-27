import { useState } from 'react';
import { useRouter } from 'next/router';
import { FaSignOutAlt } from 'react-icons/fa';
import { useRecoilState } from 'recoil';
import { userAtom } from '@/state';

export const SignOutModal = () => {
	const router = useRouter();
	const [showModal, setShowModal] = useState<boolean>(false);
	const [logoutSuccessful, setLogoutSuccessful] = useState<boolean>(false);

	const [, setUser] = useRecoilState(userAtom)

	const handleSignOut = () => {
		setLogoutSuccessful(true);
		setUser({})
		localStorage.clear()
		router.push('/');
	};

	return (
		<div>
			<div className='mt-12 float-right' onClick={() => setShowModal(true)}>
				<p className='font-medium text-red-700 flex items-center'>Logout <FaSignOutAlt className='ml-3 text-2xl' /></p>
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
