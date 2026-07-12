// D:\nira-app\src\pages\LoginPage.tsx

import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonIcon, IonText, IonSpinner, useIonToast } from '@ionic/react';
import { mailOutline, lockClosedOutline, arrowBackOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useLocaleStore } from '../store/useLocaleStore';
import { useAuthStore } from '../store/useAuthStore';

export const LoginPage: React.FC = () => {
  const history = useHistory();
  const { t } = useLocaleStore();
  const { login } = useAuthStore();
  const [presentToast] = useIonToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      presentToast({ message: t('login.error') || 'Please enter email and password', duration: 2000, color: 'danger' });
      return;
    }
    setIsLoading(true);
    try {
      await login(email, password);
      history.replace('/home');
    } catch (e: any) {
      presentToast({ message: e.message || (t('login.error') || 'Login failed'), duration: 3000, color: 'danger' });
    }
    setIsLoading(false);
  };

  return (
    <IonPage>
      <IonContent style={{ '--background': 'linear-gradient(180deg, #DCE8F0, #C8D8E8)' }}>
        <div style={{ padding: 16 }}>
          <IonButton fill="clear" onClick={() => history.push(-1)} style={{ '--color': '#8B7D72' }}>
            <IonIcon icon={arrowBackOutline} style={{ fontSize: 24 }} />
          </IonButton>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 24px', maxWidth: 400, margin: '0 auto' }}>
          <img src="/nira_logo.png" alt="Nira" style={{ width: 80, height: 80, borderRadius: '50%', marginBottom: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }} />
          <IonText style={{ fontSize: 18, fontWeight: 600, color: '#3D362F', marginBottom: 24 }}>
            {t('login.title') || 'Welcome Back'}
          </IonText>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', backgroundColor: '#fff', borderRadius: 12, padding: '0 16px', marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <IonIcon icon={mailOutline} style={{ color: '#8B7D72', marginRight: 8, fontSize: 20 }} />
            <IonInput type="email" placeholder={t('login.email') || 'Email address'} value={email} onIonInput={(e) => setEmail(e.detail.value || '')} style={{ '--placeholder-color': '#8B7D72', fontSize: 15 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', backgroundColor: '#fff', borderRadius: 12, padding: '0 16px', marginBottom: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <IonIcon icon={lockClosedOutline} style={{ color: '#8B7D72', marginRight: 8, fontSize: 20 }} />
            <IonInput type="password" placeholder={t('login.password') || 'Password'} value={password} onIonInput={(e) => setPassword(e.detail.value || '')} style={{ '--placeholder-color': '#8B7D72', fontSize: 15 }} />
          </div>
          <IonText style={{ fontSize: 12, color: '#4A90D9', cursor: 'pointer', alignSelf: 'flex-end', marginBottom: 16 }}>
            {t('login.forget') || 'Forgot Password?'}
          </IonText>
          <IonButton expand="block" onClick={handleLogin} disabled={isLoading || !email || !password} style={{ '--background': '#C4A882', '--border-radius': '24px', height: 48, fontSize: 16, fontWeight: 600 }}>
            {isLoading ? <IonSpinner name="crescent" /> : (t('login.submit') || 'Log In')}
          </IonButton>
          <IonText style={{ fontSize: 13, color: '#8B7D72', marginTop: 16 }}>
            <span onClick={() => history.push('/register')} style={{ color: '#4A90D9', cursor: 'pointer', textDecoration: 'underline' }}>
              {t('login.register') || "Don't have an account? Sign Up"}
            </span>
          </IonText>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;