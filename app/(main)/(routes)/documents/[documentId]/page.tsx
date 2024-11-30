'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo } from 'react';

import { Toolbar } from '@/app/(main)/_components/toolbar';
import { useDocument, useUpdateDocument } from '../_hooks/use-document';
import { HttpError, UpdateDocument } from '@/lib/types';
import { useCurrentDocument } from '@/hooks/use-current-document';
import { useDocumentsStore } from '@/hooks/use-documents-store';
import { Cover } from '@/app/(main)/_components/cover';
import { Skeleton } from '@/components/ui/skeleton';
import { Error } from '@/components/error';
import { NotFound } from '@/components/not-found';

interface DocumentIdPageProps {
  params: {
    documentId: string;
  };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const {
    data: remoteDocumentResponse,
    isLoading,
    error,
  } = useDocument(params.documentId, {
    shouldRetryOnError: false,
    refreshInterval: 0,
    revalidateIfStale: false,
  });
  const { setCurrent, patchCurrent, currentDocument } = useCurrentDocument();
  const { updateById } = useDocumentsStore();
  const Editor = useMemo(
    () => dynamic(() => import('@/components/editor'), { ssr: false }),
    []
  );

  useEffect(() => {
    if (!isLoading && !error && remoteDocumentResponse?.data) {
      setCurrent(remoteDocumentResponse.data);
    }
  }, [remoteDocumentResponse, isLoading, error, setCurrent]);

  const { trigger: triggerUpdate } = useUpdateDocument(
    currentDocument || { id: params.documentId }
  );

  if (isLoading) {
    return (
      <div>
        <Cover.Skeleton />
        <div className='md:max-w-3xl lg:max-w-4xl mx-auto mt-10'>
          <div className='space-y-4 pl-8 pt-4'>
            <Skeleton className='h-14 w-[50%]' />
            <Skeleton className='h-4 w-[80%]' />
            <Skeleton className='h-4 w-[40%]' />
            <Skeleton className='h-4 w-[60%]' />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    if (error.status === 404) {
      return <NotFound />;
    } else return <Error />;
  }

  if (!remoteDocumentResponse?.data || !currentDocument) {
    return <NotFound />;
  }

  const onUpdate = (data: UpdateDocument) => {
    if (data.title === remoteDocumentResponse.data.title) {
      return;
    }
    triggerUpdate(
      {
        body: JSON.stringify({ ...data }),
      },
      {
        optimisticData: { data: { ...currentDocument, ...data } },
        onError: (error: HttpError) => {
          console.log(error);
        },
        rollbackOnError: true,
      }
    );
  };

  const onChange = (data: UpdateDocument) => {
    patchCurrent(data);
    updateById(currentDocument.id, data);
  };

  const onEditorContentChange = (content: string, mdContent: string) => {
    onChange({ content: content });
    onUpdate({ content: content, mdContent: mdContent });
  };

  return (
    <div className='pb-40'>
      <Cover url={currentDocument.coverImage} />
      <div className='md-max-w-3xl lg:max-w-4xl mx-auto'>
        <Toolbar
          document={currentDocument}
          onUpdate={onUpdate}
          onChange={onChange}
        />
        <Editor onChange={onEditorContentChange} />
      </div>
    </div>
  );
};
export default DocumentIdPage;
