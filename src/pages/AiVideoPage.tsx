// D:\nira-app\src\pages\AiVideoPage.tsx

import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonText } from '@ionic/react';
import { useLocaleStore } from '../store/useLocaleStore';

const AiVideoPage: React.FC = () => {
  const { t } = useLocaleStore();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': '#F5F0EB' }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle style={{ fontSize: 16, color: '#3D362F' }}>
            {t('digitalHuman.title') || 'AI Video'}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent style={{ '--background': '#F5F0EB' }}>
        <div style={{ padding: 48, textAlign: 'center' }}>
          <IonText style={{ fontSize: 14, color: '#8B7D72' }}>
            AI Video Call — Coming soon.
          </IonText>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AiVideoPage;