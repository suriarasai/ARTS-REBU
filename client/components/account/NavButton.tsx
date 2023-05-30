import React from 'react';
import { useRouter } from 'next/router';
import { navButtonProps } from '@/redux/types';

export const NavButton = ({ label, href, className }: navButtonProps) => {
	const router = useRouter();
	return (
		<div className='mt-2'>
			<p
				className={`mt-5 text-zinc-600 dark:text-zinc-400 ${className}`}
				key={label}
				onClick={() => router.push(href)}
			>
				{label}
			</p>
		</div>
	);
};
