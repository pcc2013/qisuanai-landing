// D:\nira-app\src\components\CleaningLevelSelector.tsx（修正版：全部硬编码中文替换为 t() 多语言函数）

import React, { useState } from 'react';
import {
  IonModal, IonContent, IonHeader, IonToolbar, IonTitle,
  IonButtons, IonButton, IonIcon, IonText, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonCardSubtitle, IonBadge, IonChip,
  useIonToast,
} from '@ionic/react';
import {
  shieldCheckmarkOutline, checkmarkCircle, warningOutline,
  ribbonOutline, businessOutline,
} from 'ionicons/icons';
import { useLocaleStore } from '../store/useLocaleStore';
import { useQSStore } from '../store/useQSStore';
import { useSubscriptionStore } from '../store/useSubscriptionStore';

interface CleaningLevelSelectorProps {
  onConfirm: (level: string) => void;
  onCancel: () => void;
}

const CleaningLevelSelector: React.FC<CleaningLevelSelectorProps> = ({ onConfirm, onCancel }) => {
  const { t, locale } = useLocaleStore();
  const { qsBalance } = useQSStore();
  const { currentTier } = useSubscriptionStore();
  const [presentToast] = useIonToast();
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [disclaimerAgreed, setDisclaimerAgreed] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const tierLabels: Record<string, string> = {
    free: t('cleaning.locked_monthly'),
    monthly: t('cleaning.locked_monthly'),
    'semi-annual': t('cleaning.locked_monthly'),
    annual: t('cleaning.locked_annual'),
    enterprise: t('cleaning.enterprise_entry'),
  };

  const CLEANING_LEVELS = [
    {
      level: 'heavy',
      title: t('cleaning.heavy_title'),
      description: t('cleaning.heavy_desc'),
      privacy: t('cleaning.privacy_zero'),
      price: 1999,
      icon: shieldCheckmarkOutline,
      color: '#4CAF50',
      requiredTier: 'monthly',
      rewards: t('cleaning.restore_one'),
    },
    {
      level: 'medium',
      title: t('cleaning.medium_title'),
      description: t('cleaning.medium_desc'),
      privacy: t('cleaning.privacy_low'),
      price: 3999,
      icon: ribbonOutline,
      color: '#FF9800',
      requiredTier: 'monthly',
      rewards: t('cleaning.restore_three'),
    },
    {
      level: 'light',
      title: t('cleaning.light_title'),
      description: t('cleaning.light_desc'),
      privacy: t('cleaning.privacy_self'),
      price: 9999,
      icon: warningOutline,
      color: '#E88B7D',
      requiredTier: 'annual',
      rewards: t('cleaning.restore_five'),
      requiresDisclaimer: true,
    },
    {
      level: 'enterprise',
      title: t('cleaning.enterprise_title'),
      description: t('cleaning.enterprise_desc'),
      privacy: t('cleaning.privacy_contract'),
      price: 0,
      icon: businessOutline,
      color: '#667eea',
      requiredTier: 'enterprise',
      rewards: t('cleaning.restore_five'),
      isExternal: true,
    },
  ];

  const checkAvailability = (level: typeof CLEANING_LEVELS[0]) => {
    if (level.isExternal) return true;

    if (level.requiredTier === 'annual' && currentTier !== 'annual' && currentTier !== 'enterprise') {
      presentToast({ message: t('cleaning.locked_annual'), duration: 2000, color: 'warning' });
      return false;
    }

    if (level.requiredTier === 'monthly' && currentTier === 'free') {
      presentToast({ message: t('cleaning.locked_monthly'), duration: 2000, color: 'warning' });
      return false;
    }

    if (level.price > 0 && qsBalance < level.price) {
      presentToast({ message: `${t('cleaning.balance_label')}: ${qsBalance} QS`, duration: 3000, color: 'danger' });
      return false;
    }

    return true;
  };

  const handleSelect = (level: typeof CLEANING_LEVELS[0]) => {
    if (level.isExternal) {
      window.location.href = 'mailto:admin@qisuanai.com';
      return;
    }
    if (!checkAvailability(level)) return;
    if (level.requiresDisclaimer) {
      setSelectedLevel(level.level);
      setShowDisclaimer(true);
    } else {
      onConfirm(level.level);
    }
  };

  const handleDisclaimerAgree = () => {
    setShowDisclaimer(false);
    setDisclaimerAgreed(false);
    if (selectedLevel) onConfirm(selectedLevel);
  };

  return (
    <>
      <IonModal isOpen={true} onDidDismiss={onCancel}>
        <IonHeader>
          <IonToolbar style={{ '--background': '#DCE8F0' }}>
            <IonButtons slot="start">
              <IonButton onClick={onCancel} style={{ '--color': '#3D362F' }}>{t('cleaning.cancel')}</IonButton>
            </IonButtons>
            <IonTitle style={{ fontSize: 16, color: '#3D362F' }}>{t('cleaning.title')}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent style={{ '--background': '#F5F0EB' }} className="ion-padding">
          <div style={{ marginBottom: 16 }}>
            <IonBadge color="medium" style={{ fontSize: 12, marginRight: 8 }}>
              {t('cleaning.subscription_label')}: {tierLabels[currentTier] || currentTier}
            </IonBadge>
            <IonBadge color="warning" style={{ fontSize: 12 }}>
              {t('cleaning.balance_label')}: {qsBalance} QS
            </IonBadge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {CLEANING_LEVELS.map((level) => {
              const isLocked = !level.isExternal &&
                ((level.requiredTier === 'annual' && currentTier !== 'annual' && currentTier !== 'enterprise') ||
                 (level.requiredTier === 'monthly' && currentTier === 'free') ||
                 (level.requiredTier === 'enterprise' && currentTier !== 'enterprise'));

              return (
                <IonCard
                  key={level.level}
                  button={!level.isExternal}
                  onClick={() => handleSelect(level)}
                  style={{ opacity: isLocked ? 0.6 : 1, borderLeft: `4px solid ${level.color}` }}
                >
                  <IonCardHeader>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <IonIcon icon={level.icon} style={{ fontSize: 24, color: level.color }} />
                        <IonCardTitle style={{ fontSize: 15 }}>{level.title}</IonCardTitle>
                      </div>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        {level.isExternal && <IonChip color="tertiary" style={{ fontSize: 10 }}>{t('cleaning.enterprise_entry')}</IonChip>}
                        {level.requiresDisclaimer && <IonChip color="warning" style={{ fontSize: 10 }}>{t('cleaning.need_disclaimer')}</IonChip>}
                        {isLocked && <IonChip color="medium" style={{ fontSize: 10 }}>{tierLabels[level.requiredTier]}</IonChip>}
                        {!isLocked && !level.isExternal && <IonChip color="success" style={{ fontSize: 10 }}>{t('cleaning.available')}</IonChip>}
                      </div>
                    </div>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonCardSubtitle style={{ fontSize: 12, marginBottom: 8 }}>
                      🛡️ {level.privacy} &nbsp;|&nbsp; {level.rewards}
                    </IonCardSubtitle>
                    <IonText style={{ fontSize: 12, color: '#3D362F' }}>{level.description}</IonText>
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <IonText style={{ fontWeight: 600, color: level.color }}>
                        {level.isExternal ? 'admin@qisuanai.com' : `${level.price.toLocaleString()} QS`}
                      </IonText>
                      {!level.isExternal && !isLocked && <IonIcon icon={checkmarkCircle} style={{ color: level.color }} />}
                    </div>
                  </IonCardContent>
                </IonCard>
              );
            })}
          </div>
        </IonContent>
      </IonModal>

      <IonModal isOpen={showDisclaimer} onDidDismiss={() => setShowDisclaimer(false)}>
        <IonHeader>
          <IonToolbar style={{ '--background': '#E88B7D' }}>
            <IonTitle style={{ fontSize: 16, color: '#fff' }}>{t('disclaimer.header')}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding" style={{ '--background': '#F5F0EB' }}>
          <IonText style={{ fontSize: 14, color: '#3D362F', lineHeight: 1.8 }}>
            <h3 style={{ color: '#E88B7D' }}>{t('disclaimer.section1_title')}</h3>
            <p>{t('disclaimer.section1_text')}</p>
            <ul>
              <li>{t('disclaimer.retained_1')}</li>
              <li>{t('disclaimer.retained_2')}</li>
              <li>{t('disclaimer.retained_3')}</li>
              <li>{t('disclaimer.retained_4')}</li>
              <li>{t('disclaimer.retained_5')}</li>
            </ul>
            <h3 style={{ color: '#E88B7D' }}>{t('disclaimer.section2_title')}</h3>
            <p>{t('disclaimer.risk_1')}</p>
            <p>{t('disclaimer.risk_2')}</p>
            <p>{t('disclaimer.risk_3')}</p>
            <h3 style={{ color: '#E88B7D' }}>{t('disclaimer.section3_title')}</h3>
            <p>{t('disclaimer.confirm_text')}</p>
          </IonText>
          <div style={{ marginTop: 20 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
              <input type="checkbox" checked={disclaimerAgreed} onChange={(e) => setDisclaimerAgreed(e.target.checked)} style={{ accentColor: '#E88B7D', width: 18, height: 18 }} />
              {t('disclaimer.agree_checkbox')}
            </label>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <IonButton fill="outline" expand="block" onClick={() => setShowDisclaimer(false)}>{t('disclaimer.cancel_btn')}</IonButton>
            <IonButton expand="block" disabled={!disclaimerAgreed} onClick={handleDisclaimerAgree} style={{ '--background': '#E88B7D' }}>{t('disclaimer.confirm_btn')}</IonButton>
          </div>
        </IonContent>
      </IonModal>
    </>
  );
};

export default CleaningLevelSelector;