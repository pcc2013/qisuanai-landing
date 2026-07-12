// D:\nira-app\src\pages\SubscribePage.tsx

import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonButton, IonIcon, IonText, IonCard, IonCardContent, IonGrid, IonRow, IonCol,
  IonBadge, useIonToast, useIonAlert,
} from '@ionic/react';
import { arrowBackOutline, checkmarkCircle } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useLocaleStore } from '../store/useLocaleStore';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { useAuthGuard } from '../guards/useAuthGuard';

const PLANS = [
  {
    id: 'monthly', tier: 'monthly' as const, nameKey: 'sub.monthly',
    price: '5.99', periodKey: 'sub.perMonth', qsBonus: '900',
    memoryDays: '50', personas: '2', voiceMin: '15',
    highlight: false,
  },
  {
    id: 'semi_annual', tier: 'semi_annual' as const, nameKey: 'sub.semiAnnual',
    price: '31.99', periodKey: 'sub.per6Month', qsBonus: '5,200',
    memoryDays: '300', personas: '3', voiceMin: '15',
    highlight: true,
  },
  {
    id: 'annual', tier: 'annual' as const, nameKey: 'sub.annual',
    price: '49.99', periodKey: 'sub.perYear', qsBonus: '11,000',
    memoryDays: '\u221E', personas: '5', voiceMin: '15',
    highlight: false,
  },
];

const COMPARISON_ROWS = [
  { labelKey: 'sub.memory', values: ['72h', '50d', '300d', '\u221E'] },
  { labelKey: 'sub.personas', values: ['1', '2', '3', '5'] },
  { labelKey: 'sub.voiceDaily', values: ['3min', '15min', '15min', '15min'] },
  { labelKey: 'sub.aiVideo', values: ['\u2717', '\u2713', '\u2713', '\u2713'] },
  { labelKey: 'sub.aiClone', values: ['\u2717', '\u2713', '\u2713', '\u2713'] },
  { labelKey: 'sub.responseSpeed', values: ['Normal', 'Fast', 'Ultra', 'Priority'] },
];

const SubscribePage: React.FC = () => {
  const history = useHistory();
  const { t } = useLocaleStore();
  const { guard } = useAuthGuard();
  const { currentTier, expiryDate, setSubscription } = useSubscriptionStore();
  const [presentToast] = useIonToast();
  const [presentAlert] = useIonAlert();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = (planId: string, tier: string) => {
    if (!guard('create_avatar')) return;
    if (currentTier === tier) {
      presentToast({ message: t('sub.alreadySubscribed') || 'Already on this plan', duration: 2000, color: 'warning' });
      return;
    }
    presentAlert({
      header: t('sub.confirmTitle') || 'Confirm Subscription',
      message: t('sub.confirmMsg') || 'Proceed to payment?',
      buttons: [
        { text: t('sub.cancel') || 'Cancel', role: 'cancel' },
        {
          text: t('sub.confirm') || 'Confirm',
          handler: async () => {
            setLoading(planId);
            await new Promise((r) => setTimeout(r, 1500));
            const expiry = new Date();
            if (planId === 'monthly') expiry.setMonth(expiry.getMonth() + 1);
            else if (planId === 'semi_annual') expiry.setMonth(expiry.getMonth() + 6);
            else if (planId === 'annual') expiry.setFullYear(expiry.getFullYear() + 1);
            setSubscription(tier as 'monthly' | 'semi_annual' | 'annual', expiry.toISOString());
            presentToast({ message: t('sub.success') || 'Subscription successful!', duration: 2000, color: 'success' });
            setLoading(null);
          },
        },
      ],
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': '#F5F0EB' }}>
          <IonButtons slot="start">
            <IonButton fill="clear" onClick={() => history.goBack()} style={{ '--color': '#3D362F' }}>
              <IonIcon icon={arrowBackOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle style={{ fontSize: 16, color: '#3D362F' }}>{t('sub.title') || 'Subscription'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent style={{ '--background': '#F5F0EB' }}>
        <div style={{ padding: '16px 16px 0' }}>
          <IonText style={{ fontSize: 14, fontWeight: 600, color: '#3D362F' }}>
            {t('sub.current') || 'Current Plan'}: {' '}
            <span style={{ color: '#C4A882' }}>
              {currentTier === 'free' ? (t('sub.free') || 'Pay-as-you-go') : (t(`sub.${currentTier}`) || currentTier)}
            </span>
          </IonText>
          {expiryDate && (
            <IonText style={{ fontSize: 12, color: '#8B7D72', display: 'block', marginTop: 4 }}>
              {t('sub.expiry') || 'Expires'}: {new Date(expiryDate).toLocaleDateString()}
            </IonText>
          )}
        </div>

        <div style={{ padding: '12px 16px 8px' }}>
          {PLANS.map((plan) => {
            const isCurrent = currentTier === plan.tier;
            const isLoading = loading === plan.id;
            return (
              <IonCard key={plan.id} style={{ margin: '0 0 12px 0', borderRadius: 16, boxShadow: plan.highlight ? '0 4px 20px rgba(196, 168, 130, 0.25)' : '0 1px 4px rgba(0,0,0,0.06)', border: plan.highlight ? '2px solid #C4A882' : '1px solid #E0D8CE', backgroundColor: '#FFFFFF' }}>
                <IonCardContent style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 4 }}>
                        <IonText style={{ fontSize: 24, fontWeight: 700, color: '#3D362F' }}>${plan.price}</IonText>
                        <IonText style={{ fontSize: 12, color: '#8B7D72', marginLeft: 4 }}>{t(plan.periodKey) || '/mo'}</IonText>
                      </div>
                      <IonText style={{ fontSize: 14, fontWeight: 600, color: '#3D362F', display: 'block', marginBottom: 2 }}>{t(plan.nameKey) || plan.id}</IonText>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', fontSize: 11, color: '#8B7D72', marginTop: 4 }}>
                        <span>+{plan.qsBonus} QS</span><span>{plan.memoryDays}d memory</span><span>{plan.personas} personas</span><span>{plan.voiceMin}min/day voice</span>
                      </div>
                    </div>
                    {plan.highlight && <IonBadge style={{ backgroundColor: '#C4A882', color: '#fff', fontSize: 10 }}>{t('sub.recommended') || 'Popular'}</IonBadge>}
                  </div>
                  <IonButton expand="block" size="small" onClick={() => handleSubscribe(plan.id, plan.tier)} disabled={isCurrent || isLoading !== null} style={{ '--background': isCurrent ? '#E0D8CE' : plan.highlight ? '#C4A882' : '#8B7D72', fontSize: 13, fontWeight: 600, height: 36, marginTop: 10 }}>
                    {isCurrent ? t('sub.currentPlan') || 'Current Plan' : isLoading ? t('sub.processing') || 'Processing...' : t('sub.subscribe') || 'Subscribe'}
                  </IonButton>
                </IonCardContent>
              </IonCard>
            );
          })}
        </div>

        <div style={{ padding: '0 16px 24px' }}>
          <IonText style={{ fontSize: 13, fontWeight: 600, color: '#3D362F', display: 'block', marginBottom: 8 }}>{t('sub.comparison') || 'Plan Comparison'}</IonText>
          <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <IonGrid style={{ padding: 0 }}>
              <IonRow style={{ backgroundColor: '#F5F0EB', padding: '8px 0', fontSize: 11, fontWeight: 600, color: '#8B7D72' }}>
                <IonCol size="4" style={{ textAlign: 'center' }}>{t('sub.benefit') || 'Benefit'}</IonCol><IonCol size="2" style={{ textAlign: 'center' }}>{t('sub.free') || 'Free'}</IonCol><IonCol size="2" style={{ textAlign: 'center' }}>{t('sub.monthlyShort') || 'M'}</IonCol><IonCol size="2" style={{ textAlign: 'center' }}>{t('sub.semiShort') || '6M'}</IonCol><IonCol size="2" style={{ textAlign: 'center' }}>{t('sub.annualShort') || 'Y'}</IonCol>
              </IonRow>
              {COMPARISON_ROWS.map((row, i) => (
                <IonRow key={i} style={{ padding: '6px 0', borderTop: '1px solid #F0EDE8', fontSize: 11, color: '#3D362F' }}>
                  <IonCol size="4" style={{ textAlign: 'center' }}>{t(row.labelKey) || row.labelKey}</IonCol>
                  {row.values.map((v, j) => <IonCol key={j} size="2" style={{ textAlign: 'center', color: v === '\u2713' ? '#4CAF50' : v === '\u2717' ? '#E88B7D' : '#3D362F' }}>{v}</IonCol>)}
                </IonRow>
              ))}
            </IonGrid>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SubscribePage;