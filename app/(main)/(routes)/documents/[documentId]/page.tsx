'use client';

import { Toolbar } from '@/app/(main)/_components/toolbar';
import { useDocument, useUpdateDocument } from '../_hooks/use-document';
import { HttpError, UpdateDocument } from '@/lib/types';
import { useEffect } from 'react';
import { useCurrentDocument } from '@/hooks/use-current-document';
import { useDocumentsStore } from '@/hooks/use-documents-store';
import { Cover } from '@/app/(main)/_components/cover';

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
  } = useDocument(params.documentId);
  const { setCurrent, patchCurrent, currentDocument } = useCurrentDocument();
  const { updateById } = useDocumentsStore();

  useEffect(() => {
    if (!isLoading && !error && remoteDocumentResponse?.data) {
      setCurrent(remoteDocumentResponse.data);
    }
  }, [remoteDocumentResponse, isLoading, error, setCurrent]);

  const { trigger: triggerUpdate } = useUpdateDocument(
    currentDocument || { id: params.documentId }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!!error || !remoteDocumentResponse?.data || !currentDocument) {
    console.log(error);
    return <div>Not Found</div>;
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

  return (
    <div className='pb-40'>
      <Cover url={currentDocument.coverImage} />
      <div className='md-max-w-3xl lg:max-w-4xl mx-auto'>
        <Toolbar
          document={currentDocument}
          onUpdate={onUpdate}
          onChange={onChange}
        />
      </div>
    </div>
  );
};
export default DocumentIdPage;
