// D:\nira-app\src\adapters\apiClient.ts

import { useAuthStore } from '../store/useAuthStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.nira.ai';

function getToken(): string {
  return useAuthStore.getState().token || '';
}

async function apiFetch<T>(
  path: string,
  options: RequestInit & { params?: Record<string, unknown> } = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;
  let url = `${API_BASE_URL}${path}`;

  const headers: Record<string, string> = {
    ...(fetchOptions.headers as Record<string, string>),
  };

  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // POST JSON
  if (!headers['Content-Type'] && fetchOptions.method !== 'GET') {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (response.status === 401) {
    useAuthStore.getState().logout();
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error ${response.status}: ${errorText}`);
  }

  const contentType = response.headers.get('Content-Type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  return response.text() as unknown as T;
}

// ========== 对话（SSE，不走 JSON） ==========
export interface DialogueRequest {
  session_id: string;
  user_id: string;
  message: string;
  mode: 'quick' | 'deep';
}

export function postDialogue(params: DialogueRequest, signal?: AbortSignal): Promise<Response> {
  return fetch(`${API_BASE_URL}/api/v1/langgraph/dialogue`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(params),
    signal,
  });
}

// ========== 用户状态 ==========
export interface UserState {
  intimacy_level: number;
  progress: Record<string, unknown>;
  online_sessions: number;
}

export async function fetchUserState(userId: string): Promise<UserState> {
  return apiFetch<UserState>('/api/v1/user/state', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId }),
  });
}

// ========== 翻译 ==========
export async function translateText(params: {
  text: string;
  source_lang: string;
  target_lang: string;
}): Promise<{ translated_text: string }> {
  return apiFetch('/api/v1/translate', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function batchTranslate(
  texts: string[],
  sourceLang: string,
  targetLang: string
): Promise<string[]> {
  const res = await apiFetch<{ translated_texts: string[] }>('/api/v1/translate/batch', {
    method: 'POST',
    body: JSON.stringify({ texts, source_lang: sourceLang, target_lang: targetLang }),
  });
  return res.translated_texts;
}

// ========== 语音转文字 ==========
const ALLOWED_AUDIO_TYPES = ['audio/wav', 'audio/x-wav', 'audio/webm', 'audio/mp4', 'audio/mpeg'];
const MAX_AUDIO_SIZE = 5 * 1024 * 1024;

export async function speechToText(audioBlob: Blob): Promise<{ text: string }> {
  if (audioBlob.size > MAX_AUDIO_SIZE) throw new Error('音频文件不能超过 5MB');
  if (!ALLOWED_AUDIO_TYPES.includes(audioBlob.type))
    throw new Error(`不支持的音频格式: ${audioBlob.type}`);

  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.wav');

  const response = await fetch(`${API_BASE_URL}/api/v1/speech-to-text`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`STT error ${response.status}: ${err}`);
  }

  return response.json();
}

// ========== TTS ==========
export async function synthesizeSpeech(text: string, voiceId: string): Promise<ArrayBuffer> {
  const response = await fetch(`${API_BASE_URL}/api/v1/synthesize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ text, voice_id: voiceId }),
  });
  if (!response.ok) throw new Error(`TTS error ${response.status}`);
  return response.arrayBuffer();
}

export async function synthesizeSpeechStream(
  text: string,
  voiceId: string,
  onAudioChunk: (chunk: ArrayBuffer) => void,
  signal?: AbortSignal
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/synthesize/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ text, voice_id: voiceId }),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`TTS stream error ${response.status}: ${errorText}`);
  }

  const reader = response.body!.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onAudioChunk(value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength));
  }
}

// ========== AI 绘图 ==========
export async function generateImage(params: {
  prompt: string;
  style?: string;
  size?: string;
}): Promise<{ image_url: string; thumbnail_url: string }> {
  return apiFetch('/api/v1/generate-image', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// ========== 数字人视频 ==========
export async function generateDigitalHumanVideo(params: {
  text: string;
  avatar_id: string;
  voice_id: string;
}): Promise<{ video_url: string }> {
  return apiFetch('/api/v1/digital-human/generate', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}