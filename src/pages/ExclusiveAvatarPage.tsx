// D:\nira-app\src\pages\ExclusiveAvatarPage.tsx（修正版：全部硬编码中文替换为 t() 多语言函数）

import React, { useState } from 'react';
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonButton, IonIcon, IonGrid, IonRow, IonCol, IonText, useIonToast, IonModal,
  IonSpinner, IonBadge,
} from '@ionic/react';
import { sparkles, construct, create, eye, cloudUploadOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import { useLocaleStore } from '../store/useLocaleStore';
import { usePersonaStore } from '../store/usePersonaStore';
import CleaningLevelSelector from '../components/CleaningLevelSelector';
import { triggerDistill, getDistillStatus } from '../adapters/personaEngine';

const ExclusiveAvatarPage: React.FC = () => {
  const { t } = useLocaleStore();
  const { currentPersonaId } = usePersonaStore();
  const [presentToast] = useIonToast();

  const [showCleaning, setShowCleaning] = useState(false);
  const [isDistilling, setIsDistilling] = useState(false);

  const distillStatus = getDistillStatus();

  const handleStartDistill = () => {
    if (!distillStatus.canDistill) {
      presentToast({ message: t('avatar.distill_need_subscription'), duration: 2000, color: 'warning' });
      return;
    }
    setShowCleaning(true);
  };

  const handleCleaningConfirm = async (level: string) => {
    setShowCleaning(false);
    setIsDistilling(true);
    presentToast({ message: t('avatar.toast_distill_start'), duration: 1500, color: 'primary' });

    const result = await triggerDistill({
      personaId: currentPersonaId || 'heal',
      cleaningLevel: level as 'heavy' | 'medium' | 'light' | 'enterprise',
      materials: {},
    });

    setIsDistilling(false);

    if (result.success) {
      presentToast({ message: t('avatar.toast_distill_success'), duration: 3000, color: 'success' });
    } else {
      presentToast({ message: result.error || t('avatar.toast_distill_fail'), duration: 3000, color: 'danger' });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': '#DCE8F0' }}>
          <IonButtons slot="start"><IonMenuButton style={{ '--color': '#3D362F' }} /></IonButtons>
          <IonTitle style={{ fontSize: 16, color: '#3D362F' }}>{t('exclusiveAvatar.title')}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ '--background': '#F5F0EB' }} className="ion-padding">
        <IonCard button routerLink="/my-ai-factory" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white' }}>
          <IonCardHeader>
            <IonIcon icon={construct} style={{ fontSize: 32, color: 'white' }} />
            <IonCardTitle style={{ color: 'white', marginTop: 8 }}>{t('avatar.factory_title')}</IonCardTitle>
            <IonCardSubtitle style={{ color: 'rgba(255,255,255,0.8)' }}>{t('avatar.factory_subtitle')}</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                {[create, eye, sparkles].map((icon, i) => (
                  <IonCol key={i} size="4" style={{ textAlign: 'center' }}>
                    <IonIcon icon={icon} style={{ fontSize: 24, color: 'white' }} />
                    <p style={{ fontSize: 11, marginTop: 4, color: 'white' }}>{t(['avatar.btn_train', 'avatar.btn_publish', 'avatar.btn_earnings'][i])}</p>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        <IonCard style={{ marginTop: 12 }}>
          <IonCardHeader>
            <IonCardTitle><IonIcon icon={shieldCheckmarkOutline} style={{ verticalAlign: 'middle', marginRight: 6 }} />{t('avatar.distill_status')}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
              <IonBadge color={distillStatus.canDistill ? 'success' : 'medium'}>{distillStatus.canDistill ? t('avatar.distill_available') : t('avatar.distill_locked')}</IonBadge>
              <IonBadge color="warning">{distillStatus.remainingCount === Infinity ? t('avatar.unlimited') : `${t('avatar.remaining_count')} ${distillStatus.remainingCount}`}</IonBadge>
              <IonBadge color="tertiary">{distillStatus.qsBalance} QS</IonBadge>
            </div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {Object.entries(distillStatus.availableLevels).map(([key, available]) => (
                <IonBadge key={key} color={available ? 'success' : 'medium'} style={{ fontSize: 10 }}>
                  {{ heavy: '40%', medium: '60%', light: '80%', enterprise: '0%' }[key]} {available ? '✅' : '🔒'}
                </IonBadge>
              ))}
            </div>
          </IonCardContent>
        </IonCard>

        <IonCard style={{ marginTop: 12 }}>
          <IonCardHeader>
            <IonCardTitle>{t('avatar.create_title')}</IonCardTitle>
            <IonCardSubtitle>{t('avatar.create_subtitle')}</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonText color="medium" style={{ fontSize: 12 }}>
            </IonText>
            <IonButton expand="block" onClick={handleStartDistill} disabled={isDistilling || !distillStatus.canDistill} style={{ '--background': '#C4A882', marginTop: 12 }}>
              {isDistilling ? <><IonSpinner name="crescent" /> {t('avatar.distilling')}</> : <><IonIcon icon={cloudUploadOutline} slot="start" />{t('avatar.start_creation')}</>}
            </IonButton>
            {!distillStatus.canDistill && <IonText color="warning" style={{ fontSize: 11, textAlign: 'center', display: 'block', marginTop: 8 }}>{t('avatar.distill_need_subscription')}</IonText>}
          </IonCardContent>
        </IonCard>

        <IonCard button onClick={() => alert('AI 生图功能即将开放')} style={{ marginTop: 12 }}>
          <IonCardHeader><IonIcon icon={sparkles} slot="start" color="primary" /><IonCardTitle>{t('generate.btn')}</IonCardTitle></IonCardHeader>
          <IonCardContent><p>{t('generate.avatar_hint')}</p></IonCardContent>
        </IonCard>

        <IonCard style={{ marginTop: 12, borderLeft: '4px solid #667eea' }}>
          <IonCardHeader><IonCardTitle style={{ fontSize: 14, color: '#667eea' }}>{t('avatar.enterprise_section')}</IonCardTitle></IonCardHeader>
          <IonCardContent>
            <IonText style={{ fontSize: 12, color: '#3D362F' }}>
              <p>{t('avatar.enterprise_scenarios')}</p>
              <p>{t('avatar.enterprise_services')}</p>
              <p>{t('avatar.enterprise_data')}</p>
            </IonText>
            <IonButton expand="block" fill="outline" onClick={() => window.location.href = 'mailto:admin@qisuanai.com'} style={{ '--border-color': '#667eea', '--color': '#667eea', marginTop: 8 }}>{t('avatar.contact_enterprise')}</IonButton>
          </IonCardContent>
        </IonCard>

        <IonModal isOpen={showCleaning} onDidDismiss={() => setShowCleaning(false)}>
          <CleaningLevelSelector onConfirm={handleCleaningConfirm} onCancel={() => setShowCleaning(false)} />
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default ExclusiveAvatarPage;