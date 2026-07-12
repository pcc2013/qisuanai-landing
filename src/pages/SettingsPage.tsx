// D:\nira-app\src\pages\SettingsPage.tsx

import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonButton, IonIcon, IonList, IonItem, IonLabel, IonToggle, IonModal,
  IonSelect, IonSelectOption, useIonToast, useIonAlert,
} from '@ionic/react';
import { arrowBackOutline, shieldOutline, warningOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useLocaleStore, Locale } from '../store/useLocaleStore';
import { useAuthStore } from '../store/useAuthStore';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { informationCircleOutline } from 'ionicons/icons';
import RiskDisclosure from '../components/RiskDisclosure';

export const SettingsPage: React.FC = () => {
  const history = useHistory();
  const { t, currentLocale, setLocale } = useLocaleStore();
  const { logout } = useAuthStore();
  const { currentTier, canDisablePrivacyGuard } = useSubscriptionStore();
  const [presentToast] = useIonToast();
  const [presentAlert] = useIonAlert();

  const [isPrivacyGuardOpen, setIsPrivacyGuardOpen] = useState(true);
  const [isRiskModalShow, setIsRiskModalShow] = useState(false);
  const [theme, setTheme] = useState<'warm' | 'cool'>(() => (localStorage.getItem('nira-theme') as 'warm' | 'cool') || 'warm');

  // 系统权限
  const [permissions, setPermissions] = useState({
    microphone: true,
    camera: false,
    storage: true,
    dataCollection: true,
  });

  const handleTogglePrivacy = (e: CustomEvent) => {
    if (!e.detail.checked) {
      if (!canDisablePrivacyGuard()) {
        presentToast({
          message: t('settings.privacyGuardTip') || 'Annual subscription required to disable.',
          duration: 2000,
          color: 'warning',
        });
        setIsPrivacyGuardOpen(true);
        return;
      }
      setIsRiskModalShow(true);
    }
  };

  const handleRiskAgree = () => { setIsPrivacyGuardOpen(false); setIsRiskModalShow(false); };
  const handleRiskCancel = () => { setIsPrivacyGuardOpen(true); setIsRiskModalShow(false); };

  const handleThemeChange = (e: CustomEvent) => {
    const val = e.detail.value as 'warm' | 'cool';
    setTheme(val);
    localStorage.setItem('nira-theme', val);
    document.documentElement.setAttribute('data-theme', val);
  };

  const handleLanguageChange = (e: CustomEvent) => {
    setLocale(e.detail.value as Locale);
  };

  const handleTogglePermission = (key: keyof typeof permissions) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
  presentAlert({
    header: t('settings.confirmLogout') || 'Are you sure?',
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'OK',
        handler: async () => {
          try {
            await logout();
          } catch {
            // Firebase 登出失败不影响本地清理
          }
          localStorage.removeItem('nira-auth-storage');
          history.replace('/login');
        },
      },
    ],
  });
};

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': '#F5F0EB' }}>
          <IonButtons slot="start">
            <IonButton fill="clear" onClick={() => history.goBack()} style={{ '--color': '#3D362F' }}>
              <IonIcon icon={arrowBackOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle style={{ fontSize: 16, color: '#3D362F' }}>{t('settings.title') || 'Settings'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent style={{ '--background': '#F5F0EB' }}>
        <IonList>
          {/* 语言 */}
          <IonItem>
            <IonLabel>{t('settings.language') || 'Language'}</IonLabel>
            <IonSelect value={currentLocale} onIonChange={handleLanguageChange} interface="action-sheet">
              <IonSelectOption value="en">English</IonSelectOption>
              <IonSelectOption value="zh">简体中文</IonSelectOption>
              <IonSelectOption value="zh-TW">繁體中文</IonSelectOption>
              <IonSelectOption value="id">Bahasa Indonesia</IonSelectOption>
              <IonSelectOption value="vi">Tiếng Việt</IonSelectOption>
            </IonSelect>
          </IonItem>

          {/* 主题 */}
          <IonItem>
            <IonLabel>{t('settings.theme') || 'Theme'}</IonLabel>
            <IonSelect value={theme} onIonChange={handleThemeChange} interface="action-sheet">
              <IonSelectOption value="warm">Warm</IonSelectOption>
              <IonSelectOption value="cool">Cool</IonSelectOption>
            </IonSelect>
          </IonItem>

          {/* 账号安全 */}
          <IonItem><IonLabel>{t('settings.accountSecurity') || 'Account Security'}</IonLabel></IonItem>

          {/* 通知 */}
          <IonItem>
            <IonLabel>{t('settings.notification') || 'Notifications'}</IonLabel>
            <IonToggle checked={true} />
          </IonItem>

          {/* 隐私保护模式（反蒸馏） */}
          <IonItem>
            <IonIcon icon={shieldOutline} slot="start" style={{ color: '#C4A882' }} />
            <IonLabel>{t('settings.privacyGuardTitle') || 'Privacy Guard (Anti-Distill)'}</IonLabel>
            <IonToggle checked={isPrivacyGuardOpen} onIonChange={handleTogglePrivacy} />
          </IonItem>
          <IonItem lines="none">
            <IonLabel style={{ fontSize: 12, color: '#8B7D72' }}>
              {t('settings.privacyGuardDesc') || 'Protect your chat data from being distilled.'}
            </IonLabel>
          </IonItem>

          {/* 系统权限管理 */}
          <IonItem lines="full">
            <IonLabel style={{ fontWeight: 600, fontSize: 13, color: '#3D362F' }}>
              {t('settings.permissions') || 'Permissions'}
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>{t('settings.permissionMicrophone') || 'Microphone'}</IonLabel>
            <IonToggle checked={permissions.microphone} onIonChange={() => handleTogglePermission('microphone')} />
          </IonItem>
          <IonItem>
            <IonLabel>{t('settings.permissionCamera') || 'Camera'}</IonLabel>
            <IonToggle checked={permissions.camera} onIonChange={() => handleTogglePermission('camera')} />
          </IonItem>
          <IonItem>
            <IonLabel>{t('settings.permissionStorage') || 'Storage'}</IonLabel>
            <IonToggle checked={permissions.storage} onIonChange={() => handleTogglePermission('storage')} />
          </IonItem>
          <IonItem>
            <IonLabel>{t('settings.permissionDataCollection') || 'Data Collection'}</IonLabel>
            <IonToggle checked={permissions.dataCollection} onIonChange={() => handleTogglePermission('dataCollection')} />
          </IonItem>

          <IonItem button routerLink="/about">
           <IonIcon icon={informationCircleOutline} slot="start" />
         <IonLabel>关于我们</IonLabel>
          </IonItem>

          {/* 退出登录 */}
          <IonItem button onClick={handleLogout} style={{ '--color': '#E88B7D' }}>
            <IonIcon icon={warningOutline} slot="start" />
            <IonLabel>{t('settings.logout') || 'Log Out'}</IonLabel>
          </IonItem>
        </IonList>

        {/* 风险告知弹窗 */}
        <IonModal isOpen={isRiskModalShow}>
          <RiskDisclosure onAgree={handleRiskAgree} onCancel={handleRiskCancel} />
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;