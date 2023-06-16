import React from 'react';
import { Message } from '@/redux/types/constants';


export const TermsOfService = () => (
	<div className='mb-8 bg-neutral-100 text-zinc-400 dark:bg-neutral-600 dark:text-neutral-200 lg:text-left'>
		{Message.TOS1} <u>{Message.TOS2}</u>
	</div>
);
