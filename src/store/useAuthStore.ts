// D:\nira-app\src\store\useAuthStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchUserState, UserState } from '../adapters/apiClient';
import { useChatStore } from './useChatStore';
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle as firebaseLoginWithGoogle,
  logoutFirebase,
  onAuthChange,
} from '../adapters/auth';

 function generateNiraId(): string {
  const digits = '0123456789';
  let id = 'Nira';
  for (let i = 0; i < 5; i++) id += digits[Math.floor(Math.random() * 10)];
  return id;
}

interface AuthState {
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    niraId: string;
  } | null;
  token: string | null;
  isAuthenticated: boolean;
  userState: UserState | null;
  isRestoring: boolean;

  setUser: (user: AuthState['user']) => void;
  setToken: (token: string) => void;
  updateProfile: (data: { displayName?: string; photoURL?: string }) => void;
  logout: () => void;
  restoreUserState: (userId: string) => Promise<void>;
  login: (email: string, password: string, gender?: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  initAuthListener: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      userState: null,
      isRestoring: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),

      updateProfile: (data) => {
        const current = get().user;
        if (!current) return;
        set({
          user: {
            ...current,
            displayName: data.displayName ?? current.displayName,
            photoURL: data.photoURL ?? current.photoURL,
          },
        });
      },

      logout: async () => {
        await logoutFirebase();
        set({ user: null, token: null, isAuthenticated: false, userState: null });
      },

      restoreUserState: async (userId: string) => {
        if (get().isRestoring) return;
        set({ isRestoring: true });
        try {
          const state = await fetchUserState(userId);
          set({ userState: state, isRestoring: false });
          if (state.intimacy_level !== undefined) {
            useChatStore.getState().setIntimacy(state.intimacy_level, 0);
          }
        } catch (error) {
          console.error('[useAuthStore] 恢复用户状态失败:', error);
          set({ isRestoring: false });
        }
      },

      login: async (email: string, password: string, gender?: string) => {
        const userCredential = await registerWithEmail(email, password);
        const firebaseUser = userCredential.user;

        set({
          user: {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || generateNiraId(),
            photoURL: firebaseUser.photoURL || '/nira_logo.png',
            niraId: generateNiraId(),
          },
          token: await firebaseUser.getIdToken(),
          isAuthenticated: true,
        });
      },

      googleLogin: async () => {
        const userCredential = await firebaseLoginWithGoogle();
        const firebaseUser = userCredential.user;

        set({
          user: {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || generateNiraId(),
            photoURL: firebaseUser.photoURL || '/nira_logo.png',
            niraId: generateNiraId(),
          },
          token: await firebaseUser.getIdToken(),
          isAuthenticated: true,
        });
      },

      initAuthListener: () => {
        onAuthChange(async (firebaseUser) => {
          if (firebaseUser) {
            const existing = get().user;
            set({
              user: {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName || existing?.displayName || generateNiraId(),
                photoURL: firebaseUser.photoURL || existing?.photoURL || '/nira_logo.png',
                niraId: existing?.niraId || generateNiraId(),
              },
              token: await firebaseUser.getIdToken(),
              isAuthenticated: true,
            });
            get().restoreUserState(firebaseUser.uid);
          } else {
            set({ user: null, token: null, isAuthenticated: false, userState: null });
          }
        });
      },
    }),
    {
      name: 'nira-auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);