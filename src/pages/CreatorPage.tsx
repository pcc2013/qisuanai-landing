import React from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonButton, IonIcon, IonText } from '@ionic/react';
import { brush, people, trendingUp, codeSlash } from 'ionicons/icons';
import { useLocaleStore } from '../store/useLocaleStore';

const CreatorPage: React.FC = () => {
  const t = useLocaleStore((s) => s.t);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonMenuButton /></IonButtons>
          <IonTitle>{t('creator.title')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <IonCard style={{ textAlign: 'center', padding: '24px 16px', background: 'linear-gradient(135deg, var(--ion-color-primary), var(--ion-color-secondary))', color: 'white' }}>
          <IonCardHeader>
            <IonIcon icon={brush} style={{ fontSize: 48, color: 'white' }} />
            <IonCardTitle style={{ marginTop: 12, color: 'white' }}>{t('creator.title')}</IonCardTitle>
            <IonCardSubtitle style={{ color: 'rgba(255,255,255,0.9)' }}>{t('creator.coming_soon')}</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonText style={{ color: 'rgba(255,255,255,0.95)' }}><p>{t('creator.subtitle')}</p></IonText>
          </IonCardContent>
        </IonCard>

        {[
          [people, 'primary', 'creator.path1_title', 'creator.path1_desc'],
          [trendingUp, 'tertiary', 'creator.path2_title', 'creator.path2_desc'],
          [codeSlash, 'success', 'creator.path3_title', 'creator.path3_desc'],
        ].map(([icon, color, titleKey, descKey]) => (
          <IonCard key={titleKey as string} style={{ marginTop: 12 }}>
            <IonCardHeader>
              <IonIcon icon={icon} slot="start" color={color as string} />
              <IonCardTitle>{t(titleKey as string)}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent><IonText color="medium">{t(descKey as string)}</IonText></IonCardContent>
          </IonCard>
        ))}

        <div style={{ textAlign: 'center', marginTop: 24, marginBottom: 32 }}>
          <IonButton expand="block" disabled>{t('creator.coming_soon')}</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CreatorPage;