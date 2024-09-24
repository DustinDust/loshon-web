'use client';

import { signOut, useSession } from 'next-auth/react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export const UserButton = () => {
  const session = useSession();

  if (!session.data) {
    return null;
  }

  const userProfilePic =
    session.data?.user?.image ||
    'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg';

  const userName = session.data?.user?.name;

  const handleLogout = () => {
    signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='rounded-full'>
        <Avatar>
          <AvatarImage src={userProfilePic} />
          {!!userName && (
            <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{userName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
