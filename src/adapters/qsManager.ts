// D:\nira-app\src\adapters\qsManager.ts

import { useQSStore } from '../store/useQSStore';
import { BACKEND_CONFIG } from '../config/backend';

export interface RechargeRecord {
  id: string;
  amount: number; // QS 数量
  time: string;
  paymentMethod: string;
}

export interface ConsumeRecord {
  id: string;
  amount: number; // QS 数量
  reason: string;
  time: string;
}

export interface StripePaymentInfo {
  paymentIntentId: string;
}

export const qsManagerAdapter = {
  async getBalance(userId: string): Promise<number> {
    return useQSStore.getState().qsBalance;
  },

  async deductQS(userId: string, amount: number, reason: string): Promise<boolean> {
    return useQSStore.getState().deductQS(amount, reason);
  },

  async getRechargeRecords(userId: string): Promise<RechargeRecord[]> {
    const txs = useQSStore.getState().transactions;
    return txs
      .filter((t) => t.type === 'recharge')
      .map((t) => ({
        id: t.id,
        amount: t.amount,
        time: t.time,
        paymentMethod: 'Stripe',
      }));
  },

  async getConsumeRecords(userId: string): Promise<ConsumeRecord[]> {
    const txs = useQSStore.getState().transactions;
    return txs
      .filter((t) => t.type === 'deduct')
      .map((t) => ({
        id: t.id,
        amount: t.amount,
        reason: t.reason,
        time: t.time,
      }));
  },

  async recharge(userId: string, amountUSD: number, paymentInfo: StripePaymentInfo): Promise<boolean> {
    if (amountUSD <= 0) return false;
    // 根据全局汇率计算 QS 数量
    const qsAmount = Math.floor(amountUSD * BACKEND_CONFIG.QS_PER_USD);
    useQSStore.getState().addQS(qsAmount, `Recharge $${amountUSD}`);
    return true;
  },
};