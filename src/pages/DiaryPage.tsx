// D:\nira-app\src\pages\DiaryPage.tsx

import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonButton, IonIcon, IonTextarea, IonText, IonCard, IonCardContent,
  useIonToast,
} from '@ionic/react';
import { saveOutline } from 'ionicons/icons';
import { useLocaleStore } from '../store/useLocaleStore';
import { useDiaryStore } from '../store/useDiaryStore';

const DiaryPage: React.FC = () => {
  const { t } = useLocaleStore();
  const { entries, addDiary } = useDiaryStore();
  const [presentToast] = useIonToast();
  const [content, setContent] = useState('');

  const handleSave = () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    addDiary(trimmed);
    setContent('');
    presentToast({ message: t('diary_saved') || 'Saved!', duration: 1500, color: 'success' });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': '#F5F0EB' }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle style={{ fontSize: 16, color: '#3D362F' }}>{t('diary') || 'Diary'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent style={{ '--background': '#F5F0EB' }}>
        {/* 输入区 */}
        <div style={{ padding: 16 }}>
          <IonTextarea
            value={content}
            placeholder={t('diary_placeholder') || 'Write your thoughts...'}
            onIonInput={(e) => setContent(e.detail.value || '')}
            rows={6}
            style={{ backgroundColor: '#fff', borderRadius: 12, padding: 12, fontSize: 14, color: '#3D362F' }}
          />
          <IonButton expand="block" onClick={handleSave} style={{ marginTop: 12 }}>
            <IonIcon icon={saveOutline} slot="start" />
            {t('save') || 'Save'}
          </IonButton>
        </div>

        {/* 历史日记 */}
        <div style={{ padding: '0 16px 24px' }}>
          {entries.map((entry) => (
            <IonCard key={entry.id} style={{ borderRadius: 12, backgroundColor: '#fff', marginBottom: 8 }}>
              <IonCardContent style={{ padding: 12 }}>
                <IonText style={{ fontSize: 11, color: '#8B7D72', display: 'block', marginBottom: 4 }}>
                  {new Date(entry.createdAt).toLocaleString()}
                </IonText>
                <IonText style={{ fontSize: 14, color: '#3D362F', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                  {entry.content.length > 100 ? entry.content.slice(0, 100) + '...' : entry.content}
                </IonText>
              </IonCardContent>
            </IonCard>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DiaryPage;