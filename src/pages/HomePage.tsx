// D:\nira-app\src\pages\HomePage.tsx

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonContent, IonButtons,
  IonButton, IonIcon, IonText, IonMenuButton, IonAlert, useIonToast, IonFooter,
  IonAvatar,
} from '@ionic/react';
import { calendarOutline, languageOutline, callOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useLocaleStore } from '../store/useLocaleStore';
import { usePersonaStore } from '../store/usePersonaStore';
import { useChatStore } from '../store/useChatStore';
import { useQSStore } from '../store/useQSStore';
import { useCheckinStore } from '../store/useCheckinStore';
import {
  useIntimacyStore,
  LEVEL_NAME_KEYS,
  type AddScoreResult,
  type RecallResult,
} from '../store/useIntimacyStore';
import SideMenu from '../components/SideMenu';
import ChatBubble from '../components/ChatBubble';
import ChatInput from '../components/ChatInput';
import QuickPersonaPanel from '../components/QuickPersonaPanel';
import LanguageSelector from '../components/LanguageSelector';
import DigitalHumanFloating from '../components/DigitalHumanFloating';
import {
  PERSONA_CHARACTERS,
} from '../store/usePersonaStore';
import { getActiveSystemPrompt } from '../adapters/personaEngine';

const crisisKeywords: Record<string, string[]> = {
  en: ['kill myself', 'suicide', 'end my life', 'want to die', 'self-harm', 'hurt myself'],
  zh: ['自杀', '想死', '结束生命', '不想活', '自残', '伤害自己'],
};

const MEMORY_RECALL_LEVEL = 3;
const MEMORY_RECALL_COOLDOWN = 3;

