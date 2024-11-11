'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export const Error = () => {
  return (
    <div className='h-full flex justify-center items-center flex-col space-y-4'>
      <Image
        src='/cry-dark.svg'
        alt='OOPS!'
        height={200}
        width={200}
        className='hidden dark:block'
      />
      <Image
        src='/cry-light.svg'
        alt='OOPS!'
        height={200}
        width={200}
        className='dark:hidden'
      />
      <h2>Some error has occured</h2>
      <Button>
        <Link href='/documents'>Back to documents</Link>
      </Button>
    </div>
  );
};
