// D:\nira-app\src\store\useLoginModalStore.ts

import { create } from 'zustand';

interface LoginModalState {
  isShow: boolean;
  showLoginModal: () => void;
  hideLoginModal: () => void;
}

export const useLoginModalStore = create<LoginModalState>((set) => ({
  isShow: false,
  showLoginModal: () => set({ isShow: true }),
  hideLoginModal: () => set({ isShow: false }),
}));