'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo } from 'react';

import { Toolbar } from '@/app/(main)/_components/toolbar';
import { useDocument } from '@/app/(main)/(routes)/documents/_hooks/use-document';
import { useCurrentDocument } from '@/hooks/use-current-document';
import { Cover } from '@/app/(main)/_components/cover';
import { Skeleton } from '@/components/ui/skeleton';
import { Error } from '@/components/error';
import { NotFound } from '@/components/not-found';
import { NavBar } from '@/app/(marketing)/_components/navbar';

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
  const { setCurrent, currentDocument } = useCurrentDocument();
  const Editor = useMemo(
    () => dynamic(() => import('@/components/editor'), { ssr: false }),
    []
  );

  useEffect(() => {
    if (!isLoading && !error && remoteDocumentResponse?.data) {
      setCurrent(remoteDocumentResponse.data);
    }
  }, [remoteDocumentResponse, isLoading, error, setCurrent]);
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

  return (
    <div className='pb-40'>
      <NavBar />
      <Cover url={currentDocument.coverImage} preview />
      <div className='md-max-w-3xl lg:max-w-4xl mx-auto'>
        <Toolbar
          document={currentDocument}
          onUpdate={() => {}}
          onChange={() => {}}
          preview
        />
        <Editor onChange={() => {}} editable={false} />
      </div>
    </div>
  );
};
export default DocumentIdPage;