const HomePage: React.FC = () => {
  const history = useHistory();
  const { t, locale } = useLocaleStore();
  const { currentPersonaId, currentCharacterId, getCurrentCharacter, getUnlockedCharacters, switchCharacter } = usePersonaStore();
  const messages = useChatStore((s) => s.messages);
  const isStreaming = useChatStore((s) => s.isStreaming);
  const addMessage = useChatStore((s) => s.addMessage);
  const setStreaming = useChatStore((s) => s.setStreaming);
  const clearMessages = useChatStore((s) => s.clearMessages);
  const { qsBalance } = useQSStore();
  const { canCheckin, checkin, streak } = useCheckinStore();
  const [presentToast] = useIonToast();
  const contentRef = useRef<HTMLIonContentElement>(null);

  const addScore = useIntimacyStore((s) => s.addScore);
  const getLevel = useIntimacyStore((s) => s.getLevel);
  const checkAllRecall = useIntimacyStore((s) => s.checkAllRecall);

  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [sentenceVisible, setSentenceVisible] = useState(true);
  const [showQuickPersona, setShowQuickPersona] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [langEvent, setLangEvent] = useState<any>(null);
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);
  const [systemPrompt, setSystemPrompt] = useState<string>('');

  const [pendingMemoryRecall, setPendingMemoryRecall] = useState<string | null>(null);
  const [messagesSinceLastRecall, setMessagesSinceLastRecall] = useState(0);
  const [recallCheckedToday, setRecallCheckedToday] = useState(false);

  // 固定 session_id，包含当前角色标识，保证不同角色拥有独立记忆
  const sessionIdRef = useRef(`session_${Date.now()}`);

  const unlockedIds = getUnlockedCharacters();
  const unlockedChars = (PERSONA_CHARACTERS || []).filter(c => unlockedIds.includes(c.id));
  const currentChar = getCurrentCharacter();
  const currentLevel = getLevel(currentPersonaId);

  const sentences = useMemo(() => {
    const list: string[] = [];
    for (let i = 1; i <= 15; i++) {
      const s = t(`home.sentence${i}`);
      if (s && !s.startsWith('home.sentence')) list.push(s);
    }
    return list.length > 0 ? list : ['Every moment deserves to be cherished.'];
  }, [t]);

  useEffect(() => {
    const loadPrompt = async () => {
      const prompt = await getActiveSystemPrompt('zh');
      setSystemPrompt(prompt);
    };
    loadPrompt();
  }, [currentCharacterId]);

  useEffect(() => {
    if (recallCheckedToday) return;
    const recalls = checkAllRecall();
    if (recalls.length > 0) {
      const firstRecall = recalls[0] as RecallResult;
      if (firstRecall.shouldRecall && firstRecall.messageKey) {
        setPendingMemoryRecall(t(firstRecall.messageKey));
      }
    }
    setRecallCheckedToday(true);
  }, []);

  useEffect(() => {
    if (sentences.length === 0) return;
    const interval = setInterval(() => {
      setSentenceVisible(false);
      setTimeout(() => {
        setCurrentSentenceIndex((prev) => (prev + 1) % sentences.length);
        setSentenceVisible(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, [sentences.length]);

  useEffect(() => { contentRef.current?.scrollToBottom(300); }, [messages]);

  useEffect(() => {
    if (currentLevel < MEMORY_RECALL_LEVEL) return;
    if (messagesSinceLastRecall < MEMORY_RECALL_COOLDOWN) return;
    if (pendingMemoryRecall) return;

    const memoryKeys = ['intimacy.memory.recall_1', 'intimacy.memory.recall_2', 'intimacy.memory.recall_3'];
    const randomKey = memoryKeys[Math.floor(Math.random() * memoryKeys.length)];
    const memoryText = t(randomKey);
    if (memoryText && !memoryText.startsWith('intimacy.memory')) {
      setPendingMemoryRecall(memoryText);
    }
  }, [currentLevel, messagesSinceLastRecall, pendingMemoryRecall]);

  // ─── 发送消息（已接入硅基流动 Qwen API + 会话记忆）────────────────────────
  const handleSend = useCallback(async (msg: string) => {
    if (crisisKeywords[locale]?.some((kw) => msg.toLowerCase().includes(kw.toLowerCase()))) {
      setShowCrisisAlert(true);
    }

    const scoreResult: AddScoreResult = addScore(currentPersonaId, msg);

    addMessage({ id: '', role: 'user', content: msg, timestamp: Date.now() });
    setStreaming(true);
    setMessagesSinceLastRecall((prev) => prev + 1);

    try {
      const response = await fetch('/api/v1/langgraph/dialogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionIdRef.current,
          user_id: 'current_user',
          message: msg,
          system: systemPrompt,
          character_id: currentCharacterId,
          persona_id: currentPersonaId,
          mode: 'deep',
        }),
      });

      const data = await response.json();
      let reply = data.reply || '';

      // 注入待发送的记忆/情感召回
      if (pendingMemoryRecall) {
        reply = `${pendingMemoryRecall}\n\n${reply}`;
        setPendingMemoryRecall(null);
        setMessagesSinceLastRecall(0);
      }

      // 升级语
      if (scoreResult.levelUp && scoreResult.newLevel >= 1) {
        const levelUpKey = `intimacy.levelUp.${scoreResult.newLevel}`;
        const levelUpLine = t(levelUpKey, { name: currentChar?.name || '' });
        if (levelUpLine && !levelUpLine.startsWith('intimacy.levelUp')) {
          reply = reply ? `${reply}\n\n${levelUpLine}` : levelUpLine;
        }
      }

      if (!reply) {
        reply = currentChar
          ? (t('chat.defaultReplyWithName', { name: currentChar.name }) || `${currentChar.name}：我在听，慢慢说。`)
          : (t('chat.defaultReply') || '我在听，慢慢说。');
      }

      addMessage({ id: '', role: 'assistant', content: reply, timestamp: Date.now() });

      if (scoreResult.levelUp) {
        const levelName = t(LEVEL_NAME_KEYS[scoreResult.newLevel]);
        presentToast({
          message: levelName ? t('intimacy.levelUpToast', { level: levelName }) : '你们的关系更近了',
          duration: 2000,
          color: 'success',
        });
      }
    } catch (error) {
      console.error('[HomePage] API 调用失败:', error);
      addMessage({
        id: '',
        role: 'assistant',
        content: t('chat.errorReply') || '抱歉，我暂时无法回复，请稍后再试。',
        timestamp: Date.now(),
      });
    }

    setStreaming(false);
  }, [locale, addScore, currentPersonaId, addMessage, setStreaming, currentChar, pendingMemoryRecall, systemPrompt, currentCharacterId, presentToast, t]);

  const handleCharSelect = useCallback((charId: string) => {
    setSelectedCharId(charId === selectedCharId ? null : charId);
  }, [selectedCharId]);

  // ─── 切换聊天对象：清空消息 + 开启新会话 ──────────────────────────────────
  const handleStartChat = useCallback(() => {
    if (selectedCharId) {
      // 1. 清空当前聊天记录
      clearMessages();

      // 2. 切换角色
      switchCharacter(selectedCharId);

      // 3. 开启全新 session_id（包含角色标识，后端可据此保留各角色记忆）
      sessionIdRef.current = `session_${selectedCharId}_${Date.now()}`;

      const name = unlockedChars.find(c => c.id === selectedCharId)?.name || '';
      presentToast({
        message: t('home.switchToast', { name }) || `已切换到${name}`,
        duration: 1500,
        color: 'success',
      });
    }
    setShowPanel(false);
    setSelectedCharId(null);
  }, [selectedCharId, switchCharacter, clearMessages, unlockedChars, presentToast, t]);

  const handleStartVoice = useCallback(() => {
    if (selectedCharId) {
      history.push(`/call/voice/${selectedCharId}`);
    }
    setShowPanel(false);
    setSelectedCharId(null);
  }, [selectedCharId, history]);

  const handleCheckIn = useCallback(() => {
    if (!canCheckin) {
      presentToast({ message: t('checkin.alreadyDone') || '已签到', duration: 1500 });
      return;
    }
    checkin();
    presentToast({
      message: t('checkin.success', { bonus: 5 + (streak % 30) }) || `签到成功！+${5 + (streak % 30)} QS`,
      duration: 2000,
      color: 'success',
    });
  }, [canCheckin, checkin, streak, presentToast, t]);

  return (
    <>
      <SideMenu />
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar style={{ '--background': '#DCE8F0', '--min-height': 56, '--border-width': 0 }}>
            <IonButtons slot="start">
              <IonMenuButton style={{ '--color': '#3D362F' }} />
            </IonButtons>
            <div
              slot="start"
              style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
              }}
              onClick={() => history.push('/profile')}
            >
              <img src="/nira_logo.png" alt="Nira" style={{ height: 32 }} />
            </div>
            <IonButtons slot="end">
              <IonButton
                fill="clear"
                onClick={(e) => {
                  setLangEvent(e.nativeEvent);
                  setShowLang(true);
                }}
                style={{ '--color': '#4A90D9' }}
              >
                <IonIcon icon={languageOutline} style={{ fontSize: 22 }} />
              </IonButton>
              <IonButton fill="clear" onClick={handleCheckIn} style={{ '--color': '#C4A882' }}>
                <IonIcon icon={calendarOutline} style={{ fontSize: 22 }} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent ref={contentRef} style={{ '--background': '#F5F0EB' }}>
          <div style={{
            backgroundColor: '#DCE8F0',
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <IonText style={{
              fontSize: 12,
              color: '#8B7D72',
              fontStyle: 'italic',
              opacity: sentenceVisible ? 1 : 0,
              transition: 'opacity 0.3s',
            }}>
              {sentences[currentSentenceIndex]}
            </IonText>
          </div>

          {messages.length === 0 && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '48px 24px',
            }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                fontSize: 32,
              }}>
                💬
              </div>
              <IonText style={{ fontSize: 14, color: '#8B7D72', textAlign: 'center' }}>
                {currentChar
                  ? t('home.chatWithName', { name: currentChar.name })
                  : t('home.chatDefault')}
              </IonText>
            </div>
          )}

          {messages.map((msg, i) => (
            <ChatBubble key={msg.id || i} message={msg} isLast={i === messages.length - 1} />
          ))}
          <IonText style={{ fontSize: 10, color: '#D0D0D0', textAlign: 'center', padding: '8px 0' }}>
            Vertical content ecosystem: PixelDragon, FortuneNest, TechLens, ChainSight, VentNest. All sites belong to qisuanai.com.
          </IonText>
        </IonContent>

        {/* 操作选择条 */}
        <div style={{
          backgroundColor: '#F5F0EB',
          height: selectedCharId ? 60 : 0,
          overflow: 'hidden',
          transition: 'height 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          padding: selectedCharId ? '0 12px' : 0,
          borderTop: selectedCharId ? '1px solid #E0D8CE' : 'none',
        }}>
          {selectedCharId && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', width: '100%', padding: '4px 0' }}>
              <IonButton
                expand="block"
                onClick={handleStartChat}
                style={{
                  '--background': '#C4A882',
                  height: 40,
                  fontSize: 13,
                  fontWeight: 600,
                  '--border-radius': '20px',
                  flex: 1,
                }}
              >
                💬 {t('home.textChat')}
              </IonButton>
              <IonButton
                expand="block"
                onClick={handleStartVoice}
                style={{
                  '--background': '#667eea',
                  height: 40,
                  fontSize: 13,
                  fontWeight: 600,
                  '--border-radius': '20px',
                  flex: 1,
                }}
              >
                📞 {t('home.voiceCall')}
              </IonButton>
            </div>
          )}
        </div>

        {/* 角色选择条 */}
        <div style={{
          backgroundColor: '#F5F0EB',
          height: showPanel ? 80 : 0,
          overflow: 'hidden',
          transition: 'height 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          padding: showPanel ? '0 12px' : 0,
          borderTop: showPanel ? '1px solid #E0D8CE' : 'none',
        }}>
          {showPanel && unlockedChars.length > 0 && (
            <div style={{
              display: 'flex',
              gap: 10,
              overflowX: 'auto',
              alignItems: 'center',
              width: '100%',
              padding: '4px 0',
            }}>
              {unlockedChars.map((char) => {
                const isSelected = char.id === selectedCharId;
                const isCurrent = char.id === currentCharacterId;
                return (
                  <div
                    key={char.id}
                    onClick={() => handleCharSelect(char.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 56,
                      height: 56,
                      borderRadius: '50%',
                      backgroundColor: isSelected ? '#FFF8F0' : '#FFFFFF',
                      border: isCurrent
                        ? '2px solid #C4A882'
                        : isSelected
                          ? '2px solid #667eea'
                          : '1px solid #E0D8CE',
                      transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      flexShrink: 0,
                      boxShadow: isCurrent ? '0 2px 8px rgba(196,168,130,0.3)' : isSelected ? '0 2px 8px rgba(102,126,234,0.3)' : 'none',
                    }}
                  >
                    <IonAvatar style={{ width: 28, height: 28, marginBottom: 2 }}>
                      <img
                        src={char.avatar}
                        alt={char.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                        onError={(e) => { (e.target as HTMLImageElement).src = '/nira_logo.png'; }}
                      />
                    </IonAvatar>
                    <IonText style={{
                      fontSize: 10,
                      color: '#3D362F',
                      lineHeight: 1,
                      textAlign: 'center',
                      maxWidth: 52,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                    }}>
                      {char.name}
                    </IonText>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <IonFooter>
          <div style={{
            backgroundColor: '#DCE8F0',
            borderTop: '0.5px solid #B8D4E8',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <IonButton
              fill="clear"
              onClick={() => {
                setShowPanel(prev => !prev);
                setSelectedCharId(null);
              }}
              style={{
                '--color': showPanel ? '#C4A882' : '#3D362F',
                margin: 0,
              }}
            >
              <IonIcon icon={callOutline} style={{ fontSize: 24 }} />
            </IonButton>
            <div style={{ flex: 1 }}>
              <ChatInput onSend={handleSend} disabled={isStreaming} />
            </div>
          </div>
        </IonFooter>

        <DigitalHumanFloating />
        <QuickPersonaPanel isShow={showQuickPersona} onClose={() => setShowQuickPersona(false)} />
      </IonPage>

      <LanguageSelector
        isOpen={showLang}
        onClose={() => setShowLang(false)}
        event={langEvent}
      />

      <IonAlert
        isOpen={showCrisisAlert}
        onDidDismiss={() => setShowCrisisAlert(false)}
        header={t('crisis.title')}
        message={t('crisis.helpline')}
        buttons={[{
          text: t('crisis.ok'),
          role: 'confirm',
          handler: () => setShowCrisisAlert(false),
        }]}
      />
    </>
  );
};

export default HomePage;