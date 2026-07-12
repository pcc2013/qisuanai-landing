import React, { useEffect, useState } from 'react';
import { IonChip, IonIcon, IonLabel } from '@ionic/react';
import { heart } from 'ionicons/icons';
import './toast-base.css';

interface IntimacyToastProps {
  visible: boolean;
  level: number;
  change: number;
  autoHide?: boolean;
  duration?: number;
}

const IntimacyToast: React.FC<IntimacyToastProps> = ({
  visible,
  level,
  change,
  autoHide = true,
  duration = 3000,
}) => {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    setShow(visible);
    if (visible && autoHide) {
      const timer = setTimeout(() => setShow(false), duration);
      return () => clearTimeout(timer);
    }
    return;
  }, [visible, autoHide, duration]);

  if (!show) return null;

  return (
    <div className="toast-base toast-active">
      <IonChip color="danger">
        <IonIcon icon={heart} />
        <IonLabel>
          亲密度 {change > 0 ? '+' : ''}{change} · 当前 Lv.{level}
        </IonLabel>
      </IonChip>
    </div>
  );
};

export default IntimacyToast;