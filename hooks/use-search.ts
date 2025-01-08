import { create } from 'zustand';

import { Document } from '@/lib/types';

type SearchStore = {
  isOpen: boolean;
  previewItem?: Document;
  onOpen: () => void;
  onClose: () => void;
  toggle: () => void;
  setPreviewItem: (item: Document | undefined) => void;
};

export const useSearch = create<SearchStore>((set, get) => ({
  isOpen: false,
  onOpen() {
    set({ isOpen: true });
  },
  onClose() {
    set({ isOpen: false });
  },
  toggle() {
    set({ isOpen: !get().isOpen });
  },
  setPreviewItem(item) {
    set({ previewItem: item });
  },
}));
