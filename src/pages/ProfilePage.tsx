// D:\nira-app\src\pages\ProfilePage.tsx

import React, { useState, useMemo } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonMenuButton, IonSegment, IonSegmentButton, IonCard, IonCardContent,
  IonText, IonIcon, IonLabel, IonItem, IonList, IonBadge,
  IonButton,
} from '@ionic/react';
import {
  walletOutline,
  documentTextOutline,
  settingsOutline,
  arrowBackOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useLocaleStore } from '../store/useLocaleStore';
import { useQSStore } from '../store/useQSStore';

type ProfileTab = 'wallet' | 'history' | 'settings';

const ProfilePage: React.FC = () => {
  const history = useHistory();
  const { t } = useLocaleStore();
  const { qsBalance, transactions } = useQSStore();
  const [activeTab, setActiveTab] = useState<ProfileTab>('wallet');

  const { rechargeTotal, deductTotal } = useMemo(() => {
    return transactions.reduce(
      (acc, tx) => {
        if (tx.type === 'recharge') acc.rechargeTotal += tx.amount;
        if (tx.type === 'deduct') acc.deductTotal += tx.amount;
        return acc;
      },
      { rechargeTotal: 0, deductTotal: 0 }
    );
  }, [transactions]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': '#DCE8F0' as string }}>
          <IonButtons slot="start">
            <IonMenuButton style={{ '--color': '#3D362F' as string }} />
            <IonButton
              fill="clear"
              onClick={() => history.push('/home')}
              style={{ '--color': '#3D362F' as string }}
            >
              <IonIcon icon={arrowBackOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
          <IonTitle style={{ fontSize: 16, color: '#3D362F' }}>
            {t('profile.title') || 'Profile'}
          </IonTitle>
        </IonToolbar>
        <IonSegment
          value={activeTab}
          onIonChange={(e) => setActiveTab(e.detail.value as ProfileTab)}
          style={{ background: '#DCE8F0' }}
        >
          <IonSegmentButton value="wallet">
            <IonIcon icon={walletOutline} slot="start" />
            {t('profile.wallet') || 'Wallet'}
          </IonSegmentButton>
          <IonSegmentButton value="history">
            <IonIcon icon={documentTextOutline} slot="start" />
            {t('profile.record') || 'History'}
          </IonSegmentButton>
          <IonSegmentButton value="settings">
            <IonIcon icon={settingsOutline} slot="start" />
            {t('profile.setting') || 'Settings'}
          </IonSegmentButton>
        </IonSegment>
      </IonHeader>

      <IonContent style={{ '--background': '#F5F0EB' as string }} className="ion-padding">
        {activeTab === 'wallet' && (
          <IonCard>
            <IonCardContent style={{ textAlign: 'center' }}>
              <IonText style={{ fontSize: 14, color: '#8B7D72', display: 'block' }}>
                {t('profile.qsBalance') || 'QS Balance'}
              </IonText>
              <IonText
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  color: '#C4A882',
                  display: 'block',
                  margin: '8px 0',
                }}
              >
                {qsBalance} QS
              </IonText>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                <IonBadge color="success">
                  {t('profile.rechargeRecord') || 'Total Recharged'} +{rechargeTotal} QS
                </IonBadge>
                <IonBadge color="warning">
                  {t('profile.consumeRecord') || 'Total Spent'} -{deductTotal} QS
                </IonBadge>
              </div>
            </IonCardContent>
          </IonCard>
        )}

        {activeTab === 'history' && (
          <>
            {transactions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <IonText color="medium">
                  {t('profile.noTransactions') || 'No transactions yet'}
                </IonText>
              </div>
            ) : (
              <IonList style={{ padding: 0 }}>
                {[...transactions].reverse().map((tx) => (
                  <IonItem key={tx.id} lines="full">
                    <IonLabel>
                      <h3>{tx.reason}</h3>
                      <p>{new Date(tx.time).toLocaleString()}</p>
                    </IonLabel>
                    <IonBadge
                      slot="end"
                      color={tx.type === 'recharge' ? 'success' : 'danger'}
                    >
                      {tx.type === 'recharge' ? '+' : '-'}
                      {tx.amount} QS
                    </IonBadge>
                  </IonItem>
                ))}
              </IonList>
            )}
          </>
        )}

        {activeTab === 'settings' && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <IonText
              color="medium"
              style={{ cursor: 'pointer' }}
              onClick={() => history.push('/settings')}
            >
              {t('settings.title') || 'Open Settings'} →
            </IonText>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;