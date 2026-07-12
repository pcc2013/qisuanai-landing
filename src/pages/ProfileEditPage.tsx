// D:\nira-app\src\pages\ProfileEditPage.tsx

import React, { useState, useRef } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonMenuButton, IonButton, IonIcon, IonText, IonAvatar, IonInput,
  IonItem, IonLabel, useIonToast, IonBackButton,
} from '@ionic/react';
import { cameraOutline, checkmarkCircle } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const ProfileEditPage: React.FC = () => {
  const history = useHistory();
  const { user, updateProfile } = useAuthStore();
  const [presentToast] = useIonToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.displayName || '');
  const [avatar, setAvatar] = useState(user?.photoURL || '/nira_logo.png');

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      presentToast({ message: '名称不能为空', duration: 1500, color: 'warning' });
      return;
    }
    updateProfile({ displayName: trimmed, photoURL: avatar });
    presentToast({ message: '已保存', duration: 1500, color: 'success' });
    history.goBack();
  };

  const handlePickImage = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': '#DCE8F0' }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" style={{ '--color': '#3D362F' }} />
          </IonButtons>
          <IonTitle style={{ fontSize: 16, color: '#3D362F' }}>编辑资料</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave} style={{ '--color': '#C4A882' }}>
              <IonIcon icon={checkmarkCircle} slot="start" />保存
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ '--background': '#F5F0EB' }} className="ion-padding">
        {/* 头像 */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}
               onClick={handlePickImage}>
            <IonAvatar style={{ width: 96, height: 96 }}>
              <img src={avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                   onError={(e) => { (e.target as HTMLImageElement).src = '/nira_logo.png'; }} />
            </IonAvatar>
            <div style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 32, height: 32, borderRadius: '50%',
              backgroundColor: '#C4A882', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <IonIcon icon={cameraOutline} style={{ fontSize: 18, color: '#fff' }} />
            </div>
          </div>
          <input type="file" ref={fileInputRef} accept="image/*" style={{ display: 'none' }}
                 onChange={handleFileChange} />
          <IonText style={{ fontSize: 12, color: '#8B7D72', display: 'block', marginTop: 8 }}>
            点击头像更换照片
          </IonText>
        </div>

        {/* 用户名 */}
        <IonItem style={{ '--background': '#fff', borderRadius: 12 }}>
          <IonLabel position="fixed">昵称</IonLabel>
          <IonInput
            value={name}
            onIonChange={(e) => setName(e.detail.value || '')}
            placeholder="输入你的名字"
            maxlength={20}
          />
        </IonItem>

        {/* Nira ID（只读） */}
        <IonItem style={{ '--background': '#fff', borderRadius: 12, marginTop: 8 }}>
          <IonLabel position="fixed">Nira ID</IonLabel>
          <IonText style={{ fontSize: 14, color: '#8B7D72' }}>
            {user?.niraId || 'Nira00000'}
          </IonText>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default ProfileEditPage;