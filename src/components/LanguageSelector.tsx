// D:\nira-app\src\components\LanguageSelector.tsx

import React from 'react';
import { IonPopover, IonList, IonItem, IonLabel, IonIcon } from '@ionic/react';
import { checkmarkOutline } from 'ionicons/icons';
import { useLocaleStore, Locale } from '../store/useLocaleStore';

interface LanguageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  event?: any;
}

const labels: Record<Locale, string> = {
  en: 'English',
  zh: '简体中文',
  'zh-TW': '繁體中文',
  id: 'Bahasa Indonesia',
  vi: 'Tiếng Việt',
};

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ isOpen, onClose, event }) => {
  const { locale, setLocale } = useLocaleStore();

  return (
    <IonPopover
      isOpen={isOpen}
      onDidDismiss={onClose}
      event={event}
      side="bottom"
      alignment="start"
      dismissOnSelect={true}
      style={{ '--width': '200px' }}
    >
      <IonList lines="full" style={{ padding: 0 }}>
        {(['en', 'zh', 'zh-TW', 'id', 'vi'] as Locale[]).map((l) => (
          <IonItem
            key={l}
            button
            detail={false}
            onClick={() => {
              setLocale(l);
              onClose();
            }}
            style={{ '--min-height': '44px' }}
          >
            <IonLabel style={{ fontSize: 14 }}>{labels[l]}</IonLabel>
            {locale === l && (
              <IonIcon icon={checkmarkOutline} slot="end" style={{ color: '#C4A882', fontSize: 18 }} />
            )}
          </IonItem>
        ))}
      </IonList>
    </IonPopover>
  );
};

export default LanguageSelector;