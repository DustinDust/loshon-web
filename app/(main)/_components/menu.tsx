'use client';

import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Trash } from 'lucide-react';

import { useArchiveDocument } from '../(routes)/documents/_hooks/use-document';
import { Document, HttpError } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface MenuProps {
  document: Document;
}

export const Menu = ({ document }: MenuProps) => {
  const router = useRouter();
  const { user } = useUser();
  const { trigger: triggerArchive } = useArchiveDocument(document);

  const onArchive = () => {
    const loadingToast = toast.loading('Moving to trash...');
    triggerArchive(
      {},
      {
        onError: (err: HttpError) => {
          console.log(err);
          toast.dismiss(loadingToast);
          toast.error(`Error: ${err.message}`);
        },
        onSuccess: () => {
          toast.dismiss(loadingToast);
          toast.success('Success!');
          router.push('/documents');
        },
      }
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size='sm' variant='ghost'>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-60'
        align='end'
        alignOffset={8}
        forceMount
      >
        <DropdownMenuItem onClick={onArchive} disabled={document.isArchived}>
          <Trash className='h-4 w-4 mr-2' />
          Move to trash
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className='text-xs text-muted-foreground p-2'>
          Last edited by {user?.username}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

Menu.Skeleton = function MenuSkeleton() {
  return <Skeleton className='h-10 w-10' />;
};
