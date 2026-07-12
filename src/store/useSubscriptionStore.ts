// D:\nira-app\src\store\useSubscriptionStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Tier = 'free' | 'monthly' | 'semi_annual' | 'annual';

const TIER_CONFIG: Record<Tier, {
  memoryDays: number;
  freeVoiceMinutesPerDay: number;
  freeTextPerDay: number;
  hasDigitalHumanVideo: boolean;
  hasAiClone: boolean;
  responseSpeed: 'normal' | 'fast' | 'ultra' | 'priority';
  relationshipOpen: boolean;
  hasCreatorMode: boolean;
}> = {
  free: {
    memoryDays: 3, freeVoiceMinutesPerDay: 3, freeTextPerDay: 30,
    hasDigitalHumanVideo: false, hasAiClone: false,
    responseSpeed: 'normal', relationshipOpen: false,
    hasCreatorMode: false,
  },
  monthly: {
    memoryDays: 50, freeVoiceMinutesPerDay: 15, freeTextPerDay: 999,
    hasDigitalHumanVideo: true, hasAiClone: false,
    responseSpeed: 'fast', relationshipOpen: true,
    hasCreatorMode: true,
  },
  semi_annual: {
    memoryDays: 300, freeVoiceMinutesPerDay: 15, freeTextPerDay: 999,
    hasDigitalHumanVideo: true, hasAiClone: false,
    responseSpeed: 'ultra', relationshipOpen: true,
    hasCreatorMode: true,
  },
  annual: {
    memoryDays: 9999, freeVoiceMinutesPerDay: 15, freeTextPerDay: 999,
    hasDigitalHumanVideo: true, hasAiClone: true,
    responseSpeed: 'priority', relationshipOpen: true,
    hasCreatorMode: true,
  },
};

const QS_BONUS: Record<string, number> = {
  monthly: 900,       // 600 + 300
  semi_annual: 5200,  // 3200 + 2000
  annual: 11000,      // 5000 + 6000
};

interface SubscriptionState {
  currentTier: Tier;
  expiryDate: string | null;
  memoryDays: number;
  freeVoiceMinutesPerDay: number;
  freeTextPerDay: number;
  hasDigitalHumanVideo: boolean;
  hasAiClone: boolean;
  responseSpeed: 'normal' | 'fast' | 'ultra' | 'priority';
  relationshipOpen: boolean;
  hasCreatorMode: boolean;

  setSubscription: (tier: Tier, expiry: string) => void;
  canDisablePrivacyGuard: () => boolean;
  checkExpiry: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      currentTier: 'free',
      expiryDate: null,
      ...TIER_CONFIG['free'],

      setSubscription: (tier, expiry) => {
        const config = TIER_CONFIG[tier] || TIER_CONFIG['free'];
        set({ currentTier: tier, expiryDate: expiry, ...config });
        const bonus = QS_BONUS[tier] || 0;
        if (bonus > 0) {
          import('./useQSStore').then(({ useQSStore }) => {
            useQSStore.getState().addQS(bonus, `Subscription bonus - ${tier}`);
          });
        }
      },

      canDisablePrivacyGuard: () => get().currentTier === 'annual',

      checkExpiry: () => {
        const s = get();
        if (s.expiryDate && new Date(s.expiryDate) < new Date()) {
          set({ currentTier: 'free', expiryDate: null, ...TIER_CONFIG['free'] });
        }
      },
    }),
    {
      name: 'nira-subscription-store',
      onRehydrateStorage: () => (state) => { if (state) state.checkExpiry(); },
    }
  )
);