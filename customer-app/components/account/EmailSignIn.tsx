import { useState } from 'react'
import api from '@/api/axiosConfig'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { EmailForm } from '@/components/account/EmailForm'
import { HREF } from '@/constants'
import { useRecoilState } from 'recoil'
import { userAtom } from '@/state'

// Sign in via Email
export const EmailSignIn = ({ setForm }: any) => {
	const router = useRouter()

	const {
		register: register,
		handleSubmit: handleSubmit,
		formState: { errors: errors },
	} = useForm()
	const onSubmit = handleSubmit((data) => {
		// @ts-ignore
		validateCredentials(data.email, data.password)
	})

	const [, setUser] = useRecoilState(userAtom)
	const [signInError, setSignInError] = useState(false)

	const validateCredentials = async (email: string, password: string) => {
		const response = await api.post('/api/v1/Customer/validateCredentials', {
			email: email,
			password: password,
		})
		if (response.data != '') {
			setUser(response.data)
			setSignInError(false)
			router.push(HREF.HOME)
		} else {
			setSignInError(true)
		}
		return response.data
	}

	// Navigates back to sign in screen
	const goBack = (event: any) => {
		event.preventDefault()
		setForm('main')
	}

	return (
		<>
			<form className='mt-12 flex flex-col' onSubmit={onSubmit}>
				<EmailForm
					register={register}
					errors={errors}
					signInError={signInError}
				/>

				{/* <TermsOfService /> */}

				<div className='ml-auto mr-auto mt-3'>
					<button type='submit' className='rect-button w-36 rounded-md shadow-md'>
						Sign In
					</button>
					<button
						onClick={goBack}
						className='rect-button mt-3 w-36 rounded-md !bg-zinc-200 text-zinc-500 shadow-md'
					>
						Go Back
					</button>
				</div>

				<p className='ml-auto mr-auto mt-8 text-green-500'>Forgot Password?</p>
			</form>
		</>
	)
}
