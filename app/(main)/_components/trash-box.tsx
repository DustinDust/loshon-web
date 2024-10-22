'use client';

import { useRouter } from 'next/navigation';
import useSWRMutation from 'swr/mutation';
import { useAuth } from '@clerk/nextjs';
import { useState } from 'react';
import { Document, HttpError } from '@/lib/types';
import { useClerkSWR } from '@/hooks/use-clerk-swr';
import { toast } from 'sonner';
import { Spinner } from '@/components/spinner';
import { Search, Trash, Undo } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSWRConfig } from 'swr';
import { ConfirmModal } from '@/components/modals/confirm-modal';

const useArchivedDocument = () => {
  return useClerkSWR<Document[]>(`archived/document`, 'archived/document');
};

const useRestoreDocument = () => {
  const { getToken } = useAuth();
  const baseURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/archived/document`;

  const fetcher = async (
    _: string,
    { arg }: { arg: { documentId: string } }
  ) => {
    const res = await fetch(`${baseURL}/${arg.documentId}`, {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
        'Content-Type': `application/json`,
      },
      method: 'PATCH',
    });
    if (!res.ok) {
      const err = new HttpError('Error restoring data');
      err.status = res.status;
      err.info = await res.json();
      throw err;
    }
    return res.json();
  };

  return useSWRMutation('archived/document', fetcher);
};

const useDeleteDocument = () => {
  const { getToken } = useAuth();
  const baseURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/archived/document`;
  const fetcher = async (
    _: string,
    { arg }: { arg: { documentId: string } }
  ) => {
    const res = await fetch(`${baseURL}/${arg.documentId}`, {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = new HttpError('Error Deleting data');
      err.status = res.status;
      err.info = await res.json();
      throw err;
    }
    return res.json();
  };
  return useSWRMutation('archived/document', fetcher);
};

export const TrashBox = () => {
  const router = useRouter();
  // const params = useParams();
  const { data: documents, isLoading: isFetching } = useArchivedDocument();
  const { trigger: triggerRestore } = useRestoreDocument();
  const { trigger: triggerDelete } = useDeleteDocument();
  const { mutate } = useSWRConfig();

  const [search, setSearch] = useState('');
  const filteredDocuments = documents?.data.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const onRestore = (event: React.MouseEvent, documentId: string) => {
    event.stopPropagation();

    const loadingToast = toast.loading('Restoring...');
    triggerRestore(
      { documentId: documentId },
      {
        onSuccess: () => {
          toast.dismiss(loadingToast);
          toast.success('Success!', { duration: 3000 });
          mutate('document');
        },
        onError: (err) => {
          console.log(err);
          toast.dismiss(loadingToast);
          toast.error('Error restoring', { duration: 3000 });
        },
      }
    );
  };

  const onRemove = (documentId: string) => {
    const loadingToast = toast.loading('Permantly deleting...');
    triggerDelete(
      { documentId: documentId },
      {
        onSuccess: () => {
          toast.dismiss(loadingToast);
          toast.success('Success!', { duration: 3000 });
        },
        onError: (err) => {
          console.log(err);
          toast.dismiss(loadingToast);
          toast.error('Error deleting', { duration: 3000 });
        },
      }
    );
  };

  return (
    <div className='text-sm'>
      <div className='flex items-center gap-x-1 p-2'>
        <Search className='h-4 w-4' />
        <Input
          value={search}
          onChange={(ev) => setSearch(ev.target.value)}
          className='h-7 px-2 focus-visible:ring-transparent bg-secondary'
          placeholder='Filter by title...'
        />
      </div>
      {isFetching ? (
        <div className='h-full flex items-center justify-center p-4'>
          <Spinner size='lg' />
        </div>
      ) : (
        <div className='mt-2 px-1 pb-1'>
          <p className='hidden last:block text-cs text-center text-muted-foreground'>
            No documents found.
          </p>
          {filteredDocuments?.map((document) => (
            <div
              key={document.id}
              role='button'
              onClick={() => onClick(document.id)}
              className='text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between'
            >
              <span className='truncate pl-2'>{document.title}</span>
              <div className='flex items-center'>
                <div
                  onClick={(e) => onRestore(e, document.id)}
                  role='button'
                  className='rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                >
                  <Undo className='h-4 w-4 text-muted-foreground' />
                </div>
                <ConfirmModal onConfirm={() => onRemove(document.id)}>
                  <div
                    role='button'
                    className='rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                  >
                    <Trash className='h-4 w-4 text-muted-foreground' />
                  </div>
                </ConfirmModal>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
