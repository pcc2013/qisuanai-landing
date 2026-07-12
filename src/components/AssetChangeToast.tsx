import React, { useEffect, useState } from 'react';
import { IonChip, IonIcon, IonLabel } from '@ionic/react';
import { sparkles } from 'ionicons/icons';
import './toast-base.css';

interface AssetChangeToastProps {
  visible: boolean;
  changeAmount: number | null;
  reason: string;
  autoHide?: boolean;
  duration?: number;
}

const AssetChangeToast: React.FC<AssetChangeToastProps> = ({
  visible,
  changeAmount,
  reason,
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

  const isPlaceholder = changeAmount === null;

  return (
    <div className={`toast-base ${isPlaceholder ? 'toast-placeholder' : 'toast-active'}`}>
      <IonChip color={isPlaceholder ? 'medium' : 'tertiary'}>
        <IonIcon icon={sparkles} />
        <IonLabel>
          {isPlaceholder
            ? '注意力资产变化提示将在这里显示'
            : `注意力资产 ${changeAmount! > 0 ? '+' : ''}${changeAmount} · ${reason}`}
        </IonLabel>
      </IonChip>
    </div>
  );
};

export default AssetChangeToast;