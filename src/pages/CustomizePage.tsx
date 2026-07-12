// D:\nira-app\src\pages\CustomizePage.tsx

import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonButton, IonIcon, IonText, IonAvatar, IonBadge, IonChip,
  useIonToast, IonModal, IonSpinner, IonGrid, IonRow, IonCol, IonThumbnail
} from '@ionic/react';
import {
  chevronDown, chevronForward, videocamOutline,
  lockClosed, documentTextOutline, sparkles, imagesOutline,
  musicalNoteOutline, arrowBackOutline
} from 'ionicons/icons';
import { useLocaleStore } from '../store/useLocaleStore';
import { useQSStore } from '../store/useQSStore';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { useVoicePlayer } from '../hooks/useVoicePlayer';
import {
  PERSONA_CONFIGS, PERSONA_CHARACTERS, usePersonaStore,
  isCharacterUnlocked, UNLOCK_CHARACTER_PRICE, canVideoCall
} from '../store/usePersonaStore';

const CustomizePage: React.FC = () => {
  const history = useHistory();
  const { t, locale } = useLocaleStore();
  const { qsBalance, deductQS } = useQSStore();
  const { currentTier } = useSubscriptionStore();
  const { extraUnlockedCharacters, unlockCharacter, switchCharacter, currentPersonaId, currentCharacterId } = usePersonaStore();
  const [presentToast] = useIonToast();
  const { play, stop } = useVoicePlayer();

  const [expandedPersona, setExpandedPersona] = useState<string | null>(null);
  const [expandedCharacter, setExpandedCharacter] = useState<string | null>(null);
  const [showResume, setShowResume] = useState(false);
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);

  const personaConfigs = PERSONA_CONFIGS || [];
  const selectedChar = selectedCharId ? (PERSONA_CHARACTERS || []).find(c => c.id === selectedCharId) : null;

  const handlePersonaToggle = useCallback((personaId: string) => {
    setExpandedPersona(prev => prev === personaId ? null : personaId);
    setExpandedCharacter(null);
  }, []);

  const handleCharacterToggle = useCallback((charId: string) => {
    setExpandedCharacter(prev => prev === charId ? null : charId);
  }, []);

  const handleViewResume = useCallback((charId: string) => {
    setSelectedCharId(charId);
    setShowResume(true);
  }, []);

  const handleUnlock = useCallback((charId: string) => {
    if (isCharacterUnlocked(charId, currentTier, extraUnlockedCharacters)) return;
    if (qsBalance < UNLOCK_CHARACTER_PRICE) {
      presentToast({ message: t('customize.qsError') || 'QS不足', duration: 2000, color: 'danger' });
      return;
    }
    deductQS(UNLOCK_CHARACTER_PRICE, `解锁人像 ${charId}`);
    unlockCharacter(charId);
    presentToast({ message: t('customize.unlockSuccess') || '解锁成功！', duration: 2000, color: 'success' });
  }, [currentTier, extraUnlockedCharacters, qsBalance, deductQS, unlockCharacter, presentToast, t]);

  const handleSetDefault = useCallback((charId: string) => {
    switchCharacter(charId);
    presentToast({ message: t('customize.switched') || '已设为默认', duration: 1500, color: 'success' });
  }, [switchCharacter, presentToast, t]);

  const handleVideoCall = useCallback((charId: string) => {
    if (!canVideoCall(qsBalance)) {
      presentToast({ message: t('digitalHuman.qsError') || 'QS不足', duration: 2000, color: 'danger' });
      return;
    }
    history.push(`/call/video/${charId}/digital`);
  }, [qsBalance, history, presentToast, t]);

  const handleVoiceCall = useCallback((charId: string) => {
    history.push(`/call/voice/${charId}`);
  }, [history]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': '#DCE8F0' }}>
          <IonButtons slot="start">
            <IonMenuButton style={{ '--color': '#3D362F' }} />
            <IonButton fill="clear" onClick={() => history.push('/home')} style={{ '--color': '#3D362F' }}>
              <IonIcon icon={arrowBackOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
          <IonTitle style={{ fontSize: 16, color: '#3D362F' }}>
            <IonIcon icon={sparkles} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            {t('customize.title') || 'AI 定制'}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ '--background': '#F5F0EB' }}>
        {personaConfigs.map((persona) => {
          const isPersonaExpanded = expandedPersona === persona.id;
          const personaName = persona.name?.[locale as keyof typeof persona.name] || persona.nameEn || persona.id;
          const chars = persona.characters || [];

          return (
            <div key={persona.id} style={{ marginBottom: 8 }}>
              <IonCard
                button
                onClick={() => handlePersonaToggle(persona.id)}
                style={{
                  margin: '8px 12px',
                  borderRadius: 12,
                  borderLeft: isPersonaExpanded ? '4px solid #C4A882' : '1px solid #E0D8CE',
                }}
              >
                <IonCardHeader style={{ padding: '10px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <IonCardTitle style={{ fontSize: 15, color: '#3D362F' }}>
                        {personaName}
                      </IonCardTitle>
                      <IonText style={{ fontSize: 11, color: '#8B7D72' }}>
                        {chars.length} 个人像 · {persona.scenes?.length || 0} 张场景
                      </IonText>
                    </div>
                    <IonIcon
                      icon={isPersonaExpanded ? chevronDown : chevronForward}
                      style={{ color: '#8B7D72', fontSize: 20 }}
                    />
                  </div>
                </IonCardHeader>
              </IonCard>

              {isPersonaExpanded && chars.map((char) => {
                const unlocked = isCharacterUnlocked(char.id, currentTier, extraUnlockedCharacters);
                const isCharExpanded = expandedCharacter === char.id;

                return (
                  <div key={char.id} style={{ paddingLeft: 24, paddingRight: 12 }}>
                    <IonCard
                      button
                      onClick={() => handleCharacterToggle(char.id)}
                      style={{
                        marginBottom: 6,
                        borderRadius: 10,
                        borderLeft: unlocked ? '3px solid #4CAF50' : '3px solid #E0D8CE',
                        opacity: unlocked ? 1 : 0.7,
                      }}
                    >
                      <IonCardHeader style={{ padding: '8px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <IonAvatar style={{ width: 44, height: 44 }}>
                            <img
                              src={char.avatar}
                              alt=""
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => { (e.target as HTMLImageElement).src = '/nira_logo.png'; }}
                            />
                          </IonAvatar>
                          <div style={{ flex: 1 }}>
                            <IonCardTitle style={{ fontSize: 14, color: '#3D362F' }}>
                              {char.name}
                              {unlocked && char.id === currentCharacterId && (
                                <IonBadge color="success" style={{ marginLeft: 6, fontSize: 10 }}>当前</IonBadge>
                              )}
                            </IonCardTitle>
                            <IonText style={{ fontSize: 10, color: '#8B7D72' }}>
                              {char.gender === 'F' ? '女' : char.gender === 'M' ? '男' : 'NB'} · {char.age}岁 · {char.career}
                            </IonText>
                          </div>
                          <IonIcon
                            icon={isCharExpanded ? chevronDown : chevronForward}
                            style={{ color: '#8B7D72', fontSize: 16 }}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                          <IonButton size="small" fill="outline" onClick={(e) => { e.stopPropagation(); handleViewResume(char.id); }} style={{ fontSize: 10, height: 26 }}>
                            <IonIcon icon={documentTextOutline} slot="start" />简历
                          </IonButton>
                          {unlocked ? (
                            <>
                              <IonButton size="small" onClick={(e) => { e.stopPropagation(); handleVideoCall(char.id); }} style={{ fontSize: 10, height: 26, '--background': '#C4A882' }}>
                                <IonIcon icon={videocamOutline} slot="start" />视频
                              </IonButton>
                              <IonButton size="small" fill="clear" onClick={(e) => { e.stopPropagation(); handleVoiceCall(char.id); }} style={{ fontSize: 10, height: 26, '--color': '#667eea' }}>
                                <IonIcon icon={musicalNoteOutline} slot="start" />语音
                              </IonButton>
                              <IonButton size="small" fill="clear" onClick={(e) => { e.stopPropagation(); handleSetDefault(char.id); }} style={{ fontSize: 10, height: 26, '--color': '#4A90D9' }}>
                                默认
                              </IonButton>
                            </>
                          ) : (
                            <IonButton size="small" fill="outline" onClick={(e) => { e.stopPropagation(); handleUnlock(char.id); }} style={{ fontSize: 10, height: 26, '--border-color': '#E88B7D', '--color': '#E88B7D' }}>
                              <IonIcon icon={lockClosed} slot="start" />解锁
                            </IonButton>
                          )}
                        </div>
                      </IonCardHeader>
                    </IonCard>

                    {isCharExpanded && (
                      <IonCardContent style={{ padding: '4px 0 12px' }}>
                        <IonText style={{ fontSize: 11, color: '#8B7D72', display: 'block', marginBottom: 6 }}>
                          <IonIcon icon={imagesOutline} style={{ verticalAlign: 'middle', fontSize: 12 }} /> 场景图（5张）
                        </IonText>
                        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                          {(persona.scenes || []).map((scene, idx) => (
                            <IonThumbnail key={idx} style={{ minWidth: 80, height: 60, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                              <img
                                src={scene}
                                alt={`场景${idx + 1}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                            </IonThumbnail>
                          ))}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                          <IonText style={{ fontSize: 10, color: '#8B7D72' }}>
                            🎤 {char.voiceKey}
                          </IonText>
                          <IonButton
                            size="small"
                            fill="clear"
                            style={{ fontSize: 10, height: 22, '--color': '#C4A882' }}
                            onClick={(e) => { e.stopPropagation(); play(char.voiceKey); }}
                          >
                            ▶ 试听
                          </IonButton>
                        </div>
                      </IonCardContent>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        <IonModal isOpen={showResume} onDidDismiss={() => setShowResume(false)}>
          {selectedChar ? (
            <>
              <IonHeader>
                <IonToolbar style={{ '--background': '#DCE8F0' }}>
                  <IonButtons slot="start">
                    <IonButton onClick={() => setShowResume(false)} style={{ '--color': '#3D362F' }}>关闭</IonButton>
                  </IonButtons>
                  <IonTitle style={{ fontSize: 16, color: '#3D362F' }}>{selectedChar.name} · 简历</IonTitle>
                </IonToolbar>
              </IonHeader>
              <IonContent style={{ '--background': '#F5F0EB' }} className="ion-padding">
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <IonAvatar style={{ margin: '0 auto', width: 80, height: 80 }}>
                    <img src={selectedChar.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = '/nira_logo.png'; }} />
                  </IonAvatar>
                  <IonText style={{ fontSize: 18, fontWeight: 700, color: '#3D362F', display: 'block', marginTop: 8 }}>{selectedChar.name}</IonText>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 4 }}>
                    <IonBadge color="medium">{selectedChar.age}岁</IonBadge>
                    <IonBadge color="tertiary">{selectedChar.career}</IonBadge>
                    <IonBadge color="warning">{selectedChar.exclusiveAbility}</IonBadge>
                  </div>
                </div>
                <IonCard><IonCardContent><IonText style={{ fontWeight: 600, color: '#C4A882', display: 'block', marginBottom: 4 }}>成长背景</IonText><IonText style={{ fontSize: 13, lineHeight: 1.8, color: '#3D362F' }}>{selectedChar.background}</IonText></IonCardContent></IonCard>
                <IonCard><IonCardContent><IonText style={{ fontWeight: 600, color: '#C4A882', display: 'block', marginBottom: 4 }}>性格特点</IonText><div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>{(selectedChar.personality || []).map((p, i) => <IonChip key={i} outline color="primary" style={{ fontSize: 12 }}>{p}</IonChip>)}</div></IonCardContent></IonCard>
                <IonCard><IonCardContent><IonText style={{ fontWeight: 600, color: '#C4A882', display: 'block', marginBottom: 4 }}>口头禅</IonText>{(selectedChar.catchphrases || []).map((c, i) => <IonText key={i} style={{ fontSize: 13, color: '#3D362F', display: 'block' }}>"{c}"</IonText>)}</IonCardContent></IonCard>
                <IonCard><IonCardContent><IonText style={{ fontWeight: 600, color: '#C4A882', display: 'block', marginBottom: 4 }}>兴趣</IonText><div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>{(selectedChar.interests || []).map((item, i) => <IonChip key={i} outline color="success" style={{ fontSize: 12 }}>{item}</IonChip>)}</div></IonCardContent></IonCard>
                <IonCard><IonCardContent><IonText style={{ fontWeight: 600, color: '#C4A882', display: 'block', marginBottom: 4 }}>推荐阅读</IonText>{(selectedChar.books || []).map((b, i) => <IonText key={i} style={{ fontSize: 12, color: '#8B7D72', display: 'block' }}>📖 {b}</IonText>)}</IonCardContent></IonCard>
              </IonContent>
            </>
          ) : (
            <IonContent><div style={{ textAlign: 'center', padding: 40 }}><IonSpinner /></div></IonContent>
          )}
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default CustomizePage;