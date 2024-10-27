'use client';

import { useParams } from 'next/navigation';

import {
  useDocument,
  useUpdateDocument,
} from '../(routes)/documents/_hooks/use-document';
import { MenuIcon } from 'lucide-react';
import { Title } from './title';
import { useSWRConfig } from 'swr';
import { Banner } from './banner';

interface NavBarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

export const NavBar = ({ isCollapsed, onResetWidth }: NavBarProps) => {
  const params = useParams();
  const { data: document, isLoading } = useDocument(
    params.documentId as string
  );
  const { trigger: triggerUpdate } = useUpdateDocument(
    document?.data || { id: params.documentId as string }
  );
  const { mutate } = useSWRConfig();

  if (isLoading) {
    return (
      <nav className='bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4'>
        <Title.Skeleton />
      </nav>
    );
  }

  const onUpdateTitle = (title: string) => {
    triggerUpdate(
      { body: JSON.stringify({ title }) },
      {
        optimisticData: {
          ...document,
          data: { ...document?.data, title: title },
        },
        onSuccess: (data) => {
          console.log(data);
          const swrKey = `documents${
            document?.data.parentDocumentId
              ? `?parentDocument=${document.data.parentDocumentId}`
              : ''
          }`;
          mutate(swrKey);
        },
        onError: (err) => {
          console.log(err);
        },
        rollbackOnError: true,
      }
    );
  };

  if (!document || !document.data) {
    return (
      <nav className='bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4'>
        <Title.Skeleton />
      </nav>
    );
  }

  return (
    <>
      <nav className='bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4'>
        {isCollapsed && (
          <MenuIcon
            role='button'
            onClick={onResetWidth}
            className='h-6 w-6 text-muted-foreground'
          />
        )}
        <div className='flex items-center justify-between w-full'>
          <Title document={document.data} onUpdate={onUpdateTitle} />
        </div>
      </nav>
      {document.data.isArchived && <Banner document={document.data} />}
    </>
  );
};
