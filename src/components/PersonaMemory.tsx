// D:\nira-app\src\components\PersonaMemory.tsx

import React from 'react';
import { IonText, IonCard, IonCardContent, IonIcon } from '@ionic/react';
import { heartOutline, timeOutline } from 'ionicons/icons';
import { useIntimacyStore, LEVEL_NAMES } from '../store/useIntimacyStore';
import { useLocaleStore } from '../store/useLocaleStore';

interface PersonaMemoryProps {
  personaId: string;
}

const PersonaMemory: React.FC<PersonaMemoryProps> = ({ personaId }) => {
  const { entries } = useIntimacyStore();
  const { t } = useLocaleStore();
  const entry = entries[personaId];

  if (!entry) {
    return (
      <IonCard style={{ borderRadius: 12, backgroundColor: '#fff', margin: '0 16px 8px' }}>
        <IonCardContent style={{ padding: 16, textAlign: 'center' }}>
          <IonText style={{ fontSize: 13, color: '#8B7D72' }}>
            Start chatting to build intimacy.
          </IonText>
        </IonCardContent>
      </IonCard>
    );
  }

  return (
    <IonCard style={{ borderRadius: 12, backgroundColor: '#fff', margin: '0 16px 8px' }}>
      <IonCardContent style={{ padding: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <IonIcon icon={heartOutline} style={{ color: '#E88B7D', fontSize: 20 }} />
          <IonText style={{ fontSize: 14, fontWeight: 600, color: '#3D362F' }}>
            {t(LEVEL_NAMES[entry.level]) || `Level ${entry.level}`}
          </IonText>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <IonIcon icon={timeOutline} style={{ color: '#8B7D72', fontSize: 14 }} />
          <IonText style={{ fontSize: 11, color: '#8B7D72' }}>Score: {entry.score}</IonText>
        </div>
        <div style={{ width: '100%', height: 4, backgroundColor: '#F0EDE8', borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
          <div style={{ width: `${Math.min(100, (entry.score / 1000) * 100)}%`, height: '100%', backgroundColor: '#E88B7D', borderRadius: 2, transition: 'width 0.5s' }} />
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default PersonaMemory;