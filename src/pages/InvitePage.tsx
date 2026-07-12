// D:\nira-app\src\pages\InvitePage.tsx

import React from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonMenuButton, IonButton, IonIcon, IonText, IonItem, IonLabel,
  useIonToast,
} from '@ionic/react';
import { copyOutline, shareOutline } from 'ionicons/icons';
import { useLocaleStore } from '../store/useLocaleStore';
import { useAuthStore } from '../store/useAuthStore';

const InvitePage: React.FC = () => {
  const { t } = useLocaleStore();
  const { user } = useAuthStore();
  const [presentToast] = useIonToast();
  const niraId = user?.niraId || 'Nira00000';
  const inviteLink = `https://qisuanai.com/register?invite=${niraId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      presentToast({ message: t('copied') || '链接已复制！', duration: 1500, color: 'success' });
    } catch {
      presentToast({ message: '复制失败', duration: 1500, color: 'danger' });
    }
  };

  const handleShare = async () => {
    const text = `加入 Nira，用我的邀请码：${niraId}\n${inviteLink}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Nira 邀请', text, url: inviteLink });
      } else {
        await navigator.clipboard.writeText(text);
        presentToast({ message: t('copied') || '已复制！', duration: 1500, color: 'success' });
      }
    } catch {}
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': '#DCE8F0' }}>
          <IonButtons slot="start">
            <IonMenuButton style={{ '--color': '#3D362F' }} />
          </IonButtons>
          <IonTitle style={{ fontSize: 16, color: '#3D362F' }}>{t('invite_friend') || '邀请好友'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent style={{ '--background': '#F5F0EB' }}>
        <div style={{ padding: 24 }}>
          <IonItem lines="none" style={{ backgroundColor: '#fff', borderRadius: 12, marginBottom: 16 }}>
            <IonLabel>
              <IonText style={{ fontSize: 12, color: '#8B7D72' }}>{t('your_invite_code') || '你的邀请码'}</IonText>
              <IonText style={{ fontSize: 20, fontWeight: 700, color: '#C4A882', display: 'block', marginTop: 4 }}>{niraId}</IonText>
            </IonLabel>
            <IonButton slot="end" fill="clear" onClick={handleCopy}>
              <IonIcon icon={copyOutline} />
            </IonButton>
          </IonItem>

          <IonItem lines="none" style={{ backgroundColor: '#fff', borderRadius: 12, marginBottom: 16 }}>
            <IonLabel>
              <IonText style={{ fontSize: 12, color: '#8B7D72' }}>邀请链接</IonText>
              <IonText style={{ fontSize: 13, color: '#4A90D9', display: 'block', marginTop: 4, wordBreak: 'break-all' }}>{inviteLink}</IonText>
            </IonLabel>
          </IonItem>

          <IonButton expand="block" onClick={handleShare} style={{ '--background': '#C4A882' }}>
            <IonIcon icon={shareOutline} slot="start" />
            {t('share') || '分享给好友'}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default InvitePage;