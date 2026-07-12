// D:\nira-app\src\store\useQSStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Transaction {
  id: string;
  amount: number;
  type: 'recharge' | 'deduct';
  reason: string;
  time: string;
}

interface QSState {
  qsBalance: number;
  isInsufficient: boolean;
  transactions: Transaction[];
  deductQS: (amount: number, reason: string) => boolean;
  addQS: (amount: number, reason: string) => void;
  setInsufficient: (status: boolean) => void;
  clearTransactions: () => void;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export const useQSStore = create<QSState>()(
  persist(
    (set, get) => ({
      qsBalance: 0,
      isInsufficient: false,
      transactions: [],

      deductQS: (amount, reason) => {
        if (amount <= 0) return false;
        const current = get().qsBalance;
        if (current < amount) {
          set({ isInsufficient: true });
          return false;
        }
        const tx: Transaction = {
          id: generateId(),
          amount,
          type: 'deduct',
          reason,
          time: new Date().toISOString(),
        };
        set({
          qsBalance: current - amount,
          isInsufficient: false,
          transactions: [...get().transactions, tx],
        });
        return true;
      },

      addQS: (amount, reason) => {
        if (amount <= 0) return;
        const tx: Transaction = {
          id: generateId(),
          amount,
          type: 'recharge',
          reason,
          time: new Date().toISOString(),
        };
        set({
          qsBalance: get().qsBalance + amount,
          isInsufficient: false,
          transactions: [...get().transactions, tx],
        });
      },

      setInsufficient: (status) => set({ isInsufficient: status }),

      clearTransactions: () => set({ transactions: [] }),
    }),
    {
      name: 'nira-qs-store',
    }
  )
);