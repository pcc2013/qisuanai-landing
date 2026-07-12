// D:\nira-app\src\components\VoiceRecordButton.tsx

import React, { useState, useRef } from 'react';
import { IonButton, IonIcon, IonText, useIonToast } from '@ionic/react';
import { micOutline } from 'ionicons/icons';
import { useLocaleStore } from '../store/useLocaleStore';
import { voiceRecorderAdapter } from '../adapters/voiceRecorder';

interface VoiceRecordButtonProps {
  onFinish: (blob: Blob) => void;
}

export const VoiceRecordButton: React.FC<VoiceRecordButtonProps> = ({ onFinish }) => {
  const { t } = useLocaleStore();
  const [presentToast] = useIonToast();
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startRef = useRef(0);

  const MAX_DURATION = 8;

  const start = async () => {
    try {
      await voiceRecorderAdapter.startRecording();
      setIsRecording(true);
      setRecordDuration(0);
      startRef.current = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startRef.current) / 1000);
        setRecordDuration(elapsed);
        if (elapsed >= MAX_DURATION) {
          stop();
        }
      }, 200);
    } catch {
      presentToast({ message: t('voiceRecord.fail') || 'Recording failed', duration: 1500, color: 'danger' });
    }
  };

  const stop = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    try {
      const blob = await voiceRecorderAdapter.stopRecording();
      if (blob.size > 0) onFinish(blob);
    } catch {}
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <IonButton
        fill={isRecording ? 'solid' : 'outline'}
        color={isRecording ? 'danger' : 'primary'}
        style={{ '--background': isRecording ? '#E88B7D' : undefined, '--color': isRecording ? '#fff' : '#C4A882', '--border-color': '#C4A882', borderRadius: '50%', width: 44, height: 44, '--padding-start': 4, '--padding-end': 4 }}
        onMouseDown={start}
        onMouseUp={stop}
        onTouchStart={start}
        onTouchEnd={stop}
      >
        <IonIcon icon={micOutline} style={{ fontSize: 22 }} />
      </IonButton>
      {isRecording && (
        <IonText style={{ fontSize: 13, color: '#E88B7D', animation: 'pulse 1s infinite' }}>
          {t('voiceRecord.recording') || 'Recording...'} {recordDuration}s
        </IonText>
      )}
    </div>
  );
};
export default VoiceRecordButton;