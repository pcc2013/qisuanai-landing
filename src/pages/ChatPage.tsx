import React, { useEffect, useRef, useCallback } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonFooter } from '@ionic/react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import { connectDialogueStream } from '../adapters/messageStream';
import ChatBubble from '../components/ChatBubble';
import ChatInput from '../components/ChatInput';
import AssetChangeToast from '../components/AssetChangeToast';
import IntimacyToast from '../components/IntimacyToast';

const ChatPage: React.FC = () => {
  const { personaId } = useParams<{ personaId: string }>();
  const user = useAuthStore((s) => s.user);

  const messages = useChatStore((s) => s.messages);
  const sessionId = useChatStore((s) => s.sessionId);
  const isStreaming = useChatStore((s) => s.isStreaming);
  const mode = useChatStore((s) => s.mode);
  const lastAssetChange = useChatStore((s) => s.lastAssetChange);
  const intimacy = useChatStore((s) => s.intimacy);

  const addMessage = useChatStore((s) => s.addMessage);
  const updateLastAssistantMessage = useChatStore((s) => s.updateLastAssistantMessage);
  const setStreaming = useChatStore((s) => s.setStreaming);
  const setMode = useChatStore((s) => s.setMode);
  const setAssetChange = useChatStore((s) => s.setAssetChange);
  const clearAssetChange = useChatStore((s) => s.clearAssetChange);
  const setIntimacy = useChatStore((s) => s.setIntimacy);
  const setMemoryFragments = useChatStore((s) => s.setMemoryFragments);
  const setActiveScene = useChatStore((s) => s.setActiveScene);

  const contentRef = useRef<HTMLIonContentElement>(null);
  const streamControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => { contentRef.current?.scrollToBottom(300); }, []);

  useEffect(() => { if (user?.uid) useAuthStore.getState().restoreUserState(user.uid); }, [user?.uid]);
  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  useEffect(() => {
    if (lastAssetChange) {
      const timer = setTimeout(() => clearAssetChange(), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastAssetChange, clearAssetChange]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming || !user) return;
    const currentMode = mode;

    addMessage({ id: '', role: 'user', content: text, timestamp: Date.now() });
    addMessage({ id: '', role: 'assistant', content: '', timestamp: Date.now() });
    setStreaming(true);

    streamControllerRef.current?.abort();

    const controller = connectDialogueStream(
      { session_id: sessionId, user_id: user.uid, message: text, mode: currentMode },
      (data) => updateLastAssistantMessage(data.text),
      (data) => setAssetChange(data.asset_change, data.reason),
      (data) => setIntimacy(data.level, data.change),
      () => setStreaming(false),
      (err) => { console.error(err); setStreaming(false); },
      (data) => setMemoryFragments(data.fragments),
      (data) => setActiveScene(data),
    );

    streamControllerRef.current = controller;
  }, [mode, isStreaming, user, sessionId, addMessage, updateLastAssistantMessage, setStreaming, setAssetChange, setIntimacy, setMemoryFragments, setActiveScene]);

  const handleModeChange = useCallback((newMode: 'quick' | 'deep') => setMode(newMode), [setMode]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonMenuButton /></IonButtons>
          <IonTitle>{personaId || 'Nira'}</IonTitle>
          <IonButtons slot="end">
            <button
              onClick={() => handleModeChange(mode === 'deep' ? 'quick' : 'deep')}
              style={{ background: 'transparent', border: '1px solid var(--ion-color-primary)', borderRadius: 16, padding: '4px 12px', fontSize: 12, color: 'var(--ion-color-primary)', marginRight: 8 }}
            >
              {mode === 'deep' ? 'Think Max' : 'Quick'}
            </button>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent ref={contentRef} className="ion-padding">
        <AssetChangeToast visible={lastAssetChange !== null} changeAmount={lastAssetChange?.amount ?? null} reason={lastAssetChange?.reason ?? ''} />
        <IntimacyToast visible={intimacy.lastChange !== 0} level={intimacy.level} change={intimacy.lastChange} />

        <div style={{ paddingBottom: 16 }}>
          {messages.map((msg, index) => (
            <ChatBubble key={msg.id || index} message={msg} isLast={index === messages.length - 1} />
          ))}
        </div>
      </IonContent>

      <IonFooter>
        <ChatInput onSend={handleSendMessage} disabled={isStreaming} />
      </IonFooter>
    </IonPage>
  );
};

export default ChatPage;