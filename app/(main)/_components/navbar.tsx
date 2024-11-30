'use client';

import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { MenuIcon } from 'lucide-react';

import {
  useDocument,
  useUpdateDocument,
} from '../(routes)/documents/_hooks/use-document';
import { Title } from './title';
import { Banner } from './banner';
import { Menu } from './menu';
import { HttpError, UpdateDocument } from '@/lib/types';
import { useCurrentDocument } from '@/hooks/use-current-document';
import { useDocumentsStore } from '@/hooks/use-documents-store';
import { Publish } from './publish';

interface NavBarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

export const NavBar = ({ isCollapsed, onResetWidth }: NavBarProps) => {
  const params = useParams();
  const { isLoading, error } = useDocument(params.documentId as string, {
    refreshInterval: 0,
    shouldRetryOnError: false,
    revalidateIfStale: false,
  });
  const { currentDocument, patchCurrent } = useCurrentDocument();
  const { updateById } = useDocumentsStore();

  const { trigger: triggerUpdate } = useUpdateDocument(
    currentDocument || { id: params.documentId as string }
  );

  if (error && !isLoading) {
    return null;
  }

  if (!currentDocument || isLoading) {
    return (
      <nav className='bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center justify-between gap-x-4'>
        <Title.Skeleton />
        <div className='flex items gap-x-2'>
          <Menu.Skeleton />
        </div>
      </nav>
    );
  }

  const onUpdateTitle = (title: string) => {
    triggerUpdate(
      { body: JSON.stringify({ title }) },
      {
        optimisticData: { data: { ...currentDocument, title } },
        onError: (err: HttpError) => {
          console.log(err);
          toast.error(err.message);
        },
        rollbackOnError: true,
      }
    );
  };

  const onChange = (data: UpdateDocument) => {
    patchCurrent(data);
    updateById(currentDocument.id, data);
  };

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
          <Title
            document={currentDocument}
            onUpdate={onUpdateTitle}
            onChange={onChange}
          />
          <div className='flex items-center gap-x-2'>
            <Publish document={currentDocument} onChange={onChange} />
            <Menu document={currentDocument} />
          </div>
        </div>
      </nav>
      {currentDocument.isArchived && <Banner document={currentDocument} />}
    </>
  );
};
