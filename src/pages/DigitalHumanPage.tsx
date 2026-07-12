// D:\nira-app\src\pages\DigitalHumanPage.tsx

import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonMenuButton, IonButton, IonIcon, IonText, IonSpinner, useIonToast,
  IonCard, IonCardContent, IonBadge, IonModal, IonAvatar,
} from '@ionic/react';
import { videocamOutline, callOutline, walletOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useLocaleStore } from '../store/useLocaleStore';
import { useQSStore } from '../store/useQSStore';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import {
  PERSONA_CHARACTERS, usePersonaStore,
  isCharacterUnlocked, canVideoCall,
} from '../store/usePersonaStore';

const DigitalHumanPage: React.FC = () => {
  const history = useHistory();
  const { t } = useLocaleStore();
  const { qsBalance } = useQSStore();
  const { currentTier } = useSubscriptionStore();
  const { extraUnlockedCharacters, getUnlockedCharacters } = usePersonaStore();
  const [presentToast] = useIonToast();

  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [showCallConfirm, setShowCallConfirm] = useState(false);
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);

  const unlockedIds = getUnlockedCharacters();
  const unlockedChars = (PERSONA_CHARACTERS || []).filter(c => unlockedIds.includes(c.id));
  const selectedChar = selectedCharId ? unlockedChars.find(c => c.id === selectedCharId) : null;

  const handleCall = (charId: string) => {
    if (!canVideoCall(qsBalance)) {
      presentToast({ message: t('digitalHuman.qsError') || 'QS不足', duration: 3000, color: 'danger' });
      return;
    }
    setSelectedCharId(charId);
    setShowCallConfirm(true);
  };

  const confirmCall = () => {
    setShowCallConfirm(false);
    setIsLoadingModel(true);
    setTimeout(() => {
      setIsLoadingModel(false);
      if (selectedCharId) history.push(`/call/video/${selectedCharId}/digital`);
    }, 2500);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': '#DCE8F0' }}>
          <IonButtons slot="start"><IonMenuButton style={{ '--color': '#3D362F' }} /></IonButtons>
          <IonTitle style={{ fontSize: 16, color: '#3D362F' }}>
            <IonIcon icon={videocamOutline} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            {t('digitalHuman.title') || '数字人视频'}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ '--background': '#F5F0EB' }}>
        {isLoadingModel ? (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <IonSpinner name="crescent" /><br />
            <IonText style={{ fontSize: 14, color: '#8B7D72', marginTop: 12, display: 'block' }}>
              {t('digitalHuman.loadingTip') || '正在准备数字人...'}
            </IonText>
          </div>
        ) : unlockedChars.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <IonText color="medium">{t('no_memory_cards') || '暂无已解锁人像，请前往 AI 定制解锁'}</IonText>
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, padding: 16 }}>
            {unlockedChars.map((char) => (
              <IonCard key={char.id} style={{ width: '45%', margin: 0, borderRadius: 12, backgroundColor: '#fff', textAlign: 'center', border: '2px solid #4CAF50' }}>
                <IonCardContent style={{ padding: 12 }}>
                  <IonAvatar style={{ margin: '0 auto 8px', width: 64, height: 64 }}>
                    <img src={char.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = '/nira_logo.png'; }} />
                  </IonAvatar>
                  <IonText style={{ fontSize: 13, fontWeight: 600, color: '#3D362F', display: 'block' }}>{char.name}</IonText>
                  <IonBadge color="success" style={{ fontSize: 10, marginBottom: 6 }}>已解锁</IonBadge>
                  <IonButton size="small" expand="block" onClick={() => handleCall(char.id)} style={{ '--background': '#C4A882', fontSize: 12, height: 32 }}>
                    <IonIcon icon={videocamOutline} slot="start" />视频通话
                  </IonButton>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        )}

        <IonModal isOpen={showCallConfirm} onDidDismiss={() => setShowCallConfirm(false)}>
          <div style={{ padding: 24, textAlign: 'center' }}>
            <IonAvatar style={{ margin: '0 auto 16px', width: 80, height: 80 }}>
              <img src={selectedChar?.avatar || '/nira_logo.png'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            </IonAvatar>
            <IonText style={{ fontSize: 18, fontWeight: 600, color: '#3D362F', display: 'block', marginBottom: 8 }}>
              与 {selectedChar?.name} 视频通话
            </IonText>
            <IonText style={{ fontSize: 14, color: '#8B7D72' }}>
              <IonIcon icon={walletOutline} style={{ verticalAlign: 'middle' }} /> 按分钟计费
            </IonText>
            <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'center' }}>
              <IonButton fill="outline" onClick={() => setShowCallConfirm(false)}>取消</IonButton>
              <IonButton onClick={confirmCall} style={{ '--background': '#C4A882' }}>
                <IonIcon icon={callOutline} slot="start" />发起通话
              </IonButton>
            </div>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default DigitalHumanPage;