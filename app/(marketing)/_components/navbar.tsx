'use client';

import {
  SignInButton,
  SignUpButton,
  UserButton,
  useSession,
} from '@clerk/nextjs';
import Link from 'next/link';

import { useScrollTop } from '@/hooks/use-scroll-top';
import { cn } from '@/lib/utils';
import Logo from './logo';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/spinner';

export const NavBar = () => {
  const scrolled = useScrollTop();
  const { isLoaded, isSignedIn } = useSession();

  return (
    <div
      className={cn(
        'z-50 bg-background fixed top-0 flex items-center w-full px-6 py-2 dark:bg-[--background]',
        scrolled && 'border-b shadow-sm bg-white'
      )}
    >
      <Logo />
      <div className='md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2'>
        {!isLoaded && <Spinner />}
        {isLoaded && !isSignedIn && (
          <>
            <SignInButton mode='modal'>
              <Button variant='ghost'>Sign-in</Button>
            </SignInButton>
            <SignUpButton mode='modal'>
              <Button size='sm'>Join for free</Button>
            </SignUpButton>
          </>
        )}
        {isSignedIn && isLoaded && (
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
