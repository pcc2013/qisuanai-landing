import React, { useState, useEffect } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonButton, IonIcon, IonSpinner, IonText, IonBackButton,
} from '@ionic/react';
import { useParams } from 'react-router-dom';

const LEGAL_TITLES: Record<string, string> = {
  'privacy-policy': '隐私政策',
  'terms-of-service': '用户协议',
  'community-guidelines': '社区准则',
  'guardian-guide': '监护人指南',
  'risk-disclosure': '风险告知',
  'data-safety': '数据安全',
};

const LegalPage: React.FC = () => {
  const { file } = useParams<{ file: string }>();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!file) return;
    setLoading(true);
    fetch(`/legal/${file}.md`)
      .then((res) => res.text())
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
      .catch(() => setContent('<p>加载失败</p>'))
      .finally(() => setLoading(false));
  }, [file]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': '#DCE8F0' }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" style={{ '--color': '#3D362F' }} />
          </IonButtons>
          <IonTitle style={{ fontSize: 16, color: '#3D362F' }}>
            {LEGAL_TITLES[file || ''] || '法律条款'}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" style={{ '--background': '#F5F0EB' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}><IonSpinner /></div>
        ) : (
          <div style={{ fontSize: 14, lineHeight: 1.8, color: '#3D362F' }} dangerouslySetInnerHTML={{ __html: content }} />
        )}
      </IonContent>
    </IonPage>
  );
};

export default LegalPage;