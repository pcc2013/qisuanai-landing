// D:\nira-app\src\store\useIntimacyStore.ts
// v2.1 — 移除硬编码中文，改为翻译 key，UI 层通过 useLocaleStore().t() 获取文案

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type IntimacyLevel = 0 | 1 | 2 | 3 | 4;

interface IntimacyEntry {
  personaId: string;
  score: number;
  level: IntimacyLevel;
  lastInteraction: number;
  lastInteractionDate: string; // 'YYYY-MM-DD'，按自然日计算streak用
  streak: number;              // 连续互动天数（自然日）
  dailyScore: number;          // 今日已得分
  dailyDate: string;           // 今日日期，用于重置dailyScore
  recallSent: boolean;         // 本次沉默期是否已触发情感召回
}

// addScore 返回值，供 HomePage 读取后展示 Toast / 升级动画
export interface AddScoreResult {
  scored: boolean;
  points: number;
  capped: boolean;             // 是否因每日上限被截断
  levelUp: boolean;
  newLevel: IntimacyLevel;
  oldLevel: IntimacyLevel;
  streak: number;
}

export interface RecallResult {
  shouldRecall: boolean;
  days: number;
  messageKey: string;          // 翻译 key，UI 层通过 t(messageKey) 获取文案
}

interface IntimacyState {
  entries: Record<string, IntimacyEntry>;
  addScore: (personaId: string, message: string) => AddScoreResult;
  getLevel: (personaId: string) => IntimacyLevel;
  getScore: (personaId: string) => number;
  getStreak: (personaId: string) => number;
  checkRecall: (personaId: string) => RecallResult;
  checkAllRecall: () => RecallResult[];
  resetEntry: (personaId: string) => void;
  deleteEntry: (personaId: string) => void;
}

// ─── 常量 ────────────────────────────────────────────────────────────────────

const DAILY_CAP = 200;
const BASE_SCORE = 15;
const MIN_MSG_LEN = 10;

// ─── 纯函数 ──────────────────────────────────────────────────────────────────

function toDateStr(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

function todayStr(): string {
  return toDateStr(Date.now());
}

function calcLevel(score: number): IntimacyLevel {
  if (score >= 1000) return 4;
  if (score >= 600)  return 3;
  if (score >= 300)  return 2;
  if (score >= 100)  return 1;
  return 0;
}

function streakBonus(streak: number): number {
  if (streak >= 30) return 20;
  if (streak >= 7)  return 10;
  if (streak >= 3)  return 5;
  return 0;
}

// 情感召回：返回翻译 key，不返回硬编码文案
function getRecallKey(days: number): string {
  if (days >= 30) return 'intimacy.recall.month';
  if (days >= 14) return 'intimacy.recall.two_weeks';
  if (days >= 7)  return 'intimacy.recall.week';
  if (days >= 3)  return 'intimacy.recall.three_days';
  return '';
}

const NO_SCORE: AddScoreResult = {
  scored: false,
  points: 0,
  capped: false,
  levelUp: false,
  newLevel: 0,
  oldLevel: 0,
  streak: 0,
};

const NO_RECALL: RecallResult = {
  shouldRecall: false,
  days: 0,
  messageKey: '',
};

// ─── Store ───────────────────────────────────────────────────────────────────

export const useIntimacyStore = create<IntimacyState>()(
  persist(
    (set, get) => ({
      entries: {},

      addScore: (personaId, message) => {
        if (!personaId) return NO_SCORE;
        if (message.trim().length < MIN_MSG_LEN) return NO_SCORE;

        const today = todayStr();
        const yesterday = toDateStr(Date.now() - 86_400_000);

        const prev: IntimacyEntry = get().entries[personaId] ?? {
          personaId,
          score: 0,
          level: 0,
          lastInteraction: Date.now(),
          lastInteractionDate: today,
          streak: 0,
          dailyScore: 0,
          dailyDate: today,
          recallSent: false,
        };

        const oldLevel = prev.level;

        // 跨天重置今日计分
        const isNewDay = prev.dailyDate !== today;
        const currentDailyScore = isNewDay ? 0 : prev.dailyScore;

        // 今日已达上限
        if (currentDailyScore >= DAILY_CAP) {
          return {
            scored: false,
            points: 0,
            capped: false,
            levelUp: false,
            newLevel: oldLevel,
            oldLevel,
            streak: prev.streak,
          };
        }

        // streak 按自然日计算
        let newStreak: number;
        if (prev.lastInteractionDate === today) {
          newStreak = prev.streak;
        } else if (prev.lastInteractionDate === yesterday) {
          newStreak = prev.streak + 1;
        } else {
          newStreak = 1;
        }

        const raw = BASE_SCORE + streakBonus(newStreak);
        const remaining = DAILY_CAP - currentDailyScore;
        const capped = raw > remaining;
        const points = Math.min(raw, remaining);

        const newScore = prev.score + points;
        const newLevel = calcLevel(newScore);
        const levelUp = newLevel > oldLevel;

        set({
          entries: {
            ...get().entries,
            [personaId]: {
              personaId,
              score: newScore,
              level: newLevel,
              lastInteraction: Date.now(),
              lastInteractionDate: today,
              streak: newStreak,
              dailyScore: currentDailyScore + points,
              dailyDate: today,
              recallSent: false,
            },
          },
        });

        return {
          scored: true,
          points,
          capped,
          levelUp,
          newLevel,
          oldLevel,
          streak: newStreak,
        };
      },

      getLevel: (personaId) => get().entries[personaId]?.level ?? 0,

      getScore: (personaId) => get().entries[personaId]?.score ?? 0,

      getStreak: (personaId) => get().entries[personaId]?.streak ?? 0,

      checkRecall: (personaId) => {
        const entry = get().entries[personaId];
        if (!entry) return NO_RECALL;

        const daysInactive = (Date.now() - entry.lastInteraction) / 86_400_000;
        if (daysInactive < 3) return NO_RECALL;
        if (entry.recallSent)  return NO_RECALL;

        const days = Math.floor(daysInactive);
        const messageKey = getRecallKey(days);
        if (!messageKey) return NO_RECALL;

        // 标记已发送，避免重复触发
        set({
          entries: {
            ...get().entries,
            [personaId]: { ...entry, recallSent: true },
          },
        });

        return { shouldRecall: true, days, messageKey };
      },

      checkAllRecall: () => {
        const { entries } = get();
        const results: RecallResult[] = [];

        Object.keys(entries).forEach((personaId) => {
          const result = get().checkRecall(personaId);
          if (result.shouldRecall) {
            results.push({ ...result, personaId } as RecallResult & { personaId: string });
          }
        });

        return results;
      },

      resetEntry: (personaId) => {
        const today = todayStr();
        set({
          entries: {
            ...get().entries,
            [personaId]: {
              personaId,
              score: 0,
              level: 0,
              lastInteraction: Date.now(),
              lastInteractionDate: today,
              streak: 0,
              dailyScore: 0,
              dailyDate: today,
              recallSent: false,
            },
          },
        });
      },

      deleteEntry: (personaId) => {
        const entries = { ...get().entries };
        delete entries[personaId];
        set({ entries });
      },
    }),
    {
      name: 'nira-intimacy-store',
      version: 3,
      migrate: (state: any, version: number) => {
        if (version <= 2) {
          const today = todayStr();
          Object.keys(state.entries ?? {}).forEach((key) => {
            const e = state.entries[key];
            if (e.dailyDate === undefined)               e.dailyDate = today;
            if (e.dailyScore === undefined)              e.dailyScore = 0;
            if (e.lastInteractionDate === undefined)     e.lastInteractionDate = today;
            if (e.recallSent === undefined)              e.recallSent = false;
          });
        }
        return state;
      },
    }
  )
);

// ─── 等级元数据（翻译 key 映射，供 UI 层配合 t() 使用）──────────────────────

export const LEVEL_NAME_KEYS: Record<IntimacyLevel, string> = {
  0: 'intimacy.level0',
  1: 'intimacy.level1',
  2: 'intimacy.level2',
  3: 'intimacy.level3',
  4: 'intimacy.level4',
};

export const LEVEL_THRESHOLDS: Record<IntimacyLevel, number> = {
  0: 0,
  1: 100,
  2: 300,
  3: 600,
  4: 1000,
};

export const LEVEL_UNLOCK_KEYS: Record<IntimacyLevel, string[]> = {
  0: ['intimacy.unlock.basic_chat'],
  1: [
    'intimacy.unlock.remember_name',
    'intimacy.unlock.catchphrase',
    'intimacy.unlock.emotions_3',
    'intimacy.unlock.appearance_1',
  ],
  2: [
    'intimacy.unlock.story_3',
    'intimacy.unlock.voice_switch',
    'intimacy.unlock.appearance_2',
  ],
  3: [
    'intimacy.unlock.deep_story_5',
    'intimacy.unlock.digital_human_actions',
    'intimacy.unlock.all_appearances',
  ],
  4: [
    'intimacy.unlock.full_story',
    'intimacy.unlock.ai_clone',
    'intimacy.unlock.revenue_share',
  ],
};