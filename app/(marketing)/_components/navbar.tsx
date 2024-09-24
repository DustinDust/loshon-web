'use client';

import { useScrollTop } from '@/hooks/use-scroll-top';
import { cn } from '@/lib/utils';
import Logo from './logo';
import { ModeToggle } from '@/components/mode-toggle';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { Spinner } from '@/components/spinner';
import Link from 'next/link';
import { UserButton } from '@/components/ user-button';

export const NavBar = () => {
  const scrolled = useScrollTop();
  const { data: session, status } = useSession();

  const isAuthenticated = !!session;
  const isLoading = status === 'loading';

  return (
    <div
      className={cn(
        'z-50 bg-background fixed top-0 flex items-center w-full px-6 py-2 dark:bg-[--background]',
        scrolled && 'border-b shadow-sm bg-white'
      )}
    >
      <Logo />
      <div className='md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2'>
        {isLoading && (
          <p>
            <Spinner />
          </p>
        )}
        {!isAuthenticated && !isLoading && (
          <>
            <Button
              variant='ghost'
              size='sm'
              className='font-bold'
              onClick={() => signIn()}
            >
              Login
            </Button>
            <Button size='sm' onClick={() => signIn()}>
              Join for free
            </Button>
          </>
        )}
        {isAuthenticated && !isLoading && (
          <>
            <Button variant='ghost' size='sm' asChild>
              <Link href='/documents'>Enter Loshon</Link>
            </Button>
            <UserButton />
          </>
        )}
        <ModeToggle />
      </div>
    </div>
  );
};
