'use client';

import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useCreateDocument } from './_hooks/use-document';
import { Document, TResponse } from '@/lib/types';
import { useRouter } from 'next/navigation';

const DocumentPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { trigger: triggerCreate } = useCreateDocument();

  const handleCreate = () => {
    const loadingToast = toast.loading('Creating note...');
    triggerCreate(
      { title: 'Untitled', isArchived: false, isPublished: false },
      {
        onSuccess: (data: TResponse<Document>) => {
          toast.dismiss(loadingToast);
          toast.success('Success!');
          router.push(`/documents/${data.data.id}`);
        },
        onError: (err) => {
          console.log(err);
          toast.dismiss(loadingToast);
          toast.error('Error creating a new note');
        },
      }
    );
  };
  return (
    <div className='h-full flex flex-col items-center justify-center space-y-4'>
      <Image
        src='/empty.svg'
        height={300}
        width={300}
        alt='Empty'
        className='dark:hidden'
      />
      <Image
        src='/empty-dark.svg'
        height={301}
        width={300}
        alt='Empty'
        className='hidden dark:block'
      />
      <h2 className='text-lg font-medium'>Welcome back, {user?.firstName}!</h2>
      <Button onClick={handleCreate}>
        <PlusCircle className='h-4 w-4 mr-2' />
        Create a note
      </Button>
    </div>
  );
};
export default DocumentPage;
