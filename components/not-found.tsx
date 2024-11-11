'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export const NotFound = () => {
  return (
    <div className='h-full flex justify-center items-center flex-col space-y-4'>
      <Image
        src='/sweat-dark.svg'
        alt='OOPS!'
        height={200}
        width={200}
        className='hidden dark:block'
      />
      <Image
        src='/sweat-light.svg'
        alt='OOPS!'
        height={200}
        width={200}
        className='dark:hidden'
      />
      <h2>Page not found!</h2>
      <Button>
        <Link href='/documents'>Go back to documents</Link>
      </Button>
    </div>
  );
};
