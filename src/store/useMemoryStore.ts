import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MemoryCard {
  id: string;
  title: string;
  content: string;
  emotion: string;
  createdAt: number;
  updatedAt: number;
  isLicensable: boolean;
  licensableChangedAt?: number;
}

interface MemoryState {
  cards: MemoryCard[];
  isLoading: boolean;

  setCards: (cards: MemoryCard[]) => void;
  addCard: (card: MemoryCard) => void;
  updateCard: (id: string, updates: Partial<MemoryCard>) => void;
  removeCard: (id: string) => void;
  toggleLicensable: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useMemoryStore = create<MemoryState>()(
  persist(
    (set) => ({
      cards: [],
      isLoading: false,

      setCards: (cards) => set({ cards }),
      addCard: (card) => set((state) => ({ cards: [{ ...card, isLicensable: false }, ...state.cards] })),
      updateCard: (id, updates) =>
        set((state) => ({
          cards: state.cards.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: Date.now() } : c)),
        })),
      removeCard: (id) => set((state) => ({ cards: state.cards.filter((c) => c.id !== id) })),
      toggleLicensable: (id) =>
        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === id
              ? { ...c, isLicensable: !c.isLicensable, licensableChangedAt: Date.now(), updatedAt: Date.now() }
              : c
          ),
        })),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    { name: 'nira-memory-storage' }
  )
);