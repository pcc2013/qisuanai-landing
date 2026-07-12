// D:\nira-app\src\store\useDiaryStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DiaryEntry {
  id: string;
  content: string;
  createdAt: number;
}

interface DiaryState {
  entries: DiaryEntry[];
  addDiary: (content: string) => void;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export const useDiaryStore = create<DiaryState>()(
  persist(
    (set, get) => ({
      entries: [],
      addDiary: (content: string) => {
        const entry: DiaryEntry = { id: generateId(), content, createdAt: Date.now() };
        set({ entries: [entry, ...get().entries] });
      },
    }),
    { name: 'nira-diary-store' }
  )
);