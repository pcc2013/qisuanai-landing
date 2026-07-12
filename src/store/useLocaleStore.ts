// D:\nira-app\src\store\useLocaleStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { translateText, batchTranslate } from '../adapters/apiClient';

export type Locale = 'en' | 'zh' | 'zh-TW' | 'id' | 'vi';
export type SupportedLocale = Locale;

interface CacheEntry {
  value: string;
  timestamp: number;
}

const MAX_CACHE_SIZE = 500;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

interface LocaleState {
  locale: Locale;
  translations: Record<Locale, Record<string, string>>;
  translationCache: Record<string, CacheEntry>;
  isLoading: boolean;

  setLocale: (locale: Locale) => void;
  setTranslations: (locale: Locale, data: Record<string, string>) => void;
  t: (key: string, params?: Record<string, string>) => string;
  updateDictionary: (locale: Locale, data: Record<string, string>) => void;
  translateTextOnDemand: (text: string, targetLang?: Locale) => Promise<string>;
  batchTranslateOnDemand: (texts: string[], targetLang?: Locale) => Promise<string[]>;
}

// 便捷导出版，供外部直接调用
export const updateDictionary = (locale: Locale, data: Record<string, string>) => {
  useLocaleStore.getState().updateDictionary(locale, data);
};

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set, get) => ({
      locale: 'zh',
      translations: {
        zh: {},
        en: {},
        'zh-TW': {},
        id: {},
        vi: {},
      },
      translationCache: {},
      isLoading: false,

      setLocale: (locale) => set({ locale }),

      setTranslations: (locale, data) =>
        set((state) => ({
          translations: {
            ...state.translations,
            [locale]: { ...(state.translations[locale] || {}), ...data },
          },
        })),

      t: (key, params) => {
        const { locale, translations } = get();
        // 查找优先级：当前语言 → zh（默认） → en → 返回 key 本身
        const langPack = translations[locale] || translations['zh'] || {};
        let text = langPack[key] || translations['en']?.[key] || key;

        if (params) {
          Object.entries(params).forEach(([k, v]) => {
            text = text.replace(`{{${k}}}`, v).replace(`{${k}}`, v);
          });
        }
        return text;
      },

      updateDictionary: (locale, data) => {
        get().setTranslations(locale, data);
      },

      translateTextOnDemand: async (text, targetLang) => {
        const { locale, translationCache } = get();
        const target = targetLang || locale;
        const sourceLang = locale === 'zh' ? 'zh-CN' : locale;
        const targetApiLang = target === 'zh' ? 'zh-CN' : target;
        const cacheKey = `${text}:${sourceLang}:${targetApiLang}`;

        const cached = translationCache[cacheKey];
        if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
          return cached.value;
        }

        set({ isLoading: true });
        try {
          const result = await translateText({
            text,
            source_lang: sourceLang,
            target_lang: targetApiLang,
          });

          const newCache = { ...get().translationCache };
          const entries = Object.entries(newCache);
          if (entries.length >= MAX_CACHE_SIZE) {
            const oldest = entries.sort((a, b) => a[1].timestamp - b[1].timestamp)[0];
            if (oldest) delete newCache[oldest[0]];
          }
          newCache[cacheKey] = { value: result.translated_text, timestamp: Date.now() };

          set({ translationCache: newCache, isLoading: false });
          return result.translated_text;
        } catch (error) {
          console.error('[useLocaleStore] 翻译失败:', error);
          set({ isLoading: false });
          return text;
        }
      },

      batchTranslateOnDemand: async (texts, targetLang) => {
        const { locale } = get();
        const target = targetLang || locale;
        const sourceLang = locale === 'zh' ? 'zh-CN' : locale;
        const targetApiLang = target === 'zh' ? 'zh-CN' : target;

        set({ isLoading: true });
        try {
          const translated = await batchTranslate(texts, sourceLang, targetApiLang);
          const newCache = { ...get().translationCache };
          const now = Date.now();
          texts.forEach((text, index) => {
            const cacheKey = `${text}:${sourceLang}:${targetApiLang}`;
            newCache[cacheKey] = { value: translated[index], timestamp: now };
          });
          set({ translationCache: newCache, isLoading: false });
          return translated;
        } catch (error) {
          console.error('[useLocaleStore] 批量翻译失败:', error);
          set({ isLoading: false });
          return texts;
        }
      },
    }),
    {
      name: 'nira-locale-storage',
      partialize: (state) => ({
        locale: state.locale,
        translations: state.translations,
        translationCache: state.translationCache,
      }),
    }
  )
);