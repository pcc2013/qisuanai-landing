// D:\nira-app\src\components\RiskDisclosure.tsx

import React, { useState } from 'react';
import { IonButton, IonCheckbox, IonText } from '@ionic/react';
import { useLocaleStore } from '../store/useLocaleStore';

interface RiskDisclosureProps {
  onAgree: () => void;
  onCancel: () => void;
}

const RiskDisclosure: React.FC<RiskDisclosureProps> = ({ onAgree, onCancel }) => {
  const { t } = useLocaleStore();
  const [isAgree, setIsAgree] = useState(false);

  return (
    <div style={{ padding: 24 }}>
      <IonText style={{ fontSize: 16, fontWeight: 600, color: '#3D362F', display: 'block', marginBottom: 12 }}>
        ⚠️ {t('riskDisclosure.title')}
      </IonText>
      <IonText style={{ fontSize: 13, color: '#8B7D72', display: 'block', marginBottom: 16, lineHeight: 1.6 }}>
        {t('riskDisclosure.content')}
      </IonText>
      <div style={{ marginBottom: 16 }}>
        <IonCheckbox checked={isAgree} onIonChange={(e) => setIsAgree(e.detail.checked)} labelPlacement="end">
          <IonText style={{ fontSize: 13, color: '#3D362F' }}>{t('riskDisclosure.agree')}</IonText>
        </IonCheckbox>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <IonButton expand="block" fill="outline" onClick={onCancel} style={{ '--border-color': '#E0D8CE', '--color': '#8B7D72', flex: 1 }}>
          {t('riskDisclosure.cancel')}
        </IonButton>
        <IonButton expand="block" disabled={!isAgree} onClick={onAgree} style={{ '--background': '#C4A882', flex: 1 }}>
          {t('riskDisclosure.confirm')}
        </IonButton>
      </div>
    </div>
  );
};

export default RiskDisclosure;