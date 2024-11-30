'use client';

import { useRouter } from 'next/navigation';
import { useSWRConfig } from 'swr';
import { toast } from 'sonner';

import {
  useDeleteDocument,
  useRestoreDocument,
} from '../(routes)/documents/_hooks/use-document';
import { Document, HttpError } from '@/lib/types';
import { getMutateKeyByDocument } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/modals/confirm-modal';

interface BannerProps {
  document: Document;
}

export const Banner = ({ document }: BannerProps) => {
  const router = useRouter();

  const { trigger: triggerDelete } = useDeleteDocument();
  const { trigger: triggerRestore } = useRestoreDocument();

  const { mutate } = useSWRConfig();

  const onRemove = () => {
    const loadingToast = toast.loading('Deleting document...');
    triggerDelete(
      { documentId: document.id },
      {
        onSuccess: () => {
          toast.dismiss(loadingToast);
          toast.success('Success!');
          router.push('/documents');
        },
        onError: (err: HttpError) => {
          console.log(err);
          toast.dismiss(loadingToast);
          toast.error(`Error! ${err.message}`);
        },
      }
    );
  };

  const onRestore = () => {
    const loadingToast = toast.loading('Restoring document...');
    triggerRestore(
      { documentId: document.id },
      {
        onSuccess: () => {
          toast.dismiss(loadingToast);
          toast.success('Success!');
          mutate(getMutateKeyByDocument(document));
          mutate(`documents/${document.id}`);
        },
        onError: (err: HttpError) => {
          console.log(err);
          toast.dismiss(loadingToast);
          toast.error(`Error! ${err.message}`);
        },
      }
    );
  };

  return (
    <div className='w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center'>
      <p>This page is in the Trash box</p>
      <Button
        size='sm'
        onClick={onRestore}
        variant='outline'
        className='border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal'
      >
        Restore page
      </Button>
      <ConfirmModal onConfirm={onRemove}>
        <Button
          size='sm'
          variant='outline'
          className='border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal'
        >
          Delete forever
        </Button>
      </ConfirmModal>
    </div>
  );
};
