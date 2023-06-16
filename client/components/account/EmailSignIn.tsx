import React, { useContext } from 'react';
import api from '@/api/axiosConfig';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { EmailForm } from '@/components/account/EmailForm';
import { UserContext } from '@/context/UserContext';
import { HREF } from '@/redux/types/constants';
import { TermsOfService } from '@/components/account/TermsOfService';

// Sign in via Email
export const EmailSignIn = ({ changeEmailSignIn, changeSignInForm }: any) => {
	const router = useRouter();

	const {
		register: register, handleSubmit: handleSubmit, formState: { errors: errors },
	} = useForm();
	const onSubmit = handleSubmit((data) => {
		// @ts-ignore
		validateCredentials(data.email, data.password);
	});

	const { setUser } = useContext(UserContext);
	const [signInError, setSignInError] = React.useState(false);

	const validateCredentials = async (email: string, password: string) => {
		const response = await api.post('/api/v1/Customer/validateCredentials', {
			email: email,
			password: password,
		});
		if (response.data != '') {
			setUser(response.data);
			localStorage.setItem('user', JSON.stringify(response.data));
			setSignInError(false);
			router.push(HREF.HOME);
		} else {
			setSignInError(true);
		}
		return response.data;
	};

	// Navigates back to sign in screen
	const goBack = (event: any) => {
		event.preventDefault();
		changeEmailSignIn(false);
		changeSignInForm(true);
	};

	return (
		<>
			<form className='flex w-full max-w-lg flex-col' onSubmit={onSubmit}>
				<EmailForm
					register={register}
					errors={errors}
					signInError={signInError} />

				<TermsOfService />

				<div className='-mx-3 flex self-end'>
					<button className='grey-button mr-3' onClick={goBack}>
						{'Go Back'}
					</button>
					<button className='blue-button mr-8' type='submit'>
						{'Continue ᐳ'}
					</button>
				</div>
			</form>
		</>
	);
};
