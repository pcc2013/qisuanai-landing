// D:\nira-app\src\store\useMenuStore.ts

import { create } from 'zustand';

interface MenuState {
  isOpen: boolean;
  toggleMenu: () => void;
  openMenu: () => void;
  closeMenu: () => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  isOpen: false,
  toggleMenu: () => set((s) => ({ isOpen: !s.isOpen })),
  openMenu: () => set({ isOpen: true }),
  closeMenu: () => set({ isOpen: false }),
}));