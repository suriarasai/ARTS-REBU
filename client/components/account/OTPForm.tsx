import React from 'react';
import { useRouter } from 'next/router';
import { Button, HREF } from '@/redux/types/constants';
import { TermsOfService } from '@/components/account/TermsOfService';

// 2nd screen to validate the user's mobile number via OTP (one-time password)
export const OTPForm = ({ phoneNumber, changeSignInForm, newUser }: any) => {
	const router = useRouter();
	const [loginSuccessful, setLoginSuccesssful] = React.useState<boolean>(false);

	const handleSubmit = (data: any) => {
		changeSignInForm(false);
	};

	// Navigates back to sign in screen
	const goBack = (event: any) => {
		event.preventDefault();
		changeSignInForm(true);
	};

	const getOTP = (event: any) => {
		event.preventDefault();
	};

	const continueButton = (e: React.MouseEvent<HTMLButtonElement>): void => {
		e.preventDefault();
		setLoginSuccesssful(true);
		router.push(newUser ? HREF.REGISTRATION : HREF.HOME);
	};

	return (
		<>
			{/* User form */}
			<form className='flex w-full max-w-lg flex-col' onSubmit={handleSubmit}>
				<div className='mt-5'>
					<p className='mb-4 pb-6 text-zinc-600 dark:text-zinc-400'>
						Enter the OTP we sent to <b>{phoneNumber}</b>
					</p>
				</div>

				<div className='-mx-3 mb-2 flex flex-wrap items-center'>
					<div className='w-3/4 px-3 pb-6 md:mb-0'>
						<label>Enter OTP</label>
						<input type='text' placeholder='1234' className='px-4 py-2' />
					</div>

					<div className='w-1/4 px-3 md:mb-0'>
						<button className='blue-button' onClick={getOTP}>
							Get OTP
						</button>
					</div>
				</div>

				<TermsOfService />

				<div className='-mx-3 mb-2 flex self-end'>
					<button
						className='grey-button mr-3'
						onClick={goBack}
						disabled={loginSuccessful ? true : false}
					>
						{'Go Back'}
					</button>
					<button
						className={`mr-8 ${loginSuccessful ? 'green-button' : 'blue-button'}`}
						onClick={continueButton}
						disabled={loginSuccessful ? true : false}
					>
						{loginSuccessful ? Button.SIGNING_IN : Button.SIGN_IN}
					</button>
				</div>
			</form>
		</>
	);
};
