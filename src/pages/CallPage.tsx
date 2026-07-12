// D:\nira-app\src\pages\CallPage.tsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { IonPage, IonContent, IonButton, IonIcon, IonText, IonModal, useIonToast } from '@ionic/react';
import { micOffOutline, volumeHighOutline, volumeMuteOutline, videocamOutline, videocamOffOutline, closeCircleOutline } from 'ionicons/icons';
import { useHistory, useParams } from 'react-router-dom';
import { useLocaleStore } from '../store/useLocaleStore';
import { useQSStore } from '../store/useQSStore';
import { PERSONA_CHARACTERS, VOICE_CALL_RATE, VIDEO_CALL_RATE } from '../store/usePersonaStore';
import { messageStreamAdapter } from '../adapters/messageStream';
import { useVoicePlayer } from '../hooks/useVoicePlayer';

const CallPage: React.FC = () => {
  const history = useHistory();
  const { callType, targetId } = useParams<{ callType: 'voice' | 'video'; targetId: string }>();
  const { t } = useLocaleStore();
  const { deductQS } = useQSStore();
  const [presentToast] = useIonToast();
  const { speak, stop } = useVoicePlayer();

  const [callDuration, setCallDuration] = useState(0);
  const [consumedQS, setConsumedQS] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(callType !== 'voice');
  const [is60MinWarning, setIs60MinWarning] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasFinishedRef = useRef(false);

  const character = (PERSONA_CHARACTERS || []).find(c => c.id === targetId);
  const isVideo = callType === 'video';
  const rate = isVideo ? VIDEO_CALL_RATE : VOICE_CALL_RATE;

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const saveAndClose = useCallback(() => {
    const totalQS = Math.ceil(callDuration * (rate / 60));
    if (totalQS > 0) deductQS(
  totalQS,
  isVideo
    ? t('call.typeVideoCall', { name: character?.name || targetId })
    : t('call.typeVoiceCall', { name: character?.name || targetId })
);
    messageStreamAdapter.saveCallRecord({
      id: `call_${Date.now()}`, targetId: targetId || 'unknown', targetType: 'digital',
      duration: callDuration, consumedQS: totalQS, time: new Date().toISOString(),
    });
    stop();
  }, [callDuration, rate, targetId, character, isVideo, deductQS, stop]);

  useEffect(() => {
    hasFinishedRef.current = false;

    // 语音通话：播放欢迎语
    if (callType === 'voice') {
      const welcomeText = character
        ? `你好，我是${character.name}，很高兴和你通话。`
        : '你好，很高兴和你通话。';
      speak(welcomeText);
    }

    timerRef.current = setInterval(() => {
      setCallDuration(prev => {
        const next = prev + 1;
        if (next >= 3300 && !is60MinWarning) setIs60MinWarning(true);
        if (next >= 3600 && !hasFinishedRef.current) { hasFinishedRef.current = true; clearTimer(); setShowDetail(true); saveAndClose(); }
        return next;
      });
      setConsumedQS(prev => prev + rate / 60);
    }, 1000);
    return () => { clearTimer(); stop(); };
  }, []);

  const handleHangUp = () => { clearTimer(); saveAndClose(); setShowDetail(true); };
  const handleClose = () => { stop(); history.push('/home'); };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60); const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <IonPage>
      <IonContent style={{ '--background': '#1a1a2e' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#fff', position: 'relative' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontSize: 36, overflow: 'hidden' }}>
            <img src={character?.avatar || '/nira_logo.png'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = '/nira_logo.png'; }} />
          </div>
          <IonText style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{character?.name || targetId}</IonText>
          <IonText style={{ fontSize: 18, color: '#8B7D72', marginBottom: 4 }}>{isVideo ? t('call.title') || '视频通话' : t('call.title') || '语音通话'}</IonText>
          <IonText style={{ fontSize: 32, fontWeight: 300, marginBottom: 4 }}>{formatTime(callDuration)}</IonText>
          {is60MinWarning && <IonText color="warning" style={{ fontSize: 13, marginTop: 8 }}>{t('call.60minWarn') || '通话将在5分钟后结束'}</IonText>}
          <div style={{ display: 'flex', gap: 24, marginTop: 48 }}>
            <IonButton fill="clear" onClick={() => setIsMuted(!isMuted)} style={{ '--color': isMuted ? '#E88B7D' : '#fff', width: 56, height: 56 }}><IonIcon icon={micOffOutline} style={{ fontSize: 28 }} /></IonButton>
            <IonButton fill="clear" onClick={() => setIsSpeakerOn(!isSpeakerOn)} style={{ '--color': isSpeakerOn ? '#fff' : '#888', width: 56, height: 56 }}><IonIcon icon={isSpeakerOn ? volumeHighOutline : volumeMuteOutline} style={{ fontSize: 28 }} /></IonButton>
            {isVideo && <IonButton fill="clear" onClick={() => setIsCameraOn(!isCameraOn)} style={{ '--color': isCameraOn ? '#fff' : '#E88B7D', width: 56, height: 56 }}><IonIcon icon={isCameraOn ? videocamOutline : videocamOffOutline} style={{ fontSize: 28 }} /></IonButton>}
            <IonButton fill="solid" onClick={handleHangUp} style={{ '--background': '#E88B7D', width: 56, height: 56, '--border-radius': '50%' }}><IonIcon icon={closeCircleOutline} style={{ fontSize: 28 }} /></IonButton>
          </div>
        </div>
        <IonModal isOpen={showDetail}>
          <div style={{ padding: 24, textAlign: 'center' }}>
            <IonText style={{ fontSize: 18, fontWeight: 600, color: '#3D362F', display: 'block', marginBottom: 16 }}>{t('call.detailTitle') || '通话明细'}</IonText>
            <IonText style={{ fontSize: 14, color: '#8B7D72' }}>{t('call.totalDuration') || '通话对象'}: {character?.name || targetId}</IonText><br />
            <IonText style={{ fontSize: 14, color: '#8B7D72' }}>{t('call.totalDuration') || '总时长'}: {formatTime(callDuration)}</IonText><br />
            <IonText style={{ fontSize: 14, color: '#8B7D72', marginBottom: 16 }}>{t('call.totalQs') || '总消耗'}: {Math.ceil(consumedQS)} QS</IonText>
            <IonButton expand="block" onClick={handleClose} style={{ '--background': '#C4A882' }}>OK</IonButton>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default CallPage;