'use client';

import { useParams } from 'next/navigation';

import { useDocument } from '../_hooks/use-document';
import { Spinner } from '@/components/spinner';

const DocumentIdPage = () => {
  const params = useParams();
  const { data: document, isLoading: isFetching } = useDocument(
    params.documentId as string
  );

  if (isFetching) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }
  return <div>{document?.data.id}</div>;
};
export default DocumentIdPage;
