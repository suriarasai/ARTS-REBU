import en from '@/public/images/rebu-logo-en.png'
import zh from '@/public/images/rebu-logo-zh.png'
import jp from '@/public/images/rebu-logo-jp.png'
import Image from 'next/image';

export const MainScreenVisual = ({lang = 'en', size = 200}) => (
	<div className='h-6/12'>
		<Image
			className='ml-auto mr-auto'
			src={lang === 'en' ? en : lang === 'zh' ? zh : jp}
			width={size}
			height={size}
			alt='Logo' />
		<hr className='ml-auto mr-auto mt-12 h-0.5 w-16 bg-zinc-500' />
	</div>
);
