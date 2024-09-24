'use client';

import Image from 'next/image';
import { Poppins } from 'next/font/google';

import { cn } from '@/lib/utils';

const font = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
});

const Logo = () => {
  return (
    <div className='hidden md:flex items-center gap-x-2'>
      <Image
        src='/logo_light.png'
        height='20'
        width='20'
        alt='logo'
        className='dark:hidden'
      />
      <Image
        src='/logo_dark.png'
        height='20'
        width='20'
        alt='logo'
        className='hidden dark:block'
      />
      <p className={cn('font-semibold', font.className)}>Lo&apos;shon</p>
    </div>
  );
};
export default Logo;
