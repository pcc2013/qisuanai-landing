// D:\nira-app\src\components\SideMenu.tsx

import React, { useState } from 'react';
import {
  IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
  IonIcon, IonLabel, IonAvatar, IonText, useIonAlert, useIonToast,
  IonModal, IonButtons, IonButton,
} from '@ionic/react';
import {
  videocamOutline, sparklesOutline, colorPaletteOutline,
  journalOutline, starOutline, giftOutline,
  chevronDown, chevronForward, closeOutline,
  settingsOutline, logOutOutline, trashOutline, leafOutline,
  documentTextOutline, cardOutline, walletOutline,
  shirtOutline, cubeOutline, mailOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useMenuStore } from '../store/useMenuStore';
import { useAuthStore } from '../store/useAuthStore';
import { useProfileStore } from '../store/useProfileStore';
import { useQSStore } from '../store/useQSStore';
import { useLocaleStore } from '../store/useLocaleStore';

export const SideMenu: React.FC = () => {
  const history = useHistory();
  const { closeMenu } = useMenuStore();
  const { getNickname, getAvatarUrl } = useProfileStore();
  const { qsBalance } = useQSStore();
  const { t } = useLocaleStore();
  const logout = useAuthStore((s) => s.logout);
  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalModalUrl, setLegalModalUrl] = useState<string | null>(null);

  const legalDocs = [
    { id: 'privacy-policy', labelKey: 'register.privacy' },
    { id: 'terms-of-service', labelKey: 'register.terms' },
    { id: 'community-guidelines', labelKey: 'legal.communityGuidelines' },
    { id: 'guardian-guide', labelKey: 'legal.guardianGuide' },
    { id: 'risk-disclosure', labelKey: 'legal.riskDisclosure' },
    { id: 'data-safety', labelKey: 'legal.dataSafety' },
  ];

  const accountSubItems = [
    { icon: walletOutline, labelKey: 'profile.wallet', path: '/profile?tab=wallet' },
    { icon: cardOutline, labelKey: 'sideMenu.recharge', path: '/recharge' },
    { icon: starOutline, labelKey: 'sideMenu.subscribe', path: '/subscribe' },
    { icon: sparklesOutline, labelKey: 'creator_mode', path: '/creator' },
  ];

  const nav = (path: string) => { closeMenu(); history.push(path); };

  const handleLogout = async () => {
    await logout();
    presentToast({ message: t('sideMenu.logout') || 'Logged out', duration: 1500 });
    closeMenu();
    history.push('/login');
  };

  const handleDeleteAccount = () => {
    presentAlert({
      header: t('sideMenu.confirmDelete') || 'Delete account permanently?',
      message: 'All your personal data will be cleared within 7 days.',
      buttons: [
        { text: t('register.cancel') || 'Cancel', role: 'cancel' },
        {
          text: t('sideMenu.deleteAccount') || 'Delete',
          role: 'destructive',
          handler: async () => { await logout(); closeMenu(); history.push('/login'); },
        },
      ],
    });
  };

  return (
    <IonMenu side="start" contentId="main-content" menuId="side-menu">
      <IonHeader>
        <IonToolbar style={{ '--background': 'linear-gradient(180deg, #B8D4E8, #DCE8F0)' }}>
          <IonTitle style={{ fontSize: 16, color: '#3D362F' }}>Nira</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent style={{ '--background': '#F5F0EB' }}>
        <div
          style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #E0D8CE', cursor: 'pointer' }}
          onClick={() => { closeMenu(); history.push('/profile/edit'); }}
        >
          <IonAvatar style={{ width: 48, height: 48 }}>
            <img src={getAvatarUrl()} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </IonAvatar>
          <IonText style={{ fontSize: 16, fontWeight: 600, color: '#3D362F' }}>{getNickname()}</IonText>
        </div>

        <IonList style={{ background: 'transparent', padding: 0 }}>
          <div style={{ padding: '12px 16px 4px', fontSize: 12, color: '#8B7D72', fontWeight: 600, textTransform: 'uppercase', cursor: 'pointer' }}
               onClick={() => setIsAccountOpen(!isAccountOpen)}>
            Account Management
            <IonIcon icon={isAccountOpen ? chevronDown : chevronForward} style={{ verticalAlign: 'middle', fontSize: 14, marginLeft: 4 }} />
          </div>
          {isAccountOpen && accountSubItems.map((item) => (
            <IonItem key={item.path} button onClick={() => nav(item.path)} style={{ '--background': 'transparent', '--padding-start': '32px', fontSize: 14 }}>
              <IonIcon icon={item.icon} slot="start" style={{ fontSize: 18, color: '#8B7D72' }} />
              <IonLabel style={{ fontSize: 14, color: '#3D362F' }}>{t(item.labelKey) || item.labelKey}</IonLabel>
            </IonItem>
          ))}

          <div style={{ padding: '12px 16px 4px', fontSize: 12, color: '#8B7D72', fontWeight: 600, textTransform: 'uppercase' }}>
            {t('sideMenu.exclusiveService') || 'Exclusive Services'}
          </div>
          <IonItem button onClick={() => nav('/digital-human')} style={{ '--background': 'transparent' }}>
            <IonIcon icon={videocamOutline} slot="start" style={{ color: '#C4A882' }} />
            <IonLabel>{t('sideMenu.digitalHuman') || 'Digital Human'}</IonLabel>
          </IonItem>
          <IonItem button onClick={() => nav('/exclusive-avatar')} style={{ '--background': 'transparent' }}>
            <IonIcon icon={sparklesOutline} slot="start" style={{ color: '#C4A882' }} />
            <IonLabel>{t('sideMenu.exclusiveAvatar') || 'Ai Clone'}</IonLabel>
          </IonItem>
          <IonItem button onClick={() => nav('/customize')} style={{ '--background': 'transparent' }}>
            <IonIcon icon={colorPaletteOutline} slot="start" style={{ color: '#C4A882' }} />
            <IonLabel>{t('sideMenu.exclusiveCustom') || 'Ai Customize'}</IonLabel>
          </IonItem>

          <div style={{ padding: '12px 16px 4px', fontSize: 12, color: '#8B7D72', fontWeight: 600, textTransform: 'uppercase' }}>AI Showcase</div>
          <IonItem button onClick={() => nav('/wardrobe')} style={{ '--background': 'transparent' }}>
            <IonIcon icon={shirtOutline} slot="start" style={{ color: '#C4A882' }} />
            <IonLabel>{t('wardrobe') || 'Wardrobe'}</IonLabel>
          </IonItem>
          <IonItem button onClick={() => nav('/blindbox')} style={{ '--background': 'transparent' }}>
            <IonIcon icon={cubeOutline} slot="start" style={{ color: '#C4A882' }} />
            <IonLabel>{t('blindbox') || 'Blind Box'}</IonLabel>
          </IonItem>

          <div style={{ padding: '12px 16px 4px', fontSize: 12, color: '#8B7D72', fontWeight: 600, textTransform: 'uppercase' }}>
            {t('sideMenu.myRecord') || 'My Records'}
          </div>
          <IonItem button onClick={() => nav('/my-ai')} style={{ '--background': 'transparent' }}>
            <IonIcon icon={cardOutline} slot="start" style={{ color: '#C4A882' }} />
            <IonLabel>My AI</IonLabel>
          </IonItem>
          <IonItem button onClick={() => nav('/diary')} style={{ '--background': 'transparent' }}>
            <IonIcon icon={journalOutline} slot="start" style={{ color: '#C4A882' }} />
            <IonLabel>{t('sideMenu.myDiary') || 'My Diary'}</IonLabel>
          </IonItem>
          <IonItem button onClick={() => nav('/invite')} style={{ '--background': 'transparent' }}>
            <IonIcon icon={giftOutline} slot="start" style={{ color: '#C4A882' }} />
            <IonLabel>{t('sideMenu.invite') || 'Invite Friends'}</IonLabel>
          </IonItem>

          <IonItem disabled style={{ '--background': 'transparent', opacity: 0.4 }}>
            <IonIcon icon={leafOutline} slot="start" style={{ color: '#8B7D72' }} />
            <IonLabel style={{ color: '#8B7D72', fontSize: 13 }}>Minor Protection</IonLabel>
          </IonItem>

          <div style={{ padding: '12px 16px 4px', fontSize: 12, color: '#8B7D72', fontWeight: 600, textTransform: 'uppercase', cursor: 'pointer' }}
               onClick={() => setIsLegalOpen(!isLegalOpen)}>
            Legal Documents
            <IonIcon icon={isLegalOpen ? chevronDown : chevronForward} style={{ verticalAlign: 'middle', fontSize: 14, marginLeft: 4 }} />
          </div>
          {isLegalOpen && legalDocs.map((doc) => (
            <IonItem key={doc.id} button onClick={() => { closeMenu(); window.open(`/${doc.id}.html`, '_blank'); }} style={{ '--background': 'transparent', '--padding-start': '32px', fontSize: 14 }}>
              <IonIcon icon={documentTextOutline} slot="start" style={{ color: '#8B7D72' }} />
              <IonLabel style={{ fontSize: 13 }}>{t(doc.labelKey) || doc.labelKey}</IonLabel>
            </IonItem>
          ))}

          {/* Contact Us */}
          <IonItem button onClick={() => { closeMenu(); window.location.href = 'mailto:admin@qisuanai.com'; }} style={{ '--background': 'transparent', '--padding-start': '32px', fontSize: 14 }}>
            <IonIcon icon={mailOutline} slot="start" style={{ color: '#8B7D72' }} />
            <IonLabel style={{ fontSize: 13 }}>Contact Us</IonLabel>
          </IonItem>

          <div style={{ padding: '12px 16px 4px', fontSize: 12, color: '#8B7D72', fontWeight: 600, textTransform: 'uppercase', cursor: 'pointer' }}
               onClick={() => setIsSettingOpen(!isSettingOpen)}>
            {t('sideMenu.securitySetting') || 'Security & Settings'}
            <IonIcon icon={isSettingOpen ? chevronDown : chevronForward} style={{ verticalAlign: 'middle', fontSize: 14, marginLeft: 4 }} />
          </div>
          {isSettingOpen && (
            <>
              <IonItem button onClick={() => nav('/settings')} style={{ '--background': 'transparent' }}>
                <IonIcon icon={settingsOutline} slot="start" style={{ color: '#C4A882' }} />
                <IonLabel>{t('sideMenu.setting') || 'Settings'}</IonLabel>
              </IonItem>
              <IonItem button onClick={handleLogout} style={{ '--background': 'transparent' }}>
                <IonIcon icon={logOutOutline} slot="start" style={{ color: '#C4A882' }} />
                <IonLabel>{t('sideMenu.logout') || 'Log Out'}</IonLabel>
              </IonItem>
              <IonItem button onClick={handleDeleteAccount} style={{ '--background': 'transparent' }}>
                <IonIcon icon={trashOutline} slot="start" style={{ color: '#E88B7D' }} />
                <IonLabel style={{ color: '#E88B7D' }}>{t('sideMenu.deleteAccount') || 'Delete Account'}</IonLabel>
              </IonItem>
            </>
          )}
        </IonList>
      </IonContent>

      {/* Legal Document Modal */}
      <IonModal isOpen={!!legalModalUrl} onDidDismiss={() => setLegalModalUrl(null)}>
        <IonHeader>
          <IonToolbar style={{ '--background': '#DCE8F0' }}>
            <IonButtons slot="start">
              <IonButton onClick={() => setLegalModalUrl(null)} style={{ '--color': '#3D362F' }}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
            <IonTitle style={{ fontSize: 16, color: '#3D362F' }}>Legal Document</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {legalModalUrl && <iframe src={legalModalUrl} style={{ width: '100%', height: '100%', border: 'none' }} title="Legal Document" />}
        </IonContent>
      </IonModal>
    </IonMenu>
  );
};

export default SideMenu;