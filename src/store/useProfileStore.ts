// D:\nira-app\src\store\useProfileStore.ts

import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';

const AVATARS = [
  '/personas/heal/avatar/anwen.jpg',
  '/personas/casual/avatar/xiao_c.jpg',
  '/personas/eastern_philosophy/avatar/taibai.jpg',
  '/personas/business/avatar/elena_nb.jpg',
  '/personas/sport/avatar/kai_male.jpg',
  '/personas/art/avatar/muse_yellow.jpg',
];

interface ProfileState {
  nickname: string;
  avatarIndex: number;
  getNickname: () => string;
  getAvatarUrl: () => string;
  setNickname: (name: string) => void;
  setAvatarIndex: (index: number) => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  nickname: '',
  avatarIndex: Math.floor(Math.random() * 6),

  getNickname: () => {
    const stored = get().nickname;
    if (stored) return stored;
    const user = useAuthStore.getState().currentUser;
    return user || 'Nira User';
  },

  getAvatarUrl: () => {
    return AVATARS[get().avatarIndex] || AVATARS[0];
  },

  setNickname: (name: string) => set({ nickname: name }),
  setAvatarIndex: (index: number) => set({ avatarIndex: index % AVATARS.length }),
}));