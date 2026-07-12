// D:\nira-app\src\store\useCheckinStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useQSStore } from './useQSStore';

interface CheckinState {
  lastCheckinDate: string | null;
  streak: number;
  canCheckin: boolean;
  checkin: () => void;
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

function calcReward(streak: number): number {
  // 1天5QS，2天6QS，递增，每30天重置
  const cycle = (streak - 1) % 30;
  return 5 + cycle;
}

export const useCheckinStore = create<CheckinState>()(
  persist(
    (set, get) => {
      const today = getToday();
      const last = localStorage.getItem('nira_last_checkin_date');
      const isNewDay = last !== today;

      let currentStreak = parseInt(localStorage.getItem('nira_checkin_streak') || '0');
      if (!isNewDay && last) {
        const yesterday = getYesterday();
        if (last !== yesterday && last !== today) {
          currentStreak = 0;
        }
      }

      return {
        lastCheckinDate: last,
        streak: currentStreak,
        canCheckin: isNewDay,

        checkin: () => {
          if (!get().canCheckin) return;
          const today = getToday();
          const newStreak = get().streak + 1;
          const reward = calcReward(newStreak);

          useQSStore.getState().addQS(reward, `Daily check-in day ${newStreak}`);
          localStorage.setItem('nira_last_checkin_date', today);
          localStorage.setItem('nira_checkin_streak', String(newStreak));

          set({
            lastCheckinDate: today,
            streak: newStreak,
            canCheckin: false,
          });
        },
      };
    },
    {
      name: 'nira-checkin-store',
      onRehydrateStorage: () => (state) => {
        if (state) {
          const today = getToday();
          state.canCheckin = state.lastCheckinDate !== today;
        }
      },
    }
  )
);