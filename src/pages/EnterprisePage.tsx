// D:\nira-app\src\pages\EnterprisePage.tsx

import React from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonButton, IonIcon, IonText, useIonToast,
} from '@ionic/react';
import {
  arrowBackOutline, mailOutline, businessOutline,
  shieldCheckmarkOutline, serverOutline, constructOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useLocaleStore } from '../store/useLocaleStore';

export const EnterprisePage: React.FC = () => {
  const history = useHistory();
  const { t } = useLocaleStore();
  const [presentToast] = useIonToast();

  const handleConsult = () => {
    window.open('mailto:enterprise@qisuanai.com', '_blank');
    presentToast({
      message: t('enterprise.success') || 'Email sent!',
      duration: 2000,
      color: 'success',
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
          <IonTitle style={{ fontSize: 16, color: '#3D362F' }}>
            {t('enterprise.title') || 'Enterprise'}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent style={{ '--background': '#F5F0EB' }}>
        <div style={{ padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>
            {'\uD83C\uDFE2'}
          </div>
          <IonText
            style={{
              fontSize: 18, fontWeight: 600, color: '#3D362F',
              display: 'block', marginBottom: 24,
            }}
          >
            {t('enterprise.feature') || 'Enterprise Solutions'}
          </IonText>
          <div
            style={{
              display: 'flex', flexWrap: 'wrap', gap: 16,
              justifyContent: 'center', marginBottom: 32,
            }}
          >
            {[
              { icon: serverOutline, label: 'Private Deployment' },
              { icon: shieldCheckmarkOutline, label: 'Data Isolation' },
              { icon: constructOutline, label: 'Custom API' },
              { icon: businessOutline, label: 'SLA Guarantee' },
            ].map((f, i) => (
              <div
                key={i}
                style={{
                  width: 120, background: '#fff', borderRadius: 12,
                  padding: 12, textAlign: 'center',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                }}
              >
                <IonIcon
                  icon={f.icon}
                  style={{ fontSize: 32, color: '#C4A882', marginBottom: 8 }}
                />
                <IonText style={{ fontSize: 11, color: '#3D362F' }}>{f.label}</IonText>
              </div>
            ))}
          </div>
          <IonButton
            expand="block"
            onClick={handleConsult}
            style={{ '--background': '#C4A882', maxWidth: 300, margin: '0 auto' }}
          >
            <IonIcon icon={mailOutline} slot="start" />
            {t('enterprise.consult') || 'Contact Us'} - enterprise@qisuanai.com
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default EnterprisePage;