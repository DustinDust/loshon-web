import { Document, UpdateDocument } from '@/lib/types';
import { create } from 'zustand';

type DocumentStores = {
  insertDocument: (document: Document) => void;
  updateById: (id: string, data: UpdateDocument) => void;
  store: {
    [key: string]: Document;
  };
  totalCount: number;
};

export const useDocumentsStore = create<DocumentStores>((set, get) => {
  return {
    store: {},
    totalCount: 0,
    updateById: (id, data) => {
      const store = get().store;
      if (store[id]) {
        store[id] = { ...store[id], ...data };
      }
      console.log(store[id]);
      set(() => ({ store: store }));
    },
    insertDocument: (data) => {
      const store = get().store;
      let totalCount = get().totalCount;
      if (!store[data.id]) {
        totalCount += 1;
      }
      store[data.id] = data;
      set(() => ({ store: store, totalCount: totalCount }));
    },
  };
});
