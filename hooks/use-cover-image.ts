import { create } from 'zustand';

type CoverImageStore = {
  url?: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onReplace: (url: string) => void;
};

export const useCoverImage = create<CoverImageStore>((set) => ({
  isOpen: false,
  url: undefined,
  onOpen: () => set(() => ({ isOpen: true, url: undefined })),
  onClose: () => set(() => ({ isOpen: false, url: undefined })),
  onReplace: (url) => set({ isOpen: true, url: url }),
}));
