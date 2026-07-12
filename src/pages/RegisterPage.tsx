// D:\nira-app\src\pages\RegisterPage.tsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  IonPage, IonContent, IonInput, IonButton, IonIcon, IonText,
  IonSelect, IonSelectOption, IonModal, IonSpinner, IonChip,
  useIonToast,
} from '@ionic/react';
import {
  closeOutline,
  mailOutline,
  lockClosedOutline,
  logoGoogle,
  languageOutline,
} from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { useLocaleStore } from '../store/useLocaleStore';
import { useAuthStore } from '../store/useAuthStore';
import { useQSStore } from '../store/useQSStore';
import { useIntimacyStore } from '../store/useIntimacyStore';
import { useInviteStore } from '../store/useInviteStore';
import LanguageSelector from '../components/LanguageSelector';
import { GuardianVerification } from '../components/GuardianVerification';
import LegalModal from '../components/LegalModal';

const REGISTRATION_QS_BONUS = 60;
const INVITE_QS_BONUS = 50;
const INVITE_CODE_STORAGE_KEY = 'nira_invite_code';

const RegisterPage: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const { t } = useLocaleStore();
  const { login, googleLogin } = useAuthStore();
  const { addQS } = useQSStore();
  const addScore = useIntimacyStore((s) => s.addScore);
  const inviteStore = useInviteStore();
  const [presentToast] = useIonToast();

  const [inviteCode, setInviteCode] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('invite');
    if (code) {
      setInviteCode(code);
      localStorage.setItem(INVITE_CODE_STORAGE_KEY, code);
    } else {
      const stored = localStorage.getItem(INVITE_CODE_STORAGE_KEY);
      if (stored) {
        setInviteCode(stored);
      }
    }
  }, [location.search]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthYear, setBirthYear] = useState<number | null>(null);
  const [birthMonth, setBirthMonth] = useState<number | null>(null);
  const [birthDay, setBirthDay] = useState<number | null>(null);
  const [isAgree, setIsAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [age, setAge] = useState<number | null>(null);
  const [ageError, setAgeError] = useState<string | null>(null);
  const [showGuardian, setShowGuardian] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [langEvent, setLangEvent] = useState<any>(null);
  const [gender, setGender] = useState<'male' | 'female' | 'secret'>('secret');
  const [showFormHint, setShowFormHint] = useState(false);

  const [legalModal, setLegalModal] = useState<{ file: string; titleKey: string } | null>(null);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);

  const isFormValid = useMemo(() => {
    return (
      isEmailValid &&
      isPasswordValid &&
      password === confirmPassword &&
      birthYear !== null &&
      birthMonth !== null &&
      birthDay !== null &&
      isAgree &&
      age !== null &&
      age >= 15
    );
  }, [isEmailValid, isPasswordValid, password, confirmPassword, birthYear, birthMonth, birthDay, isAgree, age]);

  const calculateAge = useCallback(() => {
    if (!birthYear || !birthMonth || !birthDay) {
      setAge(null);
      return;
    }
    const today = new Date();
    const bd = new Date(birthYear, birthMonth - 1, birthDay);
    let a = today.getFullYear() - bd.getFullYear();
    if (
      today.getMonth() < bd.getMonth() ||
      (today.getMonth() === bd.getMonth() && today.getDate() < bd.getDate())
    )
      a--;
    setAge(a);
    if (a < 15) {
      setAgeError(t('register.ageError'));
    } else {
      setAgeError(null);
    }
  }, [birthYear, birthMonth, birthDay, t]);

  useEffect(() => {
    calculateAge();
  }, [calculateAge]);

  const grantInviteBonus = useCallback(async (newUserId: string) => {
    if (!inviteCode) return;
    try {
      await inviteStore.claimInviteReward(inviteCode, newUserId);
      addQS(INVITE_QS_BONUS, 'Invite bonus (invitee)');
      inviteStore.setInvitedBy(inviteCode);
      localStorage.removeItem(INVITE_CODE_STORAGE_KEY);
    } catch (e) {
      console.error('[Register] 邀请奖励发放失败:', e);
    }
  }, [inviteCode, addQS, inviteStore]);

  const completeRegistration = useCallback(async (user: any) => {
    const userId = user?.id || user?.uid || 'new_user';
    addQS(REGISTRATION_QS_BONUS, 'Registration bonus');
    await grantInviteBonus(userId);
    const personaId = user?.personaId || 'default';
    addScore(personaId, t('register.welcomeMessage'));
    const totalBonus = inviteCode
      ? REGISTRATION_QS_BONUS + INVITE_QS_BONUS
      : REGISTRATION_QS_BONUS;

    presentToast({
      message: inviteCode
        ? t('register.successWithInvite', { bonus: totalBonus })
        : t('register.success', { bonus: REGISTRATION_QS_BONUS }),
      duration: 2500,
      color: 'success',
    });
    setTimeout(() => history.replace('/home'), 500);
  }, [addQS, grantInviteBonus, addScore, presentToast, t, history, inviteCode]);

  const doRegister = useCallback(async () => {
    setIsLoading(true);
    try {
      const user = await login(email, password, gender);
      await completeRegistration(user);
    } catch (e: any) {
      presentToast({
        message: e.message || t('register.error'),
        duration: 3000,
        color: 'danger',
      });
    }
    setIsLoading(false);
  }, [email, password, gender, login, completeRegistration, presentToast, t]);

  const handleRegister = useCallback(() => {
    if (!isFormValid) {
      setShowFormHint(true);
      return;
    }
    setShowFormHint(false);
    if (age && age < 18) {
      setShowGuardian(true);
      return;
    }
    doRegister();
  }, [isFormValid, age, doRegister]);

  const handleGuardianSuccess = useCallback(() => {
    setShowGuardian(false);
    doRegister();
  }, [doRegister]);

  const handleGoogle = useCallback(async () => {
    setIsLoading(true);
    try {
      const user = await googleLogin();
      await completeRegistration(user);
    } catch (e: any) {
      presentToast({
        message: e.message || t('register.error'),
        duration: 3000,
        color: 'danger',
      });
    }
    setIsLoading(false);
  }, [googleLogin, completeRegistration, presentToast, t]);

  return (
    <IonPage>
      <IonContent style={{ '--background': 'linear-gradient(180deg, #DCE8F0, #C8D8E8)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: 16 }}>
          <IonButton
            fill="clear"
            onClick={(e) => {
              setLangEvent(e.nativeEvent);
              setShowLang(true);
            }}
            style={{ '--color': '#4A90D9' }}
          >
            <IonIcon icon={languageOutline} style={{ fontSize: 24 }} />
          </IonButton>
          <IonButton
            fill="clear"
            onClick={() => history.replace('/home')}
            style={{ '--color': '#8B7D72' }}
          >
            <IonIcon icon={closeOutline} style={{ fontSize: 24 }} />
          </IonButton>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '0 24px',
            maxWidth: 400,
            margin: '0 auto',
          }}
        >
          <img
            src="/nira_logo.png"
            alt="Nira"
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              marginBottom: 16,
              objectFit: 'cover',
            }}
          />

          {inviteCode && (
            <div
              style={{
                backgroundColor: '#C4A882',
                borderRadius: 20,
                padding: '8px 20px',
                marginBottom: 16,
              }}
            >
              <IonText style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>
                🎁 {t('register.inviteNotice')}
              </IonText>
            </div>
          )}

          <IonText style={{ fontSize: 14, color: '#8B7D72', marginBottom: 24 }}>
            {t('register.title')}
          </IonText>

          <div style={inputContainerStyle}>
            <IonIcon icon={mailOutline} style={iconStyle} />
            <IonInput
              type="email"
              placeholder={t('register.email')}
              value={email}
              onIonInput={(e) => setEmail(e.detail.value || '')}
              style={inputStyle}
            />
          </div>

          <div style={inputContainerStyle}>
            <IonIcon icon={lockClosedOutline} style={iconStyle} />
            <IonInput
              type="password"
              placeholder={t('register.password')}
              value={password}
              onIonInput={(e) => setPassword(e.detail.value || '')}
              style={inputStyle}
            />
          </div>

          {!isPasswordValid && password.length > 0 && (
            <IonText color="danger" style={errorTextStyle}>
              {t('register.passwordError')}
            </IonText>
          )}

          <div style={inputContainerStyle}>
            <IonIcon icon={lockClosedOutline} style={iconStyle} />
            <IonInput
              type="password"
              placeholder={t('register.confirmPassword')}
              value={confirmPassword}
              onIonInput={(e) => setConfirmPassword(e.detail.value || '')}
              style={inputStyle}
            />
          </div>

          <IonText style={labelStyle}>
            {t('register.birthLabel')}
          </IonText>
          <div style={{ display: 'flex', gap: 8, width: '100%', marginBottom: 12 }}>
            <IonSelect
              value={birthYear}
              placeholder={t('register.year')}
              onIonChange={(e) => setBirthYear(e.detail.value)}
              interface="action-sheet"
              style={selectStyle}
            >
              {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                <IonSelectOption key={y} value={y}>{y}</IonSelectOption>
              ))}
            </IonSelect>
            <IonSelect
              value={birthMonth}
              placeholder={t('register.month')}
              onIonChange={(e) => setBirthMonth(e.detail.value)}
              interface="action-sheet"
              style={selectStyle}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <IonSelectOption key={m} value={m}>{m}</IonSelectOption>
              ))}
            </IonSelect>
            <IonSelect
              value={birthDay}
              placeholder={t('register.day')}
              onIonChange={(e) => setBirthDay(e.detail.value)}
              interface="action-sheet"
              style={selectStyle}
            >
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <IonSelectOption key={d} value={d}>{d}</IonSelectOption>
              ))}
            </IonSelect>
          </div>

          {ageError && (
            <IonText color="danger" style={errorTextStyle}>
              {ageError}
            </IonText>
          )}
          {age && age >= 15 && age < 18 && !ageError && (
            <IonText color="warning" style={errorTextStyle}>
              {t('register.ageUnder18')}
            </IonText>
          )}

          <div style={{ alignSelf: 'flex-start', marginBottom: 12, width: '100%' }}>
            <IonText style={labelStyle}>
              {t('gender.title')}
            </IonText>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['male', 'female', 'secret'] as const).map((g) => (
                <IonChip
                  key={g}
                  outline={gender !== g}
                  color={gender === g ? 'primary' : 'medium'}
                  onClick={() => setGender(g)}
                  style={{ cursor: 'pointer' }}
                >
                  {t(`gender.${g}`)}
                </IonChip>
              ))}
            </div>
          </div>

          <div style={{ alignSelf: 'flex-start', marginBottom: 12 }}>
            <label style={agreementLabelStyle}>
              <input
                type="checkbox"
                checked={isAgree}
                onChange={(e) => setIsAgree(e.target.checked)}
                style={{ accentColor: '#C4A882' }}
              />
              {t('register.agree')}{' '}
              <span
                onClick={() =>
                  setLegalModal({ file: 'privacy-policy.md', titleKey: 'legal.privacyPolicy' })
                }
                style={linkStyle}
              >
                {t('register.privacy')}
              </span>
              {' & '}
              <span
                onClick={() =>
                  setLegalModal({ file: 'terms-of-service.md', titleKey: 'legal.termsOfService' })
                }
                style={linkStyle}
              >
                {t('register.terms')}
              </span>
            </label>
          </div>

          {showFormHint && !isFormValid && (
            <IonText color="warning" style={errorTextStyle}>
              {t('register.fillAllFields')}
            </IonText>
          )}

          <IonButton
            expand="block"
            disabled={!isFormValid || isLoading}
            onClick={handleRegister}
            style={{
              '--background': isFormValid ? '#C4A882' : '#E0D8CE',
              '--border-radius': '24px',
              height: 48,
              fontSize: 16,
              fontWeight: 600,
              opacity: isFormValid ? 1 : 0.5,
            }}
          >
            {isLoading ? <IonSpinner name="crescent" /> : t('register.submit')}
          </IonButton>

          <div style={dividerContainerStyle}>
            <div style={dividerLineStyle} />
            <IonText style={dividerTextStyle}>
              {t('register.orDivider')}
            </IonText>
            <div style={dividerLineStyle} />
          </div>

          <IonButton
            expand="block"
            fill="outline"
            onClick={handleGoogle}
            disabled={isLoading}
            style={googleButtonStyle}
          >
            <IonIcon icon={logoGoogle} slot="start" />
            {t('register.googleLogin')}
          </IonButton>

          <IonText style={{ fontSize: 13, color: '#8B7D72', marginBottom: 32 }}>
            {t('register.hasAccount')}{' '}
            <span
              onClick={() => history.push('/login')}
              style={linkStyle}
            >
              {t('register.loginLink')}
            </span>
          </IonText>
        </div>

        <IonModal isOpen={showGuardian}>
          <GuardianVerification onSuccess={handleGuardianSuccess} />
        </IonModal>

        {legalModal && (
          <LegalModal
            isOpen={!!legalModal}
            fileName={legalModal.file}
            titleKey={legalModal.titleKey}
            onClose={() => setLegalModal(null)}
          />
        )}
      </IonContent>

      <LanguageSelector
        isOpen={showLang}
        onClose={() => setShowLang(false)}
        event={langEvent}
      />
    </IonPage>
  );
};

const inputContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: '4px 16px',
  marginBottom: 12,
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
};

const iconStyle: React.CSSProperties = {
  color: '#8B7D72',
  marginRight: 8,
  fontSize: 20,
};

const inputStyle: React.CSSProperties = {
  '--placeholder-color': '#8B7D72',
  fontSize: 15,
} as any;

const labelStyle: React.CSSProperties = {
  fontSize: 14,
  color: '#8B7D72',
  alignSelf: 'flex-start',
  marginBottom: 4,
};

const selectStyle: React.CSSProperties = {
  flex: 1,
  backgroundColor: '#fff',
  borderRadius: 12,
  fontSize: 14,
};

const errorTextStyle: React.CSSProperties = {
  fontSize: 12,
  marginBottom: 8,
};

const agreementLabelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  cursor: 'pointer',
  fontSize: 13,
  color: '#3D362F',
};

const linkStyle: React.CSSProperties = {
  color: '#4A90D9',
  textDecoration: 'underline',
  cursor: 'pointer',
};

const dividerContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  margin: '20px 0',
};

const dividerLineStyle: React.CSSProperties = {
  flex: 1,
  height: 1,
  backgroundColor: '#E0D8CE',
};

const dividerTextStyle: React.CSSProperties = {
  fontSize: 13,
  color: '#E0D8CE',
  margin: '0 12px',
};

const googleButtonStyle: React.CSSProperties = {
  '--background': '#fff',
  '--color': '#3D362F',
  '--border-color': '#E0D8CE',
  '--border-radius': '24px',
  height: 48,
  fontSize: 14,
  fontWeight: 500,
  marginBottom: 24,
};

export default RegisterPage;