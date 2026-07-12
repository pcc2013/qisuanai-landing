import React, { useState, useEffect } from 'react';
import {
  IonModal,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonSpinner,
  IonText,
} from '@ionic/react';
import { closeOutline } from 'ionicons/icons';

interface LegalModalProps {
  isOpen: boolean;
  fileName: string;
  title: string;
  onClose: () => void;
}

const LegalModal: React.FC<LegalModalProps> = ({ isOpen, fileName, title, onClose }) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && fileName) {
      setIsLoading(true);
      setError(null);
      fetch(`/legal/${fileName}`)
        .then((res) => {
          if (!res.ok) throw new Error(`Failed to load ${fileName}`);
          return res.text();
        })
        .then((md) => {
          const html = md
            .replace(/^### (.+)$/gm, '<h4>$1</h4>')
            .replace(/^## (.+)$/gm, '<h3>$1</h3>')
            .replace(/^# (.+)$/gm, '<h2>$1</h2>')
            .replace(/^- (.+)$/gm, '<li>$1</li>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br/>');
          setContent(`<p>${html}</p>`);
        })
        .catch((err) => setError(err.message))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, fileName]);

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {isLoading && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <IonSpinner />
            <IonText color="medium"><p>Loading...</p></IonText>
          </div>
        )}
        {error && <IonText color="danger"><p>Error: {error}</p></IonText>}
        {!isLoading && !error && (
          <div
            style={{ fontSize: 14, lineHeight: 1.8, color: '#3D362F' }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </IonContent>
    </IonModal>
  );
};

export default LegalModal;