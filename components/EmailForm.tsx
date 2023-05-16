import { useRouter } from 'next/router'

export function EmailForm({ existingUser = true }) {
	const router = useRouter()

	return (
		<>
			{existingUser ? (
				<p className='mb-4 pb-3 text-zinc-600 dark:text-zinc-400'>
					Sign in using your email
				</p>
			) : null}

			<div className='-mx-3 mb-2'>
				<div className='w-full px-3 pb-6 md:mb-0'>
					<label>Email</label>
					<input type='text' placeholder='user@website.domain' />
				</div>
				<div className='w-full px-3 pb-6 md:mb-0'>
					<label>Password</label>
					<input type='password' placeholder='********' />
				</div>
			</div>

			<div className='mb-4 bg-neutral-100 text-zinc-400 dark:bg-neutral-600 dark:text-neutral-200 lg:text-left'>
				{existingUser ? (
					<p>
						<u>Forgot your password?</u>
					</p>
				) : (
					<p>
						Already have an account?{' '}
						<u onClick={() => router.push('/')}>Go back</u>
					</p>
				)}
			</div>
		</>
	)
}
