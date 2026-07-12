// D:\nira-app\src\components\QuickPersonaPanel.tsx

import React from 'react';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonText, useIonAlert } from '@ionic/react';
import { closeOutline, checkmarkCircle, addOutline, trashOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { usePersonaStore, PERSONA_CONFIGS } from '../store/usePersonaStore';
import { useLocaleStore } from '../store/useLocaleStore';

interface QuickPersonaPanelProps {
  isShow: boolean;
  onClose: () => void;
}

export const QuickPersonaPanel: React.FC<QuickPersonaPanelProps> = ({ isShow, onClose }) => {
  const { currentPersonaId, switchPersona } = usePersonaStore();
  const { t } = useLocaleStore();
  const history = useHistory();
  const [presentAlert] = useIonAlert();

  const allPersonas = (PERSONA_CONFIGS || []).map(p => ({
    id: p.id,
    name: p.name?.zh || p.nameEn || p.id,
    avatar: p.characters?.[0]?.avatar || '/nira_logo.png',
    type: 'official',
  }));

  const handleSwitch = (id: string) => { switchPersona(id); onClose(); };

  const handleDelete = (id: string) => {
    presentAlert({
      header: t('quickPersona.confirmDelete') || 'Delete?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Delete', role: 'destructive', handler: () => onClose() },
      ],
    });
  };

  return (
    <IonModal isOpen={isShow} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar style={{ '--background': '#F5F0EB' }}>
          <IonTitle style={{ fontSize: 14, color: '#3D362F' }}>{t('quickPersona.title') || 'Personas'}</IonTitle>
          <IonButton slot="end" fill="clear" onClick={onClose} style={{ '--color': '#8B7D72' }}><IonIcon icon={closeOutline} /></IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent style={{ '--background': '#F5F0EB' }}>
        <div style={{ padding: 16 }}>
          {allPersonas.map((p) => (
            <div key={p.id} onClick={() => handleSwitch(p.id)} style={{ display: 'flex', alignItems: 'center', padding: '10px 12px', marginBottom: 8, borderRadius: 12, backgroundColor: p.id === currentPersonaId ? '#FFFFFF' : 'transparent', border: p.id === currentPersonaId ? '2px solid #C4A882' : '1px solid #E0D8CE', cursor: 'pointer' }}>
              <img src={p.avatar} alt="" style={{ width: 36, height: 36, borderRadius: '50%', marginRight: 12, objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = '/nira_logo.png'; }} />
              <IonText style={{ flex: 1, fontSize: 15, color: '#3D362F' }}>{p.name}</IonText>
              {p.id === currentPersonaId && <IonIcon icon={checkmarkCircle} style={{ color: '#C4A882', fontSize: 20 }} />}
            </div>
          ))}
          <IonButton expand="block" fill="outline" onClick={() => { onClose(); history.push('/customize'); }} style={{ '--border-color': '#C4A882', '--color': '#C4A882', marginTop: 12 }}>
            <IonIcon icon={addOutline} slot="start" />{t('quickPersona.add') || 'Add'}
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};
export default QuickPersonaPanel;