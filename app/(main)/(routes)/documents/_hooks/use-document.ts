import { useAuth } from '@clerk/nextjs';
import useSWRMutation from 'swr/mutation';

import { useClerkSWR, useMutateClerkSWR } from '@/hooks/use-clerk-swr';
import { Document, HttpError } from '@/lib/types';
import { getMutateKeyByDocument } from '@/lib/utils';

export function useDocuments(parentId?: string) {
  let key = 'documents';
  let path = 'documents';

  if (parentId) {
    key += `?parentDocument=${parentId}`;
    path += `?parentDocument=${parentId}`;
  }
  return useClerkSWR<Document[]>(key, path);
}

export function useDocument(id: string) {
  const key = `documents/${id}`;
  const path = `documents/${id}`;

  return useClerkSWR<Document>(key, path);
}

export const useArchivesDocument = () => {
  const key = 'archives/documents';
  const path = 'documents/_archives';

  return useClerkSWR<Document[]>(key, path);
};

export function useCreateDocument() {
  return useMutateClerkSWR<Partial<Document>>('documents', 'documents', {
    method: 'POST',
  });
}

export function useUpdateDocument(document: Pick<Document, 'id'>) {
  const { getToken } = useAuth();
  const baseURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/documents/${document.id}`;

  const fetcher = async (_: string, { arg }: { arg: RequestInit }) => {
    const res = await fetch(baseURL, {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
        'Content-Type': `application/json`,
      },
      method: 'PATCH',
      ...arg,
    });
    if (!res.ok) {
      const err = new HttpError('Error updating data');
      err.status = res.status;
      err.info = await res.json();
      throw err;
    }
    return res.json();
  };
  return useSWRMutation(`documents/${document.id}`, fetcher);
}

export const useArchiveDocument = (
  document: Pick<Document, 'id' | 'parentDocumentId'>
) => {
  const { getToken } = useAuth();
  const baseURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/documents/${document.id}`;
  const key = getMutateKeyByDocument(document);

  const fetcher = async (_: string, { arg }: { arg: RequestInit }) => {
    const res = await fetch(baseURL, {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      ...arg,
    });
    if (!res.ok) {
      const err = new HttpError('Error archiving data');
      err.status = res.status;
      err.info = await res.json();
      throw err;
    }
    return res.json();
  };
  return useSWRMutation(key, fetcher);
};

export const useRestoreDocument = () => {
  const { getToken } = useAuth();
  const baseURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/documents/_restore`;

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

  return useSWRMutation('archives/documents', fetcher);
};

export const useDeleteDocument = () => {
  const { getToken } = useAuth();
  const baseURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/documents/_delete`;
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
  return useSWRMutation('archives/documents', fetcher);
};
