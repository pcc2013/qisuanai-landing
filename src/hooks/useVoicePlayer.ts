// D:\nira-app\src\hooks\useVoicePlayer.ts

import { useRef, useCallback } from 'react';
import { useLocaleStore } from '../store/useLocaleStore';

export function useVoicePlayer() {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { currentLocale } = useLocaleStore();

  const stop = useCallback(() => {
    if (utteranceRef.current) {
      speechSynthesis.cancel();
      utteranceRef.current = null;
    }
  }, []);

  // 旧版兼容
  const play = useCallback(
    (_roleKey?: string) => {
      // 旧版调用不报错
    },
    []
  );

  // 端侧 TTS 合成 + 播放
  const speak = useCallback(
    (text: string, options?: { rate?: number; pitch?: number; volume?: number }) => {
      stop();

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      const langMap: Record<string, string> = {
        zh: 'zh-CN',
        'zh-TW': 'zh-TW',
        en: 'en-US',
        id: 'id-ID',
        vi: 'vi-VN',
      };
      utterance.lang = langMap[currentLocale] || 'zh-CN';
      utterance.rate = options?.rate ?? 1.0;
      utterance.pitch = options?.pitch ?? 1.0;
      utterance.volume = options?.volume ?? 1.0;

      const voices = speechSynthesis.getVoices();
      const targetVoice = voices.find(v => v.lang.startsWith(utterance.lang));
      if (targetVoice) utterance.voice = targetVoice;

      speechSynthesis.speak(utterance);
    },
    [currentLocale, stop]
  );

  return { play, speak, stop };
}