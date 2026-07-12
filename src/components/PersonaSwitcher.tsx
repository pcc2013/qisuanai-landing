// D:\nira-app\src\components\PersonaSwitcher.tsx

import React, { useMemo, useCallback, useState } from 'react';
import {
  IonModal, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,
  IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonCardSubtitle, IonBadge, IonChip, IonAvatar, IonGrid, IonRow, IonCol,
  IonText,
} from '@ionic/react';
import { closeOutline, sparkles, imagesOutline } from 'ionicons/icons';
import { usePersonaStore, PERSONA_CONFIGS, PERSONA_CHARACTERS } from '../store/usePersonaStore';
import { useIntimacyStore } from '../store/useIntimacyStore';
import { useLocaleStore } from '../store/useLocaleStore';

interface PersonaSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
}

const PersonaSwitcher: React.FC<PersonaSwitcherProps> = ({ isOpen, onClose }) => {
  const { t, locale } = useLocaleStore();
  const {
    currentPersonaId,
    currentCharacterId,
    currentSceneIndex,
    switchPersona,
    switchCharacter,
    switchScene,
    getCurrentCharacter,
    getIntimacyLevel,
  } = usePersonaStore();
  const intimacyStore = useIntimacyStore();

  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const [expandedPersona, setExpandedPersona] = useState<string | null>(null);

  // 安全取值：PERSONA_CONFIGS 可能因构建顺序问题为 undefined
  const safeConfigs = PERSONA_CONFIGS || [];
  const safeChars = PERSONA_CHARACTERS || [];

  const selectedConfig = useMemo(
    () => safeConfigs.find(p => p.id === (selectedPersonaId || currentPersonaId)),
    [safeConfigs, selectedPersonaId, currentPersonaId]
  );

  const characters = selectedConfig?.characters || [];
  const currentChar = getCurrentCharacter();
  const intimacy = getIntimacyLevel();

  const handleSelectPersona = useCallback((personaId: string) => {
    setExpandedPersona(prev => prev === personaId ? null : personaId);
    setSelectedPersonaId(personaId);
  }, []);

  const handleConfirmSwitch = useCallback(() => {
    if (selectedPersonaId && selectedPersonaId !== currentPersonaId) {
      switchPersona(selectedPersonaId);
    }
    onClose();
  }, [selectedPersonaId, currentPersonaId, switchPersona, onClose]);

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar style={{ '--background': '#DCE8F0' }}>
          <IonButtons slot="start">
            <IonButton onClick={onClose} style={{ '--color': '#3D362F' }}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle style={{ fontSize: 16, color: '#3D362F' }}>
            {t('personaSwitcher.title') || '切换人格'}
          </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleConfirmSwitch} style={{ '--color': '#C4A882', fontWeight: 600 }}>
              确认
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ '--background': '#F5F0EB' }} className="ion-padding">
        {/* 当前人格状态 */}
        <IonCard style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', textAlign: 'center' }}>
          <IonCardContent>
            <IonAvatar style={{ margin: '0 auto 12px', width: 72, height: 72 }}>
              <img
                src={currentChar?.avatar || '/nira_logo.png'}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { (e.target as HTMLImageElement).src = '/nira_logo.png'; }}
              />
            </IonAvatar>
            <IonText style={{ color: 'white', fontSize: 16, fontWeight: 600, display: 'block' }}>
              {currentChar?.name || '未选择'}
            </IonText>
            <IonText style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, display: 'block', marginTop: 4 }}>
              {selectedConfig?.description?.[locale] || selectedConfig?.descriptionEn || ''}
            </IonText>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 8 }}>
              <IonBadge color="light">{intimacy?.name || '初识'}</IonBadge>
              <IonBadge color="warning">{intimacy?.score || 0} 分</IonBadge>
            </div>
          </IonCardContent>
        </IonCard>

        {/* 8人格卡片网格 */}
        <IonText style={{ fontSize: 14, fontWeight: 600, color: '#3D362F', display: 'block', margin: '12px 0 8px' }}>
          <IonIcon icon={sparkles} style={{ verticalAlign: 'middle', marginRight: 4 }} />
          选择人格
        </IonText>

        <IonGrid>
          <IonRow>
            {safeConfigs.map((p) => {
              const isCurrent = p.id === currentPersonaId;
              const isExpanded = expandedPersona === p.id;
              const firstChar = p.characters?.[0];
              const score = intimacyStore.getScore(p.id);
              const level = intimacyStore.getLevel(p.id);
              const personaName = p.name?.[locale as keyof typeof p.name] || p.nameEn || p.id;

              return (
                <IonCol key={p.id} size="6">
                  <IonCard
                    button
                    onClick={() => handleSelectPersona(p.id)}
                    style={{
                      border: isCurrent ? '3px solid #C4A882' : isExpanded ? '2px solid #667eea' : '1px solid #E0D8CE',
                      opacity: 1,
                    }}
                  >
                    <IonCardHeader style={{ padding: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <IonAvatar style={{ width: 40, height: 40 }}>
                          <img
                            src={firstChar?.avatar || '/nira_logo.png'}
                            alt=""
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { (e.target as HTMLImageElement).src = '/nira_logo.png'; }}
                          />
                        </IonAvatar>
                        <div>
                          <IonCardTitle style={{ fontSize: 13 }}>{personaName}</IonCardTitle>
                          <IonCardSubtitle style={{ fontSize: 10 }}>
                            {p.descriptionEn?.slice(0, 30) || ''}...
                          </IonCardSubtitle>
                        </div>
                      </div>
                    </IonCardHeader>
                    {isExpanded && (
                      <IonCardContent style={{ padding: '8px 12px' }}>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
                          <IonBadge color="warning" style={{ fontSize: 10 }}>Lv.{level}</IonBadge>
                          <IonBadge color="medium" style={{ fontSize: 10 }}>{score}分</IonBadge>
                          <IonBadge color="tertiary" style={{ fontSize: 10 }}>{p.characters?.length || 0}角色</IonBadge>
                        </div>
                        {/* 角色列表 */}
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {p.characters?.map((ch) => (
                            <IonChip
                              key={ch.id}
                              outline
                              color={ch.id === currentCharacterId && isCurrent ? 'primary' : 'medium'}
                              style={{ fontSize: 10, cursor: 'pointer' }}
                              onClick={(e) => { e.stopPropagation(); switchCharacter(ch.id); }}
                            >
                              {ch.name || ch.nameEn}
                            </IonChip>
                          ))}
                        </div>
                        {/* 场景切换 */}
                        {isCurrent && (
                          <div style={{ marginTop: 8 }}>
                            <IonText style={{ fontSize: 10, color: '#8B7D72' }}>
                              <IonIcon icon={imagesOutline} style={{ verticalAlign: 'middle', fontSize: 12 }} /> 场景
                            </IonText>
                            <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                              {p.scenes?.map((scene, idx) => (
                                <IonChip
                                  key={idx}
                                  outline
                                  color={idx === currentSceneIndex ? 'success' : 'medium'}
                                  style={{ fontSize: 10, cursor: 'pointer' }}
                                  onClick={(e) => { e.stopPropagation(); switchScene(idx); }}
                                >
                                  场景{idx + 1}
                                </IonChip>
                              ))}
                            </div>
                          </div>
                        )}
                      </IonCardContent>
                    )}
                  </IonCard>
                </IonCol>
              );
            })}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonModal>
  );
};

export default PersonaSwitcher;