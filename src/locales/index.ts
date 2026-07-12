import { en } from './en';
import { zhCN } from './zh-CN';
import { zhTW } from './zh-TW';
import { id } from './id';
import { vi } from './vi';

export const locales: Record<string, Record<string, string>> = {
  en,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  id,
  vi
};

export function t(lang: string, key: string): string {
  return locales[lang]?.[key] || locales['en']?.[key] || key;
}