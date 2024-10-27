'use client';

import { useRouter } from 'next/navigation';
import {
  useDeleteDocument,
  useRestoreDocument,
} from '../(routes)/documents/_hooks/use-document';
import { toast } from 'sonner';
import { Document, HttpError } from '@/lib/types';
import { useSWRConfig } from 'swr';
import { getMutateKeyByDocument } from '@/lib/utils';

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
        onSuccess: (data) => {
          console.log(data);
          toast.dismiss(loadingToast);
          toast.success('Success!');
        },
        onError: (err: HttpError) => {
          console.log(err);
          toast.dismiss(loadingToast);
          toast.error(`Error! ${err.message}`);
        },
      }
    );

    const onRestore = () => {
      const loadingToast = toast.loading('Deleting document...');
      triggerRestore(
        { documentId: document.id },
        {
          onSuccess: (data) => {
            console.log(data);
            toast.dismiss(loadingToast);
            toast.success('Success!');
            mutate(getMutateKeyByDocument(document));
          },
          onError: (err: HttpError) => {
            console.log(err);
            toast.dismiss(loadingToast);
            toast.error(`Error! ${err.message}`);
          },
        }
      );
    };
  };

  return <div> {document.id}</div>;
};
