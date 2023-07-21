import RebuLogo from '@/public/images/rebu-driver-logo.png';
import Image from 'next/image';

export const MainScreenVisual = ({size = 300}) => (
	<div className='h-6/12'>
		<Image
			className='ml-auto mr-auto'
			src={RebuLogo}
			width={size}
			height={size}
			alt='Logo' />
		<hr className='ml-auto mr-auto mt-12 h-0.5 w-16 bg-zinc-500' />
	</div>
);
