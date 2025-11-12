// src/store/useModalStore.ts
import { create } from 'zustand';

interface ModalStore {
  isAiFinderModalOpen: boolean;
  openAiFinderModal: () => void;
  closeAiFinderModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isAiFinderModalOpen: false,
  openAiFinderModal: () => set({ isAiFinderModalOpen: true }),
  closeAiFinderModal: () => set({ isAiFinderModalOpen: false }),
}));