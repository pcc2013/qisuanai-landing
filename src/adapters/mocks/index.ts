// D:\nira-app\src\adapters\mocks\index.ts

import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore } from '../../store/useChatStore';
import { useQSStore } from '../../store/useQSStore';
import { useSeedStore } from '../../store/useSeedStore';

export const mockAuth = {
  async register(email: string, password: string) {
    return { uid: 'mock_' + Date.now(), email };
  },
  async login(email: string, password: string) {
    return { uid: 'mock_' + Date.now(), email };
  },
  async googleLogin() {
    return { uid: 'google_' + Date.now(), email: 'google.user@gmail.com' };
  },
};

export const mockChat = {
  async getReply(personaId: string, message: string): Promise<string> {
    const replies: Record<string, string[]> = {
      heal: ["I'm here for you.", 'Take your time.', 'I understand how you feel.'],
      casual: ['Haha, interesting!', 'Sounds fun!', "Let's chat～"],
    };
    const list = replies[personaId] || replies['heal'];
    return list[Math.floor(Math.random() * list.length)];
  },
};

export const mockBilling = {
  async getBalance(): Promise<number> {
    return useQSStore.getState().qsBalance;
  },
  async deduct(amount: number, reason: string): Promise<boolean> {
    return useQSStore.getState().deductQS(amount, reason);
  },
};

export const mockSeed = {
  getLevel(): string {
    return useSeedStore.getState().level;
  },
};