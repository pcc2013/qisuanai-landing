// D:\nira-app\src\pages\RechargePage.tsx

import React from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonButton, IonIcon, IonText, IonCard, IonCardContent,
  IonBadge, useIonToast,
} from '@ionic/react';
import { walletOutline, cardOutline } from 'ionicons/icons';
import { useLocaleStore } from '../store/useLocaleStore';
import { useQSStore } from '../store/useQSStore';
import { useAuthStore } from '../store/useAuthStore';
import { qsManagerAdapter } from '../adapters/qsManager';

const RECHARGE_TIERS = [
  { usd: 5, qs: 500 },
  { usd: 10, qs: 1000 },
  { usd: 20, qs: 2000 },
  { usd: 50, qs: 5800 },
  { usd: 100, qs: 12000 },
];

const RechargePage: React.FC = () => {
  const { t } = useLocaleStore();
  const { addQS } = useQSStore();
  const { hasFirstRecharge, markFirstRecharge } = useAuthStore();
  const [presentToast] = useIonToast();

  const handleRecharge = (usd: number, qs: number) => {
    qsManagerAdapter.recharge('', usd, { paymentIntentId: 'mock_' + Date.now() });
    presentToast({ message: t('recharge_success') || `Recharged ${qs} QS!`, duration: 2000, color: 'success' });
  };

  const handleFirstRecharge = () => {
    handleRecharge(0.99, 199);
    markFirstRecharge();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': '#F5F0EB' }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle style={{ fontSize: 16, color: '#3D362F' }}>{t('recharge') || 'Recharge'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent style={{ '--background': '#F5F0EB' }}>
        {/* 首充横幅 */}
        {!hasFirstRecharge && (
          <IonCard style={{ margin: 16, borderRadius: 16, backgroundColor: '#FFF8E1', border: '2px solid #C4A882' }}>
            <IonCardContent style={{ textAlign: 'center', padding: 16 }}>
              <IonIcon icon={walletOutline} style={{ fontSize: 36, color: '#C4A882', marginBottom: 8 }} />
              <IonBadge style={{ backgroundColor: '#C4A882', color: '#fff', fontSize: 11, marginBottom: 8 }}>
                {t('first_recharge_banner') || 'First Recharge: $0.99 = 199 QS'}
              </IonBadge>
              <IonText style={{ fontSize: 11, color: '#8B7D72', display: 'block', marginBottom: 12 }}>
                One-time only offer for new users.
              </IonText>
              <IonButton expand="block" onClick={handleFirstRecharge} style={{ '--background': '#C4A882', fontWeight: 700, height: 44 }}>
                {t('buy_now') || 'Buy Now'} · $0.99 = 199 QS
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}

        {/* 正常充值档位 */}
        <div style={{ padding: '0 16px 24px' }}>
          <IonText style={{ fontSize: 14, fontWeight: 600, color: '#3D362F', display: 'block', marginBottom: 12 }}>
            {t('recharge') || 'Recharge Options'}
          </IonText>
          {RECHARGE_TIERS.map((tier) => (
            <IonCard key={tier.usd} style={{ borderRadius: 12, backgroundColor: '#fff', marginBottom: 8 }}>
              <IonCardContent style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <IonIcon icon={cardOutline} style={{ fontSize: 24, color: '#8B7D72' }} />
                  <div>
                    <IonText style={{ fontSize: 15, fontWeight: 600, color: '#3D362F' }}>${tier.usd}</IonText>
                    <IonText style={{ fontSize: 12, color: '#8B7D72', display: 'block' }}>= {tier.qs} QS</IonText>
                  </div>
                </div>
                <IonButton size="small" onClick={() => handleRecharge(tier.usd, tier.qs)}>
                  ${tier.usd}
                </IonButton>
              </IonCardContent>
            </IonCard>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RechargePage;