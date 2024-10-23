'use client';

import { useSession } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';

import { Spinner } from '@/components/spinner';
import { Navigation } from './_components/navigation';
import { SearchCommand } from '@/components/search-command';

// Use layout to protect pages
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useSession();

  if (!isLoaded) {
    return (
      <div className='h-full flex items-center justify-center'>
        <Spinner size='lg' />
      </div>
    );
  }

  if (!isSignedIn) {
    return redirect('/');
  }

  return (
    <div className='h-full flex dark:bg-[#1f1f1f]'>
      <SearchCommand />
      <Navigation />
      <main className='flex-1 h-full overflow-y-auto'>{children}</main>
    </div>
  );
};

export default MainLayout;
