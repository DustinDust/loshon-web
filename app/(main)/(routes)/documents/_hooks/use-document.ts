import { useClerkSWR, useMutateClerkSWR } from '@/hooks/use-clerk-swr';
import { type Document } from '@/lib/types';

export function useDocuments() {
  return useClerkSWR<Document[]>('document', 'document');
}

export function useCreateDocument() {
  return useMutateClerkSWR<Partial<Document>>('document', 'document', {
    method: 'POST',
  });
}
