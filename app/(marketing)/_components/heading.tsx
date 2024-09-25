'use client';

import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { SignInButton, useSession } from '@clerk/nextjs';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const Heading = () => {
  const { isSignedIn, isLoaded } = useSession();
  return (
    <div className='max-w-3xl space-y-4'>
      <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold'>
        Your Ideas, Documents & Plans. Unified. Welcome to{' '}
        <span className='underline'>Lo&apos;shon</span>
      </h1>
      <h3 className='text-base sm:text-xl md:text-2xl font-medium'>
        Lo&apos;shon is the connected workspace where better, faster work
        happens
      </h3>
      {!isLoaded && (
        <div className='w-full flex items-center justify-center'>
          <Spinner size='lg' />
        </div>
      )}
      {isSignedIn && isLoaded && (
        <>
          <Button asChild>
            <Link href='/documents'>
              Enter Lo&apos;shon <ArrowRight className='h-4 w-4 ml-2' />
            </Link>
          </Button>
        </>
      )}
      {!isSignedIn && isLoaded && (
        <SignInButton mode='modal'>
          <Button>
            Get started for free
            <ArrowRight className='h-4 w-4 ml-2' />
          </Button>
        </SignInButton>
      )}
    </div>
  );
};

export default Heading;
