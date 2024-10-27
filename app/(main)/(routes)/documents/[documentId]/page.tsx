'use client';

import { useParams } from 'next/navigation';

import { useDocument } from '../_hooks/use-document';

const DocumentIdPage = () => {
  const params = useParams();
  const { data: document } = useDocument(params.documentId as string);

  return <div>{document?.data.id}</div>;
};
export default DocumentIdPage;
