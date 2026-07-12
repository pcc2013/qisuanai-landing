// D:\nira-app\src\store\useInviteStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface InviteState {
  inviteCode: string | null;
  invitedBy: string | null;
  invitees: string[];
  totalInviteRewards: number;

  setInviteCode: (code: string) => void;
  setInvitedBy: (code: string) => void;
  addInvitee: (userId: string) => void;
  claimInviteReward: (inviteCode: string, newUserId: string) => Promise<void>;
}

export const useInviteStore = create<InviteState>()(
  persist(
    (set, get) => ({
      inviteCode: null,
      invitedBy: null,
      invitees: [],
      totalInviteRewards: 0,

      setInviteCode: (code) => set({ inviteCode: code }),
      setInvitedBy: (code) => set({ invitedBy: code }),

      addInvitee: (userId) => {
        set((state) => ({
          invitees: [...state.invitees, userId],
        }));
      },

      claimInviteReward: async (inviteCode: string, newUserId: string) => {
        // 后端部署后替换为真实 API 调用
        // await fetch('/api/v1/invite/claim', { method: 'POST', body: JSON.stringify({ inviteCode, newUserId }) });
        console.log('[InviteStore] claimInviteReward:', inviteCode, newUserId);
        set((state) => ({
          totalInviteRewards: state.totalInviteRewards + 50,
          invitees: [...state.invitees, newUserId],
        }));
      },
    }),
    {
      name: 'nira-invite-store',
      partialize: (state) => ({
        inviteCode: state.inviteCode,
        invitedBy: state.invitedBy,
        invitees: state.invitees,
        totalInviteRewards: state.totalInviteRewards,
      }),
    }
  )
);