import { Document, UpdateDocument } from '@/lib/types';
import { create } from 'zustand';

type CurrentDocumentStore = {
  currentDocument?: Document;
  setCurrent: (data: Document) => void;
  patchCurrent: (data: UpdateDocument) => void;
};

export const useCurrentDocument = create<CurrentDocumentStore>((set, get) => {
  return {
    setCurrent: (data) => {
      set(() => ({ currentDocument: data }));
    },
    patchCurrent: (data) => {
      const state = get();
      const current = state.currentDocument;
      if (current) {
        set(() => ({
          currentDocument: {
            ...current,
            ...data,
          },
        }));
      }
    },
  };
});
