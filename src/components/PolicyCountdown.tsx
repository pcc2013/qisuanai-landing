// D:\nira-app\src\components\PolicyCountdown.tsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { IonButton, IonText } from '@ionic/react';
import { useLocaleStore } from '../store/useLocaleStore';

interface PolicyCountdownProps {
  duration: number;
  onFinish: () => void;
}

export const PolicyCountdown: React.FC<PolicyCountdownProps> = ({ duration, onFinish }) => {
  const { t } = useLocaleStore();
  const [countdown, setCountdown] = useState(duration);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasFinishedRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    // duration 变更时重置倒计时
    hasFinishedRef.current = false;
    setCountdown(duration);
    clearTimer();

    // duration=0 兜底：直接触发完成
    if (duration <= 0) {
      if (!hasFinishedRef.current) {
        hasFinishedRef.current = true;
        onFinish();
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearTimer();
          if (!hasFinishedRef.current) {
            hasFinishedRef.current = true;
            // 异步调用避免 setState 中直接回调
            setTimeout(() => onFinish(), 0);
          }
          return 0;
        }
        return next;
      });
    }, 1000);

    return clearTimer;
  }, [duration, onFinish, clearTimer]);

  return (
    <div style={styles.container}>
      <IonText style={styles.tip}>
        {countdown > 0
          ? `${t('policyCountdown.tip') || 'Please read the policy'} (${countdown}s)`
          : t('policyCountdown.done') || 'You may now continue'}
      </IonText>
      <IonButton
        expand="block"
        disabled={countdown > 0}
        onClick={onFinish}
        style={styles.button}
      >
        {t('register.submit') || 'Confirm'}
      </IonButton>
    </div>
  );
};

const styles = {
  container: {
    padding: 24,
    textAlign: 'center' as const,
  },
  tip: {
    fontSize: 14,
    color: '#8B7D72',
  },
  button: {
    '--background': '#C4A882',
    marginTop: 16,
    '--border-radius': '24px',
  },
};
export default PolicyCountdown;