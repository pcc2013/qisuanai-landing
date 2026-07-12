import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  emotion?: string;
  timestamp: number;
  assetChange?: number;
}

interface AssetChange { amount: number; reason: string; timestamp: number; }
interface Intimacy { level: number; lastChange: number; }
interface MemoryFragment { content: string; timestamp: string; }

interface ChatState {
  messages: ChatMessage[];
  sessionId: string;
  isStreaming: boolean;
  mode: 'quick' | 'deep';
  lastAssetChange: AssetChange | null;
  intimacy: Intimacy;
  recentMemoryFragments: MemoryFragment[];
  activeScene: { scene_id: string; scene_name: string } | null;

  setSessionId: (id: string) => void;
  addMessage: (message: ChatMessage) => void;
  updateLastAssistantMessage: (content: string) => void;
  setStreaming: (streaming: boolean) => void;
  setMode: (mode: 'quick' | 'deep') => void;
  setAssetChange: (amount: number, reason: string) => void;
  clearAssetChange: () => void;
  setIntimacy: (level: number, change: number) => void;
  setMemoryFragments: (fragments: MemoryFragment[]) => void;
  setActiveScene: (scene: { scene_id: string; scene_name: string } | null) => void;
  clearMessages: () => void;
}

function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  sessionId: '',
  isStreaming: false,
  mode: 'deep',
  lastAssetChange: null,
  intimacy: { level: 0, lastChange: 0 },
  recentMemoryFragments: [],
  activeScene: null,

  setSessionId: (id) => set({ sessionId: id }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, { ...message, id: message.id || generateId() }] })),
  updateLastAssistantMessage: (content) => set((state) => {
    const messages = [...state.messages];
    const lastIndex = messages.length - 1;
    if (lastIndex >= 0 && messages[lastIndex].role === 'assistant') {
      messages[lastIndex] = { ...messages[lastIndex], content };
    }
    return { messages };
  }),
  setStreaming: (streaming) => set({ isStreaming: streaming }),
  setMode: (mode) => set({ mode }),
  setAssetChange: (amount, reason) => set({ lastAssetChange: { amount, reason, timestamp: Date.now() } }),
  clearAssetChange: () => set({ lastAssetChange: null }),
  setIntimacy: (level, change) => set({ intimacy: { level, lastChange: change } }),
  setMemoryFragments: (fragments) => set({ recentMemoryFragments: fragments }),
  setActiveScene: (scene) => set({ activeScene: scene }),
  clearMessages: () => set({ messages: [], recentMemoryFragments: [], activeScene: null }),
}));