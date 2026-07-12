// D:\nira-app\src\components\LoginModal.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonIcon, IonText, IonSpinner, useIonToast } from '@ionic/react';
import { closeOutline, logoGoogle } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useLoginModalStore } from '../store/useLoginModalStore';
import { useLocaleStore } from '../store/useLocaleStore';

const LoginModal: React.FC = () => {
  const { isShow, hideLoginModal } = useLoginModalStore();
  const { login, googleLogin } = useAuthStore();
  const { t } = useLocaleStore();
  const history = useHistory();
  const [presentToast] = useIonToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // modal 关闭时清空表�?
  useEffect(() => {
    if (!isShow) {
      setEmail('');
      setPassword('');
      setErrors({});
      setIsLoading(false);
    }
  }, [isShow]);

  const validate = useCallback((): boolean => {
    const next: { email?: string; password?: string } = {};
    if (!email.trim()) next.email = t('loginModal.emailRequired') || 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = t('loginModal.emailInvalid') || 'Invalid email format';
    if (!password) next.password = t('loginModal.passwordRequired') || 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [email, password, t]);

  const handleLogin = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      await login(email, password);
      hideLoginModal();
      history.push('/home');
    } catch (e: any) {
      presentToast({ message: e.message || t('login.error'), duration: 2000, color: 'danger' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setIsLoading(true);
    try {
      await googleLogin();
      hideLoginModal();
      history.push('/home');
    } catch (e: any) {
      presentToast({ message: e.message || t('login.error'), duration: 2000, color: 'danger' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = useCallback(() => {
    // 通过 store 统一管理 modal 状�?
    hideLoginModal();
  }, [hideLoginModal]);

  return (
    <IonModal isOpen={isShow} onDidDismiss={handleDismiss}>
      <IonHeader>
        <IonToolbar style={{ '--background': 'var(--nira-bg-warm)' }}>
          <IonTitle style={{ fontSize: 16, color: 'var(--nira-text-primary)' }}>{t('loginModal.title') || 'Login'}</IonTitle>
          <IonButton slot="end" fill="clear" onClick={handleDismiss} style={{ '--color': 'var(--nira-text-secondary)' }}>
            <IonIcon icon={closeOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent style={{ '--background': 'var(--nira-bg-warm)' }}>
        <div style={styles.form}>
          <div style={styles.inputWrapper}>
            <IonInput
              type="email"
              placeholder={t('loginModal.email') || 'Email'}
              value={email}
              onIonInput={(e) => { setEmail(e.detail.value || ''); setErrors((prev) => ({ ...prev, email: undefined })); }}
              style={styles.input}
            />
          </div>
          {errors.email && <IonText color="danger" style={styles.error}>{errors.email}</IonText>}

          <div style={styles.inputWrapper}>
            <IonInput
              type="password"
              placeholder={t('loginModal.password') || 'Password'}
              value={password}
              onIonInput={(e) => { setPassword(e.detail.value || ''); setErrors((prev) => ({ ...prev, password: undefined })); }}
              style={styles.input}
            />
          </div>
          {errors.password && <IonText color="danger" style={styles.error}>{errors.password}</IonText>}

          <IonText style={styles.forget} onClick={() => history.push('/forgot-password')}>
            {t('loginModal.forget') || 'Forgot?'}
          </IonText>

          <IonButton expand="block" onClick={handleLogin} disabled={isLoading} style={styles.primaryBtn}>
            {isLoading ? <IonSpinner name="crescent" /> : (t('loginModal.submit') || 'Login')}
          </IonButton>

          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <IonText style={styles.dividerText}>{t('register.orDivider') || 'or'}</IonText>
            <div style={styles.dividerLine} />
          </div>

          <IonButton expand="block" fill="outline" onClick={handleGoogle} disabled={isLoading} style={styles.secondaryBtn}>
            <IonIcon icon={logoGoogle} slot="start" />
            {t('loginModal.googleLogin') || 'Sign in with Google'}
          </IonButton>

          <div style={styles.footer}>
            <IonText style={{ fontSize: 13, color: 'var(--nira-text-secondary)' }}>
              <span onClick={() => { hideLoginModal(); history.push('/register'); }} style={{ color: 'var(--nira-link)', cursor: 'pointer', textDecoration: 'underline' }}>
                {t('loginModal.register') || 'Sign Up'}
              </span>
            </IonText>
          </div>
        </div>
      </IonContent>
    </IonModal>
  );
};

const styles = {
  form: { padding: 24, maxWidth: 400, margin: '0 auto' },
  inputWrapper: { background: '#fff', borderRadius: 12, padding: '4px 16px', marginBottom: 8, display: 'flex', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  input: { '--placeholder-color': '#8B7D72', fontSize: 15 },
  error: { fontSize: 12, display: 'block', marginBottom: 8, paddingLeft: 4 },
  forget: { fontSize: 12, color: '#4A90D9', cursor: 'pointer', display: 'block', marginBottom: 16 },
  primaryBtn: { '--background': '#C4A882', '--border-radius': '24px', height: 48, fontSize: 16, fontWeight: 600 },
  divider: { display: 'flex', alignItems: 'center', margin: '16px 0' },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E0D8CE' },
  dividerText: { fontSize: 13, color: '#E0D8CE', margin: '0 12px' },
  secondaryBtn: { '--border-color': '#E0D8CE', '--color': '#3D362F', '--border-radius': '24px', height: 48 },
  footer: { textAlign: 'center' as const, marginTop: 16 },
};

export default LoginModal;