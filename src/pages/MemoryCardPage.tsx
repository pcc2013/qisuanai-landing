import React from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonToggle, IonLabel, IonIcon, IonBadge } from '@ionic/react';
import { lockClosed, lockOpen } from 'ionicons/icons';
import { useMemoryStore } from '../store/useMemoryStore';
import { useLocaleStore } from '../store/useLocaleStore';

const MemoryCardPage: React.FC = () => {
  const cards = useMemoryStore((s) => s.cards);
  const toggleLicensable = useMemoryStore((s) => s.toggleLicensable);
  const t = useLocaleStore((s) => s.t);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonMenuButton /></IonButtons>
          <IonTitle>{t('memory_card')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {cards.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: 64 }}><IonLabel color="medium">{t('no_memory_cards')}</IonLabel></div>
        ) : (
          cards.map((card) => (
            <IonCard key={card.id} style={{ position: 'relative' }}>
              <IonCardHeader><IonCardTitle>{card.title}</IonCardTitle></IonCardHeader>
              <IonCardContent>
                <p>{card.content}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                  <IonBadge color={card.emotion === 'positive' ? 'success' : 'medium'}>{card.emotion}</IonBadge>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <IonIcon icon={card.isLicensable ? lockOpen : lockClosed} color={card.isLicensable ? 'tertiary' : 'medium'} />
                    <IonToggle checked={card.isLicensable} onIonChange={() => toggleLicensable(card.id)} enableOnOffLabels />
                    <IonLabel style={{ fontSize: 10, color: 'var(--ion-color-medium)' }}>
                      {card.isLicensable ? t('memory.licensable_on') : t('memory.licensable_off')}
                    </IonLabel>
                  </div>
                </div>
                {card.licensableChangedAt && (
                  <IonLabel style={{ fontSize: 10, color: 'var(--ion-color-tertiary)', marginTop: 4 }}>{t('memory.toggle_hint')}</IonLabel>
                )}
              </IonCardContent>
            </IonCard>
          ))
        )}
      </IonContent>
    </IonPage>
  );
};

export default MemoryCardPage;